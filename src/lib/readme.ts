import type {Repository} from '../types/repository'

const absoluteProtocol = /^[a-z][a-z\d+.-]*:/i

export function resolveReadmeUrl(
  url: string | undefined,
  repository: Repository,
  kind: 'link' | 'image',
): string | undefined {
  if (!url || url.startsWith('#') || absoluteProtocol.test(url) || url.startsWith('//')) {
    return url
  }

  const normalized = url.replace(/^\.\//, '')
  const base = kind === 'image'
    ? `https://raw.githubusercontent.com/${repository.fullName}/${repository.defaultBranch}/`
    : `${repository.htmlUrl}/blob/${repository.defaultBranch}/`

  return new URL(normalized, base).toString()
}
