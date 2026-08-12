import {readFile} from 'node:fs/promises'

const groupsPath = new URL('../src/data/groups.json', import.meta.url)
const groups = JSON.parse(await readFile(groupsPath, 'utf8'))
const idPattern = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/

if (!groups || Array.isArray(groups) || typeof groups !== 'object' || !groups.categories || !groups.groups || !groups.repositories) {
  throw new Error('groups.json의 최상위 값은 저장소 이름을 키로 사용하는 객체여야 합니다.')
}

const categoryGroupIds = new Set()

for (const [categoryId, category] of Object.entries(groups.categories)) {
  if (!idPattern.test(categoryId) || !category || typeof category.label !== 'string' || !Array.isArray(category.groups)) {
    throw new Error(`Invalid category: ${categoryId}`)
  }
  if (new Set(category.groups).size !== category.groups.length) {
    throw new Error(`Duplicate group in category: ${categoryId}`)
  }
  for (const groupId of category.groups) {
    if (!groups.groups[groupId]) throw new Error(`Unknown group in category ${categoryId}: ${groupId}`)
    if (categoryGroupIds.has(groupId)) throw new Error(`Group belongs to multiple categories: ${groupId}`)
    categoryGroupIds.add(groupId)
  }
}

for (const [groupId, group] of Object.entries(groups.groups)) {
  if (!idPattern.test(groupId) || !group || typeof group.label !== 'string' || !group.label.trim()) {
    throw new Error(`Invalid group: ${groupId}`)
  }
  if (!categoryGroupIds.has(groupId)) throw new Error(`Group has no category: ${groupId}`)
}

for (const [repository, labels] of Object.entries(groups.repositories)) {
  if (!repository.trim()) throw new Error('groups.json에 빈 저장소 이름이 있습니다.')
  if (!Array.isArray(labels) || labels.some(label => typeof label !== 'string' || !label.trim())) {
    throw new Error(`${repository}: 그룹은 빈 값이 없는 문자열 배열이어야 합니다.`)
  }
  if (new Set(labels).size !== labels.length) {
    throw new Error(`${repository}: 중복 그룹이 있습니다.`)
  }
  if (labels.some(label => !groups.groups[label])) {
    throw new Error(`${repository}: 정의되지 않은 세부 그룹이 있습니다.`)
  }
}

console.log(`groups.json validation complete: ${Object.keys(groups.repositories).length} repositories`)
