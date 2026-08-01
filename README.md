# Repolio

Rustapex 계정의 공개 GitHub 저장소를 한눈에 탐색하기 위한 저장소 인덱스이자 포트폴리오 사이트입니다.

완성된 사이트는 GitHub Pages의 `https://rustapex.github.io/repolio/`에서 제공할 예정입니다.

## 확정된 방향

- 공개 저장소만 GitHub API로 자동 수집합니다.
- 저장소 이름, 설명, 언어, 상태, 수정일과 README 미리보기는 자동으로 갱신합니다.
- 사용자가 직접 정하는 그룹만 `groups.json`에서 관리합니다.
- 라이트·다크 테마와 반응형 화면을 제공합니다.
- GitHub Actions가 6시간마다 동기화하며 필요할 때 수동으로도 실행할 수 있습니다.
- React, Vite, TypeScript와 GitHub Pages를 사용합니다.

## 문서

- [구현 계획](docs/implementation-plan.md)

현재 저장소에는 구현 전 합의한 계획과 로컬 작업 제외 규칙만 포함되어 있습니다. 애플리케이션 구현은 후속 브랜치와 Pull Request로 진행합니다.
