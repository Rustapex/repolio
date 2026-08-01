import {useMemo, useState} from 'react'
import catalogData from '../generated/repositories.json'
import groupData from './data/groups.json'
import {Header} from './components/Header'
import {RepositoryCard} from './components/RepositoryCard'
import {RepositoryFilters} from './components/RepositoryFilters'
import {useTheme} from './hooks/useTheme'
import {attachGroups, collectGroups, collectLanguages, filterRepositories} from './lib/repositories'
import type {RepositoryCatalog, RepositoryFilters as FilterState, RepositoryGroupMap} from './types/repository'

const catalog = catalogData as RepositoryCatalog
const initialFilters: FilterState = {query: '', type: 'all', language: '', group: '', sort: 'updated'}

export default function App() {
  const {theme, toggleTheme} = useTheme()
  const [filters, setFilters] = useState(initialFilters)
  const repositories = useMemo(
    () => attachGroups(catalog.repositories, groupData as RepositoryGroupMap),
    [],
  )
  const filteredRepositories = useMemo(
    () => filterRepositories(repositories, filters),
    [repositories, filters],
  )

  return (
    <div className="app">
      <Header generatedAt={catalog.generatedAt} repositoryCount={repositories.length} theme={theme} onToggleTheme={toggleTheme} />
      <main className="page-shell main-content">
        {catalog.warnings.length > 0 && (
          <details className="sync-warning">
            <summary>동기화 알림 {catalog.warnings.length}건</summary>
            <ul>{catalog.warnings.map(warning => <li key={warning}>{warning}</li>)}</ul>
          </details>
        )}
        <RepositoryFilters
          filters={filters}
          languages={collectLanguages(repositories)}
          groups={collectGroups(repositories)}
          resultCount={filteredRepositories.length}
          totalCount={repositories.length}
          onChange={setFilters}
        />

        {filteredRepositories.length > 0 ? (
          <section className="repository-grid" aria-label="저장소 목록">
            {filteredRepositories.map(repository => <RepositoryCard key={repository.id} repository={repository} />)}
          </section>
        ) : (
          <section className="empty-state">
            <h2>조건에 맞는 저장소가 없습니다.</h2>
            <p>검색어를 바꾸거나 필터를 초기화해 보세요.</p>
          </section>
        )}
      </main>
      <footer className="site-footer page-shell">
        <span>GitHub 공개 데이터로 자동 갱신됩니다.</span>
        <a href="https://github.com/Rustapex/repolio" target="_blank" rel="noreferrer">Repolio source</a>
      </footer>
    </div>
  )
}
