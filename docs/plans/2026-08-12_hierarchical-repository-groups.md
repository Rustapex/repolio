# 계층형 저장소 그룹 및 README 표시 개선 계획

## 목적

평면 그룹 라벨을 상위 그룹과 세부 그룹으로 재구성해 필터와 카드의 탐색성을 높이고, README 미리보기의 접기 스크롤 및 HTML 태그 노출 문제를 수정한다.

## 확정된 결정

- 카드 기본 표시는 클릭 가능한 상위 그룹 칩으로 한다.
- 카드에서 `세부 그룹 N개`를 펼치면 클릭 가능한 세부 그룹 칩을 표시한다.
- 그룹 필터의 기본 목록은 상위 그룹만 표시한다.
- 상위 그룹 선택은 그 상위 그룹에 속한 모든 세부 그룹을 포함해 필터링한다.
- 세부 그룹 선택은 정확히 일치하는 저장소만 필터링한다.
- 카드의 그룹 칩을 누르면 기존 검색, 언어, 유형, 정렬 조건을 초기화하고 선택한 그룹만 적용한다.
- 내부 그룹 ID는 영문 소문자 kebab-case, 화면 표시명은 공식 기술명 또는 명확한 한글 명사로 사용한다.
- `solo`, `team`, `acorn`, `studySource`, `portfolio`는 기술·도메인 그룹에서 제외한다.

## 데이터 구조

`src/data/groups.json`을 다음 세 영역으로 변경한다.

- `categories`: 상위 그룹 ID, 표시명, 포함하는 세부 그룹 ID
- `groups`: 세부 그룹 ID와 표시명
- `repositories`: 저장소 이름과 세부 그룹 ID 배열

상위 그룹은 저장소에 직접 저장하지 않고, 저장소의 세부 그룹과 `categories`의 관계로 계산한다.

## 상위 그룹

| ID | 표시명 |
| --- | --- |
| `frontend` | 프론트엔드 |
| `backend` | 백엔드 |
| `database` | 데이터베이스 |
| `cloud-devops` | 클라우드·DevOps |
| `api-integration` | API·연동 |
| `desktop` | 데스크톱 |
| `algorithm` | 알고리즘 |
| `service-domain` | 서비스 도메인 |

## 구현 범위

1. `groups.json`을 계층형 구조로 이전하고 기존 그룹명을 공통화한다.
2. 공용 타입, 그룹 변환 함수, 필터 함수를 새 구조에 맞게 변경한다.
3. 그룹 필터는 상위 그룹만 표시하도록 변경한다.
4. 카드에 상위 그룹 칩, 세부 그룹 펼치기, 그룹 클릭 필터 동작을 추가한다.
5. README가 접힐 때 내부 스크롤을 최상단으로 되돌리고, Markdown 렌더링에서 HTML 태그를 숨긴다.
6. 그룹 데이터 규칙 문서를 `docs/data/`에 추가하고 문서 색인과 기존 데이터 규칙을 갱신한다.
7. 그룹 구조와 상위·세부 그룹 필터 동작을 테스트하고, 전체 그룹 검증·타입 검사·빌드를 수행한다.

## 변경 대상

- `src/data/groups.json`
- `src/types/repository.ts`
- `src/lib/repositories.ts`
- `src/App.tsx`
- `src/components/RepositoryFilters.tsx`
- `src/components/RepositoryCard.tsx`
- `src/components/ReadmePreview.tsx`
- `src/styles/components.css`
- `scripts/validate-groups.mjs`
- `tests/repository-filters.test.ts`
- `docs/data/group-taxonomy.md` (신규)
- `docs/data/catalog-data-rules.md`
- `docs/README.md`

## 검증 기준

- `npm run validate:groups`가 계층형 데이터의 참조·중복·명명 규칙을 검증한다.
- 상위 그룹을 선택하면 연결된 모든 세부 그룹 저장소가 나온다.
- React 세부 그룹을 선택하면 `ebook-library-frontend`, `ebook-library-backend`, `repolio`만 나온다.
- 카드의 상위·세부 그룹 칩은 동일한 필터 상태 변경을 수행한다.
- README 접기 후 해당 README 본문은 최상단에서 표시된다.
- README의 `<br>` 같은 HTML 태그는 화면에 텍스트로 노출되지 않는다.
- `npm test`, `npm run typecheck`, `npm run build`가 통과한다.

## 범위 제외

- 협업 방식, 학습 출처, 포트폴리오 여부를 별도 필터로 추가하는 작업
- GitHub 동기화 데이터 스키마 변경
- README 원문 자체 수정
