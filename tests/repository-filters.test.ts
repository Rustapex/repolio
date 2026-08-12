import {describe, expect, it} from 'vitest'
import {attachGroups, filterRepositories} from '../src/lib/repositories'
import type {Repository, RepositoryFilters, RepositoryGroupCatalog} from '../src/types/repository'

function repository(overrides: Partial<Repository> = {}): Repository {
  return {
    id: 1,
    name: 'alpha',
    fullName: 'Rustapex/alpha',
    htmlUrl: 'https://github.com/Rustapex/alpha',
    description: 'TypeScript example',
    homepage: null,
    visibility: 'public',
    fork: false,
    archived: false,
    defaultBranch: 'main',
    branches: ['main'],
    primaryLanguage: 'TypeScript',
    languages: [{name: 'TypeScript', bytes: 100, percentage: 100}],
    topics: ['portfolio'],
    stars: 2,
    forks: 0,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-03-01T00:00:00Z',
    pushedAt: '2025-03-01T00:00:00Z',
    readme: '# Alpha',
    license: 'MIT',
    ...overrides,
  }
}

const defaults: RepositoryFilters = {query: '', type: 'all', language: '', group: '', sort: 'updated'}

function groupCatalog(repositories: Record<string, string[]>): RepositoryGroupCatalog {
  return {
    categories: {
      frontend: {label: 'Frontend', groups: ['react']},
      backend: {label: 'Backend', groups: ['spring-boot']},
    },
    groups: {
      react: {label: 'React'},
      'spring-boot': {label: 'Spring Boot'},
    },
    repositories,
  }
}

describe('attachGroups', () => {
  it('사용자가 지정한 그룹을 저장소 이름으로 병합하고 중복을 제거한다', () => {
    const [result] = attachGroups([repository()], groupCatalog({alpha: ['react', 'react']}))
    expect(result.groups?.map(group => group.id)).toEqual(['react'])
    expect(result.categories?.map(category => category.id)).toEqual(['frontend'])
    expect(result.categories?.[0].groups.map(group => group.id)).toEqual(['react'])
  })

  it('상위 그룹마다 소속된 하위 그룹만 별도로 만든다', () => {
    const [result] = attachGroups([repository()], groupCatalog({alpha: ['react', 'spring-boot']}))

    expect(result.categories?.map(category => ({
      id: category.id,
      groups: category.groups.map(group => group.id),
    }))).toEqual([
      {id: 'backend', groups: ['spring-boot']},
      {id: 'frontend', groups: ['react']},
    ])
  })

  it('그룹 설정이 없는 저장소도 빈 배열로 유지한다', () => {
    const [result] = attachGroups([repository()], groupCatalog({}))
    expect(result.groups).toEqual([])
    expect(result.categories).toEqual([])
  })
})

describe('filterRepositories', () => {
  const repositories = attachGroups([
    repository(),
    repository({id: 2, name: 'beta', fullName: 'Rustapex/beta', fork: true, primaryLanguage: 'Python', languages: [{name: 'Python', bytes: 50, percentage: 100}], stars: 10, updatedAt: '2025-02-01T00:00:00Z'}),
    repository({id: 3, name: 'legacy', fullName: 'Rustapex/legacy', archived: true, updatedAt: '2024-01-01T00:00:00Z'}),
  ], groupCatalog({alpha: ['react'], beta: ['spring-boot']}))

  it('언어와 그룹 조건을 함께 적용한다', () => {
    const results = filterRepositories(repositories, {...defaults, language: 'TypeScript', group: 'frontend'})
    expect(results.map(({name}) => name)).toEqual(['alpha'])
  })

  it('상위 그룹과 세부 그룹을 각각 필터링한다', () => {
    expect(filterRepositories(repositories, {...defaults, group: 'frontend'}).map(({name}) => name)).toEqual(['alpha'])
    expect(filterRepositories(repositories, {...defaults, group: 'spring-boot'}).map(({name}) => name)).toEqual(['beta'])
  })

  it('fork와 archived 유형을 정확히 구분한다', () => {
    expect(filterRepositories(repositories, {...defaults, type: 'fork'}).map(({name}) => name)).toEqual(['beta'])
    expect(filterRepositories(repositories, {...defaults, type: 'archived'}).map(({name}) => name)).toEqual(['legacy'])
  })

  it('stars 내림차순으로 정렬한다', () => {
    expect(filterRepositories(repositories, {...defaults, sort: 'stars'}).map(({name}) => name)).toEqual(['beta', 'alpha', 'legacy'])
  })

  it('최근 수정 정렬은 저장소 메타데이터 갱신 시각 대신 마지막 push 시각을 사용한다', () => {
    const results = filterRepositories([
      repository({name: 'metadata-only', updatedAt: '2025-04-01T00:00:00Z', pushedAt: '2025-01-01T00:00:00Z'}),
      repository({id: 2, name: 'recent-push', updatedAt: '2025-02-01T00:00:00Z', pushedAt: '2025-03-01T00:00:00Z'}),
    ], defaults)

    expect(results.map(({name}) => name)).toEqual(['recent-push', 'metadata-only'])
  })
})
