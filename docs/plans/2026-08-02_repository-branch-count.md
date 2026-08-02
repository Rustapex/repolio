# 저장소 브랜치 수 표시 계획

## 배경

- GitHub 동기화 스크립트는 저장소별 branches API 응답을 `branches` 배열로 저장한다.
- 저장소 카드의 메타 정보에는 별 수, fork 수, 마지막 push 일자만 표시되어 브랜치 수가 화면에 보이지 않는다.
- fork 배지와 fork 수는 서로 다른 정보이며, 현재 표시는 유지해야 한다.

## 구현 범위

- `RepositoryCard` 메타 정보에 `GitBranchIcon`과 `브랜치 {repository.branches.length}`를 추가한다.
- 별 수는 GitHub `stargazers_count`, fork 수는 `forks_count` 표시를 그대로 유지한다.
- 기존 branches API 호출, 동기화 결과 형식, 정렬 및 필터 동작은 변경하지 않는다.

## 작업 순서

1. 최신 `origin/main`을 기준으로 `docs/repository-branch-count` worktree 브랜치를 만든다.
2. 저장소 카드의 메타 행에 브랜치 수를 추가한다.
3. 생성된 저장소 데이터에서 `repolio` 7개, `FrontProject` 6개, `web` 1개 브랜치가 유지되는지 확인한다.
4. 테스트, 타입 검사, production build와 로컬 화면을 확인한다.
5. 실제 diff를 기준으로 커밋 및 PR 메시지를 작성하고 push와 PR 생성을 진행한다.

## 검증 기준

- 브랜치 수는 저장소별 `branches.length`와 일치한다.
- 별 및 fork 표시는 기존 API 값과 동일하게 남는다.
- 브랜치 수가 1개인 저장소와 여러 개인 저장소 모두 메타 행에서 읽을 수 있다.
