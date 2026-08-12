export interface RepositoryGroup {
  id: string
  label: string
}

export interface RepositoryGroupCategoryItem extends RepositoryGroup {
  groups: RepositoryGroup[]
}

export interface RepositoryGroupDefinition {
  label: string
}

export interface RepositoryGroupCategory {
  label: string
  groups: string[]
}

export interface RepositoryGroupCatalog {
  categories: Record<string, RepositoryGroupCategory>
  groups: Record<string, RepositoryGroupDefinition>
  repositories: Record<string, string[]>
}

export interface LanguageUsage {
  name: string
  bytes: number
  percentage: number
}

export interface Repository {
  id: number
  name: string
  fullName: string
  htmlUrl: string
  description: string | null
  homepage: string | null
  visibility: 'public'
  fork: boolean
  archived: boolean
  defaultBranch: string
  branches: string[]
  primaryLanguage: string | null
  languages: LanguageUsage[]
  topics: string[]
  stars: number
  forks: number
  createdAt: string
  updatedAt: string
  pushedAt: string
  readme: string | null
  license: string | null
  groups?: RepositoryGroup[]
  categories?: RepositoryGroupCategoryItem[]
}

export interface RepositoryCatalog {
  generatedAt: string
  owner: string
  source: string
  repositories: Repository[]
  warnings: string[]
}

export type RepositoryTypeFilter = 'all' | 'source' | 'fork' | 'archived'
export type RepositorySort = 'updated' | 'name' | 'stars'

export interface RepositoryFilters {
  query: string
  type: RepositoryTypeFilter
  language: string
  group: string
  sort: RepositorySort
}
