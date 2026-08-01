import {MarkGithubIcon, MoonIcon, SunIcon, SyncIcon} from '@primer/octicons-react'
import type {Theme} from '../hooks/useTheme'
import {formatKoreanDate} from '../lib/repositories'

interface HeaderProps {
  generatedAt: string
  repositoryCount: number
  theme: Theme
  onToggleTheme: () => void
}

export function Header({generatedAt, repositoryCount, theme, onToggleTheme}: HeaderProps) {
  const hasSynced = Date.parse(generatedAt) > 0

  return (
    <header className="site-header">
      <div className="site-header__inner page-shell">
        <a className="brand" href="/repolio/" aria-label="Repolio 홈">
          <span className="brand__mark"><MarkGithubIcon size={24} /></span>
          <span>
            <strong>Repolio</strong>
            <small>Rustapex repositories</small>
          </span>
        </a>

        <div className="header-actions">
          <span className="sync-status" title={hasSynced ? generatedAt : undefined}>
            <SyncIcon size={16} />
            {hasSynced ? `${formatKoreanDate(generatedAt)} 동기화` : '동기화 대기 중'}
          </span>
          <a className="icon-button" href="https://github.com/Rustapex" target="_blank" rel="noreferrer" aria-label="Rustapex GitHub 프로필 열기">
            <MarkGithubIcon size={20} />
          </a>
          <button className="icon-button" type="button" onClick={onToggleTheme} aria-label={`${theme === 'dark' ? '라이트' : '다크'} 테마로 전환`}>
            {theme === 'dark' ? <SunIcon size={20} /> : <MoonIcon size={20} />}
          </button>
        </div>
      </div>
      <div className="hero page-shell">
        <p className="eyebrow">PUBLIC REPOSITORY INDEX</p>
        <h1>만든 것들을<br /><span>한눈에 탐색하세요.</span></h1>
        <p className="hero__description">
          Rustapex의 공개 저장소 {repositoryCount}개를 언어와 그룹으로 분류하고,
          각 프로젝트의 README를 카드 안에서 바로 살펴볼 수 있습니다.
        </p>
      </div>
    </header>
  )
}
