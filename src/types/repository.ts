export type RepositoryGroupMap = Record<string, string[]>

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
  groups?: string[]
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
