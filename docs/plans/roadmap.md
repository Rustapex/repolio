# Repolio 구현 로드맵과 운영 계획

## 문서 목적

이 문서는 확정된 제품 범위를 실제 구현 단계와 운영 작업으로 나눠 추적한다. 상세 설계와 완료 기준은 [구현 계획](implementation-plan.md)을 기준으로 한다.

## 확정 범위

- `Rustapex` 계정의 공개 저장소만 표시한다.
- GitHub가 제공하는 이름, 설명, 공개 상태, fork·archived 상태, 언어, stars, 수정일, README를 자동 수집한다.
- 의미 기반 그룹은 사용자가 `src/data/groups.json`만 직접 수정한다.
- React, Vite, TypeScript로 정적 사이트를 만들고 GitHub Pages에 배포한다.
- 라이트/다크 전환, 반응형 화면, 한글 Pretendard Variable 글꼴을 제공한다.
- 6시간 주기 자동 동기화와 GitHub Actions 수동 동기화를 모두 제공한다.

## 단계별 계획과 현재 상태

### 1단계 — 저장소 기반 구성 (완료)

- React·Vite·TypeScript 실행 환경과 테스트 명령 구성
- GitHub Pages 하위 경로 `/repolio/` 빌드 설정
- 계획 문서를 `docs/plans/`로 분리
- IDE, 로컬 AI 도구, 빌드 산출물 제외 규칙 구성

### 2단계 — 데이터 동기화 (완료)

- GitHub REST API에서 공개 저장소 목록 수집
- 저장소별 언어 바이트 비율과 README Markdown 수집
- 비공개 저장소를 한 번 더 제외하는 방어 필터 적용
- 일부 README·언어 요청 실패가 전체 동기화를 중단하지 않도록 경고로 기록
- 브라우저에 토큰을 전달하지 않고 Actions에서만 `GITHUB_TOKEN` 사용

### 3단계 — 인덱스 화면 (완료)

- 저장소 카드와 README 축약 미리보기
- 이름·설명·토픽·그룹 통합 검색
- 원본·fork·archived, 언어, 그룹 필터
- 최근 수정·이름·stars 정렬
- 언어 비율 막대와 저장소 상태 배지
- 모바일 1열, 태블릿 2열, 데스크톱 3열 반응형 배치
- 시스템 테마 초기값과 사용자 선택 저장

### 4단계 — 자동화와 배포 (구성 완료, 원격 검증 필요)

- PR·`main` push에서 테스트와 production build 실행
- `main` push, 6시간 cron, 수동 실행에서 최신 데이터 수집
- GitHub Pages artifact 업로드와 배포
- 월간 npm·GitHub Actions Dependabot 확인

## 배포 후 즉시 확인할 작업

1. GitHub 저장소 Settings → Pages의 Source가 GitHub Actions인지 확인한다.
2. `CI`와 `Sync and Deploy` 최초 실행이 성공하는지 확인한다.
3. <https://rustapex.github.io/repolio/>에서 저장소 카드와 README가 표시되는지 확인한다.
4. Actions → Sync and Deploy → Run workflow로 수동 갱신을 한 번 검증한다.
5. 공개 전환 예정 저장소 하나를 대상으로 다음 6시간 동기화에서 자동 추가되는지 확인한다.

## 사용자가 수행하는 운영 작업

- 그룹 변경: `src/data/groups.json` 수정 후 push
- 즉시 데이터 갱신: `Sync and Deploy` 수동 실행
- 저장소 소개 수정: 각 원본 저장소의 GitHub Description 또는 README 수정
- 새 공개 저장소 추가: 별도 설정 없이 다음 동기화를 기다리거나 수동 실행

## 향후 개선 후보

- 저장소 수가 많아질 때 페이지네이션 또는 가상 스크롤 추가
- 그룹 JSON에 없는 저장소 이름을 Actions 주석으로 더 명확하게 표시
- README가 매우 긴 저장소의 미리보기 수집 정책 조정
- 접근성 자동 검사와 실제 브라우저 시각 회귀 테스트 추가
- CDN 장애에 대비한 Pretendard WOFF2 자체 호스팅 검토

위 항목은 현재 공개 저장소 인덱스의 필수 기능이 아니므로 운영 중 필요가 확인될 때 별도 branch와 Pull Request로 진행한다.
