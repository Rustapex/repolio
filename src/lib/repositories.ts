import type {
  Repository,
  RepositoryFilters,
  RepositoryGroup,
  RepositoryGroupCatalog,
} from '../types/repository'

function compareGroups(left: RepositoryGroup, right: RepositoryGroup): number {
  return left.label.localeCompare(right.label, 'ko')
}

export function attachGroups(
  repositories: Repository[],
  groupCatalog: RepositoryGroupCatalog,
): Repository[] {
  return repositories.map(repository => {
    const groupIds = [...new Set(groupCatalog.repositories[repository.name] ?? [])]
    const groups = groupIds
      .map(groupId => {
        const group = groupCatalog.groups[groupId]
        return group ? {id: groupId, label: group.label} : undefined
      })
      .filter((group): group is RepositoryGroup => Boolean(group))
      .sort(compareGroups)
    const categories = Object.entries(groupCatalog.categories)
      .filter(([, category]) => category.groups.some(groupId => groupIds.includes(groupId)))
      .map(([id, category]) => ({id, label: category.label}))
      .sort(compareGroups)

    return {...repository, groups, categories}
  })
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
    if (
      filters.group &&
      !repository.categories?.some(category => category.id === filters.group) &&
      !repository.groups?.some(group => group.id === filters.group)
    ) return false

    if (!query) return true

    const searchable = [
      repository.name,
      repository.fullName,
      repository.description ?? '',
      ...repository.topics,
      ...(repository.categories ?? []).flatMap(category => [category.id, category.label]),
      ...(repository.groups ?? []).flatMap(group => [group.id, group.label]),
    ]
      .join(' ')
      .toLocaleLowerCase('ko')

    return searchable.includes(query)
  })

  return [...filtered].sort((left, right) => {
    if (filters.sort === 'name') return left.name.localeCompare(right.name, 'ko')
    if (filters.sort === 'stars') return right.stars - left.stars
    return Date.parse(right.pushedAt || right.updatedAt) - Date.parse(left.pushedAt || left.updatedAt)
  })
}

export function collectLanguages(repositories: Repository[]): string[] {
  return [...new Set(repositories.flatMap(repository => repository.languages.map(({name}) => name)))]
    .sort((a, b) => a.localeCompare(b, 'ko'))
}

export function collectCategories(repositories: Repository[]): RepositoryGroup[] {
  const categories = new Map<string, RepositoryGroup>()
  repositories.flatMap(repository => repository.categories ?? []).forEach(category => {
    categories.set(category.id, category)
  })
  return [...categories.values()].sort(compareGroups)
}

export function formatKoreanDate(value: string): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(value))
}
