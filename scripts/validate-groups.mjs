import {readFile} from 'node:fs/promises'

const groupsPath = new URL('../src/data/groups.json', import.meta.url)
const groups = JSON.parse(await readFile(groupsPath, 'utf8'))

if (!groups || Array.isArray(groups) || typeof groups !== 'object') {
  throw new Error('groups.json의 최상위 값은 저장소 이름을 키로 사용하는 객체여야 합니다.')
}

for (const [repository, labels] of Object.entries(groups)) {
  if (!repository.trim()) throw new Error('groups.json에 빈 저장소 이름이 있습니다.')
  if (!Array.isArray(labels) || labels.some(label => typeof label !== 'string' || !label.trim())) {
    throw new Error(`${repository}: 그룹은 빈 값이 없는 문자열 배열이어야 합니다.`)
  }
  if (new Set(labels).size !== labels.length) {
    throw new Error(`${repository}: 중복 그룹이 있습니다.`)
  }
}

console.log(`groups.json 검증 완료: ${Object.keys(groups).length}개 저장소 설정`)
