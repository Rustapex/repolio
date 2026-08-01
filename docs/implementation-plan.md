# Repolio 구현 계획

## 1. 문서 목적

이 문서는 Repolio의 구현 범위, 데이터 흐름, 화면 구조, 디자인 기준, 자동화와 검증 기준을 기록하는 기준 문서다. 최초 저장소 구성 이후의 기능 개발은 이 문서를 기준으로 브랜치를 만들고 Pull Request로 반영한다.

## 2. 확정 사항

| 항목 | 결정 |
|---|---|
| GitHub 저장소 | `Rustapex/repolio` |
| 로컬 경로 | `C:\Github\Repolio` |
| 배포 주소 | `https://rustapex.github.io/repolio/` |
| 공개 범위 | 공개 저장소만 표시 |
| 그룹 관리 | `groups.json`을 사용자가 직접 수정 |
| 프런트엔드 | React + Vite + TypeScript |
| 디자인 기반 | GitHub Primer React + Primer Primitives |
| 한글 글꼴 | Pretendard Variable |
| 테마 | 라이트·다크 전환, 시스템 설정 초기값 지원 |
| 자동 동기화 | 6시간마다 GitHub Actions 실행 |
| 수동 동기화 | Actions의 `workflow_dispatch` 지원 |
| 배포 방식 | GitHub Actions에서 빌드 후 GitHub Pages 배포 |
| 초기 게시 이후 Git 전략 | 기능 브랜치 + Pull Request |

## 3. 목표와 비목표

### 목표

- Rustapex 계정의 공개 저장소를 검색하고 분류할 수 있는 인덱스를 제공한다.
- GitHub가 제공하는 메타데이터를 자동 수집해 언어와 상태를 수작업으로 중복 관리하지 않는다.
- README를 GitHub Flavored Markdown 형태의 제한된 미리보기로 보여준다.
- 그룹만 사람이 관리하고 나머지 정보는 6시간마다 최신화한다.
- 모바일, 태블릿, 데스크톱에서 동일한 기능을 사용할 수 있게 한다.

### 비목표

- 비공개 저장소의 이름이나 내용을 공개 페이지에 노출하지 않는다.
- 저장소 생성, 삭제, 수정 기능을 사이트에서 제공하지 않는다.
- 별도 서버나 자체 도메인을 운영하지 않는다.
- 그룹 편집을 위한 관리자 화면을 만들지 않는다.
- GitHub 저장소 설명이나 언어를 별도 파일에 하드코딩하지 않는다.

## 4. 전체 구조

```text
GitHub REST API
  └─ Rustapex 공개 저장소 조회
       ├─ 기본 메타데이터
       ├─ 언어별 사용량
       └─ README.md
            ↓
scripts/sync-repositories.mjs
  ├─ 공개 저장소만 허용
  ├─ 응답 정규화
  ├─ README UTF-8 처리
  └─ groups.json 병합
            ↓
generated/repositories.json
            ↓
React 애플리케이션
  ├─ 검색·필터·정렬
  ├─ 저장소 카드
  ├─ README 미리보기
  └─ 라이트·다크 테마
            ↓
GitHub Pages
```

## 5. 예정 파일 구조

```text
Repolio/
├─ .github/
│  └─ workflows/
│     ├─ ci.yml
│     └─ sync-and-deploy.yml
├─ docs/
│  └─ implementation-plan.md
├─ generated/
│  └─ repositories.json
├─ scripts/
│  └─ sync-repositories.mjs
├─ src/
│  ├─ components/
│  │  ├─ Header/
│  │  ├─ RepositoryCard/
│  │  ├─ RepositoryFilters/
│  │  ├─ ReadmePreview/
│  │  ├─ SyncStatus/
│  │  └─ EmptyState/
│  ├─ data/
│  │  └─ groups.json
│  ├─ hooks/
│  │  ├─ useRepositoryFilters.ts
│  │  └─ useTheme.ts
│  ├─ styles/
│  │  ├─ tokens.css
│  │  ├─ theme.css
│  │  ├─ layout.css
│  │  └─ components.css
│  ├─ types/
│  │  └─ repository.ts
│  ├─ App.tsx
│  └─ main.tsx
├─ tests/
│  ├─ repository-sync.test.ts
│  └─ repository-filters.test.ts
├─ .gitignore
├─ index.html
├─ package.json
├─ tsconfig.json
└─ vite.config.ts
```

실제 구현 과정에서 파일이 불필요하게 세분화되면 합칠 수 있지만, 데이터 수집·화면·스타일·타입의 책임 분리는 유지한다.

## 6. GitHub 데이터 수집

### 자동 수집 항목

- 저장소 이름과 전체 이름
- GitHub URL
- 한 줄 설명
- 공개 여부
- 원본 저장소 또는 fork 여부
- archived 여부
- 기본 브랜치
- 생성일과 마지막 수정일
- stars와 forks 수
- 대표 언어와 언어별 바이트 비중
- README 원문

### 수집 원칙

- `/users/Rustapex/repos`의 공개 결과만 사용한다.
- 각 저장소 응답의 `private` 값이 `false`인지 다시 검증한다.
- README나 언어 데이터가 없는 저장소도 카드에서 오류 없이 표시한다.
- API 오류가 일부 저장소에만 발생하면 전체 배포를 중단할지, 해당 저장소만 기본 정보로 표시할지 테스트 결과를 바탕으로 결정한다.
- 브라우저에 GitHub 토큰을 포함하지 않는다.

### 그룹 데이터

그룹은 사람이 관리하는 유일한 저장소별 메타데이터다.

```json
{
  "acorncampus_ATM": ["team-project", "backend"],
  "example-repository": ["study"]
}
```

빌드 전에 다음을 검증한다.

- JSON 문법이 올바른지
- 값이 문자열 배열인지
- 동일 그룹이 중복되지 않는지
- 공개 저장소 목록에 없는 이름이 있는지

존재하지 않는 저장소 이름은 자동 삭제하지 않고 검증 메시지로 알려 사용자가 오타인지, 아직 생성되지 않은 저장소인지 판단할 수 있게 한다.

## 7. 화면 구조

### 헤더

- Repolio 제목과 간단한 소개
- Rustapex GitHub 프로필 링크
- 마지막 동기화 시각
- 라이트·다크 테마 전환 버튼

### 검색과 필터

- 저장소 이름과 설명 통합 검색
- 유형: 전체, 원본, fork, archived
- 언어 필터
- 직접 지정 그룹 필터
- 정렬: 최근 수정, 이름, stars
- 전체 조건 초기화

### 저장소 카드

- 저장소 이름과 GitHub 링크
- public, fork, archived 상태 배지
- 대표 언어와 언어 비율
- 저장소 설명
- README Markdown 미리보기
- 마지막 수정일과 stars
- GitHub에서 열기 버튼

README는 이미지 캡처가 아니라 Markdown을 렌더링한다. 카드에서는 최대 높이와 페이드 처리를 적용하고, 코드 블록은 가로 스크롤을 허용한다. 전체 내용은 원본 저장소에서 확인하게 한다.

## 8. 반응형 기준

| 화면 폭 | 배치 |
|---|---|
| 1280px 이상 | 최대 폭 컨테이너, 카드 3열 |
| 768px 이상 1279px 이하 | 카드 2열, 필터 여러 줄 |
| 767px 이하 | 카드 1열, 검색 우선 배치 |
| 매우 좁은 화면 | 보조 필터를 접기 메뉴 또는 가로 스크롤로 제공 |

카드의 전체 높이를 강제로 같게 만들지 않고 README 미리보기 영역만 제한한다. 키보드 탐색, 포커스 표시, 색상 대비와 버튼 접근성 이름을 확인한다.

## 9. 디자인과 스타일

### 디자인 시스템

- `@primer/react`: GitHub의 React UI 컴포넌트
- `@primer/primitives`: 색상, 간격, 타이포그래피, 브레이크포인트와 테마 토큰
- Primer Design 문서: 컴포넌트 용도, 구조, 크기와 배치 기준 참고

Primer 저장소를 복사해 수정하지 않고 공개 npm 패키지로 사용한다. 프로젝트 고유 스타일은 `src/styles`에 최소한으로 둔다.

### 테마

- 첫 방문은 `prefers-color-scheme`을 따른다.
- 사용자가 전환하면 선택 값을 브라우저 저장소에 보관한다.
- 라이트와 다크 모두 Primer 토큰을 사용한다.
- 테마 변경 버튼은 현재 상태와 변경 결과를 보조 기술에 알린다.

### 한글과 깨짐 방지

- HTML과 소스, JSON을 UTF-8로 통일한다.
- `meta charset="UTF-8"`을 선언한다.
- README API 응답을 UTF-8로 디코딩한다.
- 기본 글꼴은 `Pretendard Variable`로 하고 시스템 한글 글꼴과 `sans-serif`를 폴백으로 둔다.
- 한국어 본문에는 `word-break: keep-all`을 적용한다.
- 긴 URL과 저장소 이름에는 `overflow-wrap: anywhere`를 적용한다.
- 코드 블록에는 강제 줄바꿈 대신 가로 스크롤을 적용한다.
- 날짜는 `ko-KR` 형식으로 표시한다.

Pretendard는 우선 동적 서브셋 CDN을 사용한다. 자체 호스팅이 필요해지면 WOFF2 파일을 `public/fonts`에 두며, 전역 도구 폴더에는 저장하지 않는다.

## 10. GitHub Actions와 Pages

### `ci.yml`

- Pull Request와 `main` push에서 실행한다.
- TypeScript 타입 검사
- lint
- 단위 테스트
- 그룹 JSON 검증
- 공개 저장소 필터 검증
- Vite production build

### `sync-and-deploy.yml`

실행 조건:

- `schedule`: 6시간마다
- `workflow_dispatch`: 사용자가 원할 때 수동 실행
- `push`: `main`의 사이트 코드나 그룹 설정 변경

실행 단계:

1. 저장소 checkout
2. Node 설치와 npm 캐시 복원
3. 의존성 설치
4. 공개 저장소 데이터 수집
5. 데이터와 그룹 설정 검증
6. 테스트와 빌드
7. Pages artifact 업로드
8. GitHub Pages 배포

기본 cron은 `0 */6 * * *`를 사용한다. UTC 기준 실행 시 한국 시간으로 대략 03시, 09시, 15시, 21시에 실행된다. GitHub Actions 부하에 따라 실제 시작 시각은 조금 지연될 수 있다.

수동 실행은 GitHub 저장소의 Actions 탭에서 `Sync and Deploy`를 선택하고 `Run workflow`를 누르는 방식으로 제공한다.

## 11. 보안과 개인정보

- 공개 저장소만 배포 데이터에 포함한다.
- 토큰이나 인증 정보를 React 번들, JSON, 로그에 출력하지 않는다.
- Markdown의 임의 HTML은 허용하지 않거나 안전한 허용 목록으로 정제한다.
- 외부 링크에는 필요한 `rel` 속성을 적용한다.
- Dependabot 또는 정기적인 의존성 점검을 후속 단계에서 구성한다.

## 12. 검증 계획

### 데이터

- README가 없는 저장소
- 언어 데이터가 없는 저장소
- fork 및 archived 저장소
- 한글 저장소 설명과 한글 README
- 긴 저장소 이름과 URL
- 비공개 저장소가 결과에 포함되지 않는지

### 화면

- 검색·필터·정렬 조합
- 그룹이 없는 저장소
- 1열·2열·3열 반응형 전환
- 라이트·다크 테마 유지
- 키보드만으로 필터와 링크 사용
- Markdown 코드, 표, 목록, 인용문 표시

### 배포

- `npm run build`
- Actions 정기 실행
- Actions 수동 실행
- GitHub Pages 새 배포 확인
- `https://rustapex.github.io/repolio/` 접근 확인

## 13. 구현 순서

1. React, Vite, TypeScript 프로젝트와 기본 테스트 환경 구성
2. Primer와 Pretendard 기반 토큰·테마 구성
3. GitHub 공개 저장소 동기화 스크립트 구현
4. 타입과 `groups.json` 검증 구현
5. 저장소 카드와 README 미리보기 구현
6. 검색·필터·정렬 구현
7. 반응형 및 접근성 보완
8. CI와 6시간 동기화·수동 배포 워크플로 구현
9. GitHub Pages 설정과 실제 배포 검증

## 14. 완료 기준

- 공개 저장소만 사이트에 표시된다.
- 언어, 설명, 상태와 README가 자동으로 갱신된다.
- 그룹은 `groups.json` 수정만으로 반영된다.
- 라이트·다크 전환이 동작하고 선택 상태가 유지된다.
- 모바일부터 데스크톱까지 필터와 카드가 정상 동작한다.
- 6시간 정기 실행과 수동 실행이 모두 Pages를 최신화한다.
- 테스트와 production build가 통과한다.
- GitHub Pages URL에서 실제 사이트를 사용할 수 있다.
