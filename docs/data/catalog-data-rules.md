# 카탈로그 데이터 규칙

## 데이터의 소유자

| 데이터 | 원본 | 변경 방법 |
| --- | --- | --- |
| `generated/repositories.json` | GitHub 동기화 결과 | `npm run sync` 실행 |
| `src/data/groups.json` | 사용자가 지정한 저장소 분류 | 직접 편집 후 `npm run validate:groups` 실행 |
| `src/types/repository.ts` | 애플리케이션 데이터 계약 | 생성 스크립트와 소비 코드를 함께 변경 |

## 생성 데이터 규칙

- `generated/repositories.json`은 직접 수정하지 않는다.
- 카탈로그는 생성 시점, 소유자, 소스 URL, 공개 저장소 목록, 경고 목록을 포함한다.
- 저장소 필드는 `Repository`, 언어 항목은 `LanguageUsage`, 화면 필터는 `RepositoryFilters` 타입을 기준으로 한다.
- 새 필드를 추가하거나 제거할 때는 동기화 스크립트, 타입, `src/lib/` 변환, 컴포넌트, 테스트를 함께 검토한다.
- 동기화에서 일부 보조 데이터 수집에 실패해도 전체 공개 저장소 목록을 버리지 않고 경고로 표시하는 현재 원칙을 유지한다.

## 그룹 데이터 규칙

- 그룹 키는 저장소 이름이고 값은 문자열 배열이다.
- 그룹 데이터는 개인이 관리하는 분류이므로 동기화 결과로 덮어쓰지 않는다.
- 형식 또는 값 규칙을 바꾸면 검증 스크립트와 관련 테스트를 함께 갱신한다.
[그룹 계층 규칙](group-taxonomy.md)
