# 저장소 가이드라인

## 프로젝트 구조와 모듈 구성

이 저장소는 공개 GitHub 저장소를 색인하는 Vite, React, TypeScript 사이트다. 애플리케이션 코드는 `src/`에 두며, 재사용 UI는 `src/components/`, 데이터 변환 도구는 `src/lib/`, 공용 타입은 `src/types/`, 스타일은 `src/styles/`에 둔다. 사람이 관리하는 저장소 분류는 `src/data/groups.json`에 작성한다. `scripts/`는 GitHub 메타데이터 동기화와 그룹 검증을 담당하며, `generated/repositories.json`은 생성 파일이므로 직접 수정하지 않는다. 테스트는 `tests/`, GitHub Actions는 `.github/workflows/`에 있다.

## 개발, 빌드, 검증 명령

- `npm run dev`: Vite 개발 서버를 실행한다.
- `npm test`: Vitest 테스트를 한 번 실행한다. PowerShell에서 `npm.ps1` 실행이 차단되면 `npm.cmd test`를 사용한다.
- `npm run typecheck`: 파일을 생성하지 않고 TypeScript 타입을 검사한다.
- `npm run validate:groups`: `src/data/groups.json`을 검증한다.
- `npm run build`: 그룹 검증, 타입 검사, 프로덕션 빌드를 순서대로 실행한다.
- `npm run sync`: GitHub 저장소 메타데이터를 수집한다. 인증된 GitHub 접근이 필요하다.

## 코드 스타일과 이름 규칙

기존 TypeScript 스타일을 따른다. 들여쓰기는 공백 두 칸, 문자열은 작은따옴표, 세미콜론은 생략하고 여러 줄 호출에는 trailing comma를 사용한다. React 컴포넌트 파일은 PascalCase(`RepositoryCard.tsx`), 훅은 `useX` 형식, 유틸리티 모듈은 소문자 파일명을 사용한다. 동작 변경이 없는 스타일 수정도 기존 `src/styles/` 분리를 유지한다.

## 디자인 규칙

UI를 추가하거나 변경할 때는 반드시 `docs/design/design-rules.md`를 최종 기준으로 따른다. 장기적인 디자인 원칙, 공통 패턴, 토큰 또는 반응형 기준을 바꾸면 해당 문서도 같은 변경에서 갱신하고 이유를 기록한다.

- 색상, 간격, 모서리, 그림자, 전환 효과는 `src/styles/tokens.css`의 토큰을 우선 사용한다. 데이터 시각화처럼 의미가 있는 예외 외에는 임의의 HEX·픽셀 값을 추가하지 않는다.
- `.page-shell`과 기존 Header, RepositoryFilters, RepositoryCard, ReadmePreview 패턴을 재사용한다. 카드 중첩, 과도한 그림자, 장식성 그라데이션, 독자적인 버튼 스타일을 추가하지 않는다.
- 한글 본문에는 `word-break: keep-all`을 유지하고, 저장소명·URL·코드처럼 긴 값에는 줄바꿈 처리를 적용한다. 색상만으로 상태를 전달하지 않는다.
- 아이콘 단독 버튼에는 `aria-label`을 제공하고, 키보드 `:focus-visible`과 `prefers-reduced-motion` 대응을 유지한다. 의미 있는 이미지는 대체 텍스트를 제공한다.
- 라이트·다크 테마 모두에서 표면, 텍스트, 테두리, 포커스, 강조색의 대비를 확인한다.
- 기존 1120px·767px 전환 기준을 우선 사용한다. 목록은 1121px 이상 3열, 768-1120px 2열, 767px 이하 1열 흐름을 유지하며 최소 320px 화면을 지원한다.
- UI 변경 전에는 긴 저장소명·URL·한글 설명, README 없음, 빈 데이터 상태에서 레이아웃이 유지되는지 확인한다.

## 유지보수 규칙 문서

장기 유지보수 규칙의 색인은 `docs/README.md`에 있다. 변경 전에 작업 영역과 맞는 문서를 읽고, 그 문서가 정의한 계약을 바꾸면 코드와 같은 변경에서 문서도 갱신한다.

- 프로젝트 구조, 파일 위치, 모듈 의존: `docs/architecture/project-structure.md`
- React 컴포넌트, 상태, 훅, 테스트: `docs/development/react-rules.md`
- 디자인, 테마, 반응형, 접근성: `docs/design/design-rules.md`
- 카탈로그, 그룹, 생성 데이터: `docs/data/catalog-data-rules.md`
- GitHub API와 동기화: `docs/integrations/github-sync.md`
- GitHub Actions, 검증, Pages 배포: `docs/operations/ci-cd-rules.md`

규칙 문서는 구현 일정이나 작업 이력을 기록하는 곳이 아니다. 일정과 기능 범위는 `docs/plans/`, 실제 작업 결과는 `docs/maintenance/`에 기록한다.

## 파일 읽기와 작업 흐름

Markdown, 코드, 설정 등 저장소 파일을 읽거나 수정하기 전에는 반드시 `targeted-file-reading` skill을 사용한다. 먼저 `rg`로 파일·헤딩·식별자를 찾고, 필요한 최소 행 범위만 읽는다. 대형 파일 전체 읽기는 해당 범위만으로 판단할 수 없을 때만 확대한다. 수정 전에는 확인한 파일과 근거를 요약하고, 수정 후에는 diff와 적절한 검증을 확인한다.

Git에 기록된 소스 파일의 내용을 확인할 때는 GitHub 연결을 우선 사용한다. 아직 커밋·푸시되지 않은 변경이 필요하거나 GitHub 연결에서 확인할 수 없는 경우에만 현재 프로젝트 파일을 보완 확인한다.

## 테스트 지침

동작 변경에는 Vitest 테스트를 추가하거나 갱신한다. 테스트 파일은 `tests/`에 `*.test.ts` 또는 `*.test.mjs` 형식으로 두고 외부에서 관찰 가능한 동작을 설명한다. 필터, 그룹, README 처리, 메타데이터 동기화 변경 시에는 관련 테스트를 우선 보강한다. 현재 커버리지 임계값은 없지만 `npm test`, `npm run typecheck`, `npm run build`가 기본 검증이다.

## 커밋과 Pull Request

커밋 메시지와 PR 제목·본문은 반드시 `git-message-standardizer` skill로 작성한다. 타입은 영어로 유지하고 설명은 한국어로 쓴다. 예: `feat: 공개 저장소 필터 추가`, `docs(repository-settings): Ruleset 운영 기록 추가`. 실제 커밋, 푸시, PR 생성은 별도 사용자 지시가 있을 때만 수행한다.

`main`에 직접 푸시하지 않는다. `feat/`, `fix/`, `docs/`, `chore/` 브랜치에서 PR을 만들고 `verify` 상태 검사를 통과한 뒤 병합한다. 선형 히스토리를 위해 Squash merge를 우선 사용한다. PR에는 변경 내용·이유·영향 파일·검증 결과를 적고, UI 변경에는 스크린샷을 첨부한다.

## 보안과 설정

`.env`, 토큰, 로컬 도구 설정을 커밋하지 않는다. GitHub Actions 권한은 최소로 유지하고, 의존성 또는 워크플로 변경은 병합 전에 검증한다.
