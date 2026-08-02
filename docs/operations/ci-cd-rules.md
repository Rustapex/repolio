# CI/CD 규칙

## CI 검증

- `.github/workflows/ci.yml`은 pull request와 `main` 푸시에서 실행한다.
- CI는 `npm ci`, `npm test`, `npm run build` 순서로 검증한다.
- CI 권한은 `contents: read`로 제한한다. 검증에 쓰기 권한이나 배포 권한을 추가하지 않는다.

## 동기화와 배포

- `.github/workflows/sync-and-deploy.yml`은 `main` 푸시, 6시간 주기 실행, 수동 실행에서만 시작한다.
- build job은 `npm ci`, `npm run sync`, `npm test`, `npm run build`를 완료한 뒤 `dist`만 Pages artifact로 올린다.
- 배포 job은 build job 성공 후에만 GitHub Pages 환경으로 배포한다.
- 동기화 과정의 `GITHUB_TOKEN`과 `GITHUB_OWNER`는 해당 워크플로 환경에만 제공한다.
- Pages 배포 권한은 `pages: write`, `id-token: write`로 한정하고, 그 외 권한은 추가하지 않는다.
- Pages 배포는 `pages` concurrency 그룹을 사용하며 진행 중 배포를 취소하지 않는다.

## 변경 규칙

- 워크플로 트리거, Node 버전, Actions 버전, 권한, 동기화 환경 변수, artifact 경로, 배포 환경을 바꾸면 이 문서와 관련 워크플로를 같은 변경에서 갱신한다.
- 검증 단계를 건너뛰거나 build 이전에 배포하지 않는다.
- 배포 워크플로는 생성 데이터를 원격 저장소에 다시 커밋하지 않는다.
- CI/CD 변경 전후에는 가능한 범위에서 `npm test`와 `npm run build`를 실행하고, PR에서는 `verify` 상태 검사를 확인한다.
