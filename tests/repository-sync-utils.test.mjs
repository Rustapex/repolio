import {Buffer} from 'node:buffer'
import {describe, expect, it} from 'vitest'
import {decodeReadme, normalizeBranchNames} from '../scripts/repository-sync-utils.mjs'

describe('decodeReadme', () => {
  it('UTF-8 README를 그대로 디코딩한다', () => {
    const bytes = new TextEncoder().encode('# README\n\n한글')

    expect(decodeReadme(bytes)).toBe('# README\n\n한글')
  })

  it('UTF-16LE BOM README를 올바르게 디코딩한다', () => {
    const bytes = new Uint8Array([0xff, 0xfe, ...Buffer.from('# README\n\n한글', 'utf16le')])

    expect(decodeReadme(bytes)).toBe('# README\n\n한글')
  })
})

describe('normalizeBranchNames', () => {
  it('기본 브랜치를 보장하고 중복을 제거한다', () => {
    const branches = normalizeBranchNames([{name: 'feature'}, {name: 'main'}, {name: 'feature'}], 'main')

    expect(branches).toEqual(['feature', 'main'])
  })

  it('브랜치 조회에 실패해도 기본 브랜치를 남긴다', () => {
    expect(normalizeBranchNames([], 'main')).toEqual(['main'])
  })
})
