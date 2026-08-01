import {useState} from 'react'
import {ChevronDownIcon, ChevronUpIcon} from '@primer/octicons-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {resolveReadmeUrl} from '../lib/readme'
import type {Repository} from '../types/repository'

export function ReadmePreview({repository}: {repository: Repository}) {
  const [expanded, setExpanded] = useState(false)

  if (!repository.readme) {
    return <div className="readme-empty">README가 없는 저장소입니다.</div>
  }

  return (
    <div className={`readme-preview${expanded ? ' readme-preview--expanded' : ''}`}>
      <div className="readme-preview__label">README</div>
      <div className="markdown-body">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            a: ({href, ...props}) => <a {...props} href={resolveReadmeUrl(href, repository, 'link')} target="_blank" rel="noreferrer" />,
            img: ({src, alt, ...props}) => <img {...props} src={resolveReadmeUrl(src, repository, 'image')} alt={alt ?? ''} loading="lazy" />,
          }}
        >
          {repository.readme}
        </ReactMarkdown>
      </div>
      <button className="readme-toggle" type="button" onClick={() => setExpanded(value => !value)} aria-expanded={expanded}>
        {expanded ? <><ChevronUpIcon size={16} /> 접기</> : <><ChevronDownIcon size={16} /> 더 보기</>}
      </button>
    </div>
  )
}
