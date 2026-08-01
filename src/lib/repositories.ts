import type {
  Repository,
  RepositoryFilters,
  RepositoryGroupMap,
} from '../types/repository'

export function attachGroups(
  repositories: Repository[],
  groupMap: RepositoryGroupMap,
): Repository[] {
  return repositories.map(repository => ({
    ...repository,
    groups: [...new Set(groupMap[repository.name] ?? [])].sort((a, b) =>
      a.localeCompare(b, 'ko'),
    ),
  }))
}

export function filterRepositories(
  repositories: Repository[],
  filters: RepositoryFilters,
): Repository[] {
  const query = filters.query.trim().toLocaleLowerCase('ko')

  const filtered = repositories.filter(repository => {
    if (repository.visibility !== 'public') return false
    if (filters.type === 'source' && (repository.fork || repository.archived)) return false
    if (filters.type === 'fork' && !repository.fork) return false
    if (filters.type === 'archived' && !repository.archived) return false
    if (
      filters.language &&
      !repository.languages.some(language => language.name === filters.language)
    ) {
      return false
    }
    if (filters.group && !repository.groups?.includes(filters.group)) return false

    if (!query) return true

    const searchable = [
      repository.name,
      repository.fullName,
      repository.description ?? '',
      ...repository.topics,
      ...(repository.groups ?? []),
    ]
      .join(' ')
      .toLocaleLowerCase('ko')

    return searchable.includes(query)
  })

  return [...filtered].sort((left, right) => {
    if (filters.sort === 'name') return left.name.localeCompare(right.name, 'ko')
    if (filters.sort === 'stars') return right.stars - left.stars
    return Date.parse(right.updatedAt) - Date.parse(left.updatedAt)
  })
}

export function collectLanguages(repositories: Repository[]): string[] {
  return [...new Set(repositories.flatMap(repository => repository.languages.map(({name}) => name)))]
    .sort((a, b) => a.localeCompare(b, 'ko'))
}

export function collectGroups(repositories: Repository[]): string[] {
  return [...new Set(repositories.flatMap(repository => repository.groups ?? []))]
    .sort((a, b) => a.localeCompare(b, 'ko'))
}

export function formatKoreanDate(value: string): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(value))
}
