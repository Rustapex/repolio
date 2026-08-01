import {mkdir, writeFile} from 'node:fs/promises'

const owner = process.env.GITHUB_OWNER ?? 'Rustapex'
const apiRoot = 'https://api.github.com'
const outputPath = new URL('../generated/repositories.json', import.meta.url)
const token = process.env.GITHUB_TOKEN?.trim()
const readmeLimit = 32_000

const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'repolio-sync',
  'X-GitHub-Api-Version': '2022-11-28',
  ...(token ? {Authorization: `Bearer ${token}`} : {}),
}

async function fetchJson(url) {
  const response = await fetch(url, {headers})
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`)
  return response.json()
}

async function fetchPublicRepositories() {
  const repositories = []
  for (let page = 1; ; page += 1) {
    const url = `${apiRoot}/users/${encodeURIComponent(owner)}/repos?type=owner&sort=updated&direction=desc&per_page=100&page=${page}`
    const batch = await fetchJson(url)
    repositories.push(...batch)
    if (batch.length < 100) break
  }
  return repositories.filter(repository => repository.private === false && repository.visibility === 'public')
}

async function fetchLanguages(repository) {
  const languageBytes = await fetchJson(repository.languages_url)
  const total = Object.values(languageBytes).reduce((sum, bytes) => sum + bytes, 0)
  return Object.entries(languageBytes)
    .map(([name, bytes]) => ({
      name,
      bytes,
      percentage: total === 0 ? 0 : Number(((bytes / total) * 100).toFixed(1)),
    }))
    .sort((left, right) => right.bytes - left.bytes)
}

async function fetchReadme(repository) {
  const branch = encodeURIComponent(repository.default_branch)
  const fullName = repository.full_name.split('/').map(encodeURIComponent).join('/')
  for (const filename of ['README.md', 'readme.md', 'README.MD']) {
    const response = await fetch(`https://raw.githubusercontent.com/${fullName}/${branch}/${filename}`)
    if (response.ok) return (await response.text()).slice(0, readmeLimit)
    if (response.status !== 404) throw new Error(`${response.status} ${response.statusText}`)
  }
  return null
}

async function normalizeRepository(repository, warnings) {
  let languages = []
  let readme = null

  const [languageResult, readmeResult] = await Promise.allSettled([
    fetchLanguages(repository),
    fetchReadme(repository),
  ])

  if (languageResult.status === 'fulfilled') languages = languageResult.value
  else warnings.push(`${repository.name}: 언어 정보를 불러오지 못했습니다.`)

  if (readmeResult.status === 'fulfilled') readme = readmeResult.value
  else warnings.push(`${repository.name}: README를 불러오지 못했습니다.`)

  return {
    id: repository.id,
    name: repository.name,
    fullName: repository.full_name,
    htmlUrl: repository.html_url,
    description: repository.description,
    homepage: repository.homepage || null,
    visibility: 'public',
    fork: repository.fork,
    archived: repository.archived,
    defaultBranch: repository.default_branch,
    primaryLanguage: repository.language,
    languages,
    topics: repository.topics ?? [],
    stars: repository.stargazers_count,
    forks: repository.forks_count,
    createdAt: repository.created_at,
    updatedAt: repository.updated_at,
    pushedAt: repository.pushed_at,
    readme,
    license: repository.license?.spdx_id ?? null,
  }
}

const source = `${apiRoot}/users/${owner}/repos`
const warnings = []
const publicRepositories = await fetchPublicRepositories()
const repositories = []

for (let index = 0; index < publicRepositories.length; index += 5) {
  const batch = publicRepositories.slice(index, index + 5)
  repositories.push(...await Promise.all(batch.map(repository => normalizeRepository(repository, warnings))))
}

const catalog = {
  generatedAt: new Date().toISOString(),
  owner,
  source,
  repositories,
  warnings,
}

await mkdir(new URL('../generated/', import.meta.url), {recursive: true})
await writeFile(outputPath, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8')
console.log(`동기화 완료: 공개 저장소 ${repositories.length}개, 경고 ${warnings.length}개`)
