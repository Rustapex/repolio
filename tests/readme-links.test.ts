import {describe, expect, it} from 'vitest'
import {resolveReadmeUrl} from '../src/lib/readme'
import type {Repository} from '../src/types/repository'

const repository = {
  fullName: 'Rustapex/example',
  htmlUrl: 'https://github.com/Rustapex/example',
  defaultBranch: 'main',
} as Repository

describe('resolveReadmeUrl', () => {
  it('상대 이미지 경로를 raw GitHub 주소로 변환한다', () => {
    expect(resolveReadmeUrl('./docs/image.png', repository, 'image')).toBe('https://raw.githubusercontent.com/Rustapex/example/main/docs/image.png')
  })

  it('상대 링크를 저장소 blob 주소로 변환한다', () => {
    expect(resolveReadmeUrl('docs/guide.md', repository, 'link')).toBe('https://github.com/Rustapex/example/blob/main/docs/guide.md')
  })

  it('절대 URL과 문서 내부 앵커는 변경하지 않는다', () => {
    expect(resolveReadmeUrl('https://example.com', repository, 'link')).toBe('https://example.com')
    expect(resolveReadmeUrl('#usage', repository, 'link')).toBe('#usage')
  })
})
