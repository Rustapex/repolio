import {SearchIcon, XIcon} from '@primer/octicons-react'
import type {RepositoryFilters as FilterState, RepositorySort, RepositoryTypeFilter} from '../types/repository'

interface RepositoryFiltersProps {
  filters: FilterState
  languages: string[]
  groups: string[]
  resultCount: number
  totalCount: number
  onChange: (filters: FilterState) => void
}

export function RepositoryFilters({filters, languages, groups, resultCount, totalCount, onChange}: RepositoryFiltersProps) {
  const update = <Key extends keyof FilterState>(key: Key, value: FilterState[Key]) => {
    onChange({...filters, [key]: value})
  }
  const hasFilters = Boolean(filters.query || filters.language || filters.group || filters.type !== 'all' || filters.sort !== 'updated')

  return (
    <section className="filters" aria-label="저장소 검색 및 필터">
      <div className="filters__topline">
        <div>
          <span className="filters__count">{resultCount}</span>
          <span className="filters__total"> / {totalCount} repositories</span>
        </div>
        {hasFilters && (
          <button className="text-button" type="button" onClick={() => onChange({query: '', type: 'all', language: '', group: '', sort: 'updated'})}>
            <XIcon size={14} /> 조건 초기화
          </button>
        )}
      </div>

      <div className="filters__controls">
        <label className="search-field">
          <span className="sr-only">저장소 검색</span>
          <SearchIcon size={18} />
          <input value={filters.query} onChange={event => update('query', event.target.value)} placeholder="이름, 설명, 토픽 검색" type="search" />
        </label>

        <FilterSelect label="유형" value={filters.type} onChange={value => update('type', value as RepositoryTypeFilter)}>
          <option value="all">전체 유형</option>
          <option value="source">원본</option>
          <option value="fork">Fork</option>
          <option value="archived">보관됨</option>
        </FilterSelect>

        <FilterSelect label="언어" value={filters.language} onChange={value => update('language', value)}>
          <option value="">전체 언어</option>
          {languages.map(language => <option key={language} value={language}>{language}</option>)}
        </FilterSelect>

        <FilterSelect label="그룹" value={filters.group} onChange={value => update('group', value)}>
          <option value="">전체 그룹</option>
          {groups.map(group => <option key={group} value={group}>{group}</option>)}
        </FilterSelect>

        <FilterSelect label="정렬" value={filters.sort} onChange={value => update('sort', value as RepositorySort)}>
          <option value="updated">최근 수정</option>
          <option value="name">이름</option>
          <option value="stars">Stars</option>
        </FilterSelect>
      </div>
    </section>
  )
}

function FilterSelect({label, value, onChange, children}: {label: string; value: string; onChange: (value: string) => void; children: React.ReactNode}) {
  return (
    <label className="select-field">
      <span className="sr-only">{label}</span>
      <select value={value} onChange={event => onChange(event.target.value)} aria-label={label}>
        {children}
      </select>
    </label>
  )
}
