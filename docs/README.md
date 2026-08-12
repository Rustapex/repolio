# Repolio 유지보수 문서

이 폴더는 장기적으로 유지해야 하는 프로젝트 규칙과 운영 기준을 보관한다. 구현 순서와 범위는 `docs/plans/`, 실제 작업 기록은 `docs/maintenance/`에 남긴다.

## 변경 전 참고 문서

| 변경 영역 | 먼저 읽을 문서 | 함께 갱신해야 하는 경우 |
| --- | --- | --- |
| UI, 테마, 반응형, 접근성 | `design/design-rules.md`, `design/color-and-layout-system.md` | 토큰, 색상 역할, 공통 패턴, 반응형 기준이 변경될 때 |
| 파일 위치, 모듈 경계, 의존 방향 | `architecture/project-structure.md` | 디렉터리 책임 또는 의존 규칙이 변경될 때 |
| React 컴포넌트, 상태, 훅, 테스트 | `development/react-rules.md` | 구현 패턴 또는 상태 관리 기준이 변경될 때 |
| 저장소 모델, 그룹, 생성 데이터 | `data/catalog-data-rules.md` | 데이터 계약, 생성·수동 관리 경계가 변경될 때 |
| GitHub API와 동기화 스크립트 | `integrations/github-sync.md` | API 수집 범위, 인증, 오류 처리 기준이 변경될 때 |
| GitHub Actions, 검증, Pages 배포 | `operations/ci-cd-rules.md` | 트리거, 권한, 검증·배포 절차가 변경될 때 |

## 문서 작성 원칙

- 규칙 문서에는 현재 지켜야 할 기준과 변경 조건만 기록한다.
- 기능 일정, 후보 기능, 완료 내역은 규칙 문서에 넣지 않는다.
- 코드와 문서가 다르면 동작하는 코드를 우선 확인하고, 의도된 정책을 문서와 코드에서 같은 변경으로 맞춘다.
- 새 규칙은 기존 문서와 중복하지 말고, 가장 가까운 책임 문서에 추가한다.
[저장소 그룹 분류 규칙](data/group-taxonomy.md)
