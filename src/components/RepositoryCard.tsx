import {ArchiveIcon, ChevronDownIcon, GitBranchIcon, LinkExternalIcon, RepoForkedIcon, StarIcon} from '@primer/octicons-react'
import {useState} from 'react'
import {formatKoreanDate} from '../lib/repositories'
import type {Repository} from '../types/repository'
import {ReadmePreview} from './ReadmePreview'

const languageColors: Record<string, string> = {
  TypeScript: '#3178c6', JavaScript: '#f1e05a', Java: '#b07219', Python: '#3572a5',
  HTML: '#e34c26', CSS: '#663399', Shell: '#89e051', PLpgSQL: '#336790',
}

interface RepositoryCardProps {
  repository: Repository
  onGroupSelect: (group: string) => void
}

export function RepositoryCard({repository, onGroupSelect}: RepositoryCardProps) {
  const [expandedCategoryIds, setExpandedCategoryIds] = useState<Set<string>>(() => new Set())

  const toggleCategory = (categoryId: string) => {
    setExpandedCategoryIds(current => {
      const next = new Set(current)
      if (next.has(categoryId)) next.delete(categoryId)
      else next.add(categoryId)
      return next
    })
  }

  return (
    <article className="repository-card">
      <div className="repository-card__header">
        <div>
          <div className="badges">
            <span className="badge badge--public">Public</span>
            {repository.fork && <span className="badge"><RepoForkedIcon size={12} /> Fork</span>}
            {repository.archived && <span className="badge"><ArchiveIcon size={12} /> Archived</span>}
          </div>
          <h2><a href={repository.htmlUrl} target="_blank" rel="noreferrer">{repository.name}</a></h2>
        </div>
        <a className="icon-button icon-button--small" href={repository.htmlUrl} target="_blank" rel="noreferrer" aria-label={`${repository.name} GitHub에서 열기`}>
          <LinkExternalIcon size={17} />
        </a>
      </div>

      <p className={`repository-card__description${repository.description ? '' : ' is-empty'}`}>
        {repository.description ?? 'GitHub에 등록된 한 줄 소개가 없습니다.'}
      </p>

      {repository.categories && repository.categories.length > 0 && (
        <div className="group-list" aria-label="그룹">
          {repository.categories.map(category => {
            const detailsId = `repository-${repository.id}-category-${category.id}`
            const isExpanded = expandedCategoryIds.has(category.id)
            const detailCount = category.groups.length

            return (
              <div className={`group-category group-category--${category.id}`} key={category.id}>
                <div className="group-category__heading">
                  <button className="group-chip" type="button" onClick={() => onGroupSelect(category.id)}>
                    #{category.label}
                  </button>
                  {detailCount > 0 && (
                    <button
                      aria-controls={detailsId}
                      aria-expanded={isExpanded}
                      aria-label={`${category.label} 세부 그룹 ${detailCount}개 ${isExpanded ? '접기' : '펼치기'}`}
                      className="group-disclosure"
                      type="button"
                      onClick={() => toggleCategory(category.id)}
                    >
                      <ChevronDownIcon className="group-disclosure__icon" size={14} />
                      세부 그룹 {detailCount}개
                    </button>
                  )}
                </div>
                {detailCount > 0 && (
                  <div className="group-category__children" id={detailsId} aria-label={`${category.label} 세부 그룹`} hidden={!isExpanded}>
                    {category.groups.map(group => (
                      <button className="group-chip" key={group.id} type="button" onClick={() => onGroupSelect(group.id)}>
                        #{group.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <div className="repository-meta">
        <span><StarIcon size={15} /> {repository.stars}</span>
        <span><RepoForkedIcon size={15} /> {repository.forks}</span>
        <span><GitBranchIcon size={15} /> 브랜치 {repository.branches.length}</span>
        <span>수정 {formatKoreanDate(repository.pushedAt || repository.updatedAt)}</span>
      </div>

      {repository.languages.length > 0 && (
        <div className="languages">
          <div className="language-bar" aria-hidden="true">
            {repository.languages.map(language => (
              <span key={language.name} style={{width: `${language.percentage}%`, background: languageColors[language.name] ?? '#8c959f'}} />
            ))}
          </div>
          <div className="language-list">
            {repository.languages.slice(0, 4).map(language => (
              <span key={language.name}>
                <i style={{background: languageColors[language.name] ?? '#8c959f'}} />
                {language.name} <small>{language.percentage}%</small>
              </span>
            ))}
          </div>
        </div>
      )}

      <ReadmePreview repository={repository} />
    </article>
  )
}
