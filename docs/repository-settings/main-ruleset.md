# main 브랜치 Ruleset 운영 기록

## 1. 문서 목적

`main` 브랜치에 적용한 `protect-main-via-pull-request` Ruleset의 실제 설정, 적용 이유, 일상 작업 흐름을 기록한다.

이 Ruleset은 개인 저장소에서도 실수로 `main`에 직접 push하거나 force push하는 일을 막고, 변경 이력을 Pull Request와 CI 결과로 남기기 위한 것이다.

## 2. 적용 범위와 현재 상태

| 항목 | 설정값 | 의미 |
|---|---|---|
| Ruleset 이름 | `protect-main-via-pull-request` | `main` 보호 목적을 나타내는 식별자 |
| Enforcement | Active | 저장 즉시 규칙을 실제로 적용한다 |
| 대상 | Default branch | 현재 기본 브랜치인 `main`에 적용한다 |
| Bypass actor | Repository admin | 저장소 관리자가 예외 권한을 보유한다 |
| Bypass mode | For pull requests only | 관리자는 직접 push하지 못하고, Pull Request 안에서만 필요 시 규칙 우회를 선택할 수 있다 |

저장소 관리자는 Ruleset 자체를 수정하거나 삭제할 수 있으므로, 이 설정은 권한을 영구적으로 회수하는 보안 장치가 아니라 일상 작업의 실수를 막는 운영 장치다.

## 3. 활성 규칙과 설정 이유

| 규칙 | 현재 설정 | 적용 이유와 실제 효과 |
|---|---|---|
| Restrict deletions | 켜기 | `main` 브랜치 삭제를 차단한다. 실수로 기본 브랜치를 제거하는 상황을 막는다. |
| Block force pushes | 켜기 | `git push --force`로 `main`의 공개 이력을 덮어쓰는 것을 차단한다. |
| Require linear history | 켜기 | `main`에 merge commit이 추가되는 것을 막아 이력을 한 줄로 유지한다. Squash 또는 Rebase merge를 사용한다. |
| Require a pull request before merging | 켜기 | `main`의 모든 변경은 별도 브랜치에서 만든 Pull Request를 통해서만 반영한다. |
| Required approvals | 0 | 혼자 사용하는 저장소이므로 다른 사람의 승인을 필수로 요구하지 않는다. |
| Dismiss stale approvals | 끄기 | 승인 자체를 요구하지 않으므로 현재는 효과가 없다. |
| Require review from specific teams | 끄기 | 팀 리뷰 체계가 없는 개인 저장소이므로 사용하지 않는다. |
| Require review from Code Owners | 끄기 | `CODEOWNERS` 기반의 별도 승인 절차를 사용하지 않는다. |
| Require approval of the most recent reviewable push | 끄기 | 마지막 push를 다른 사람이 승인해야 하는 규칙이다. 개인 저장소에서는 충족할 수 없다. |
| Require conversation resolution | 끄기 | 외부 리뷰나 Copilot 리뷰를 merge 조건으로 사용하지 않는다. |
| Allowed merge methods | Merge, Squash, Rebase | PR 화면에서 선택 가능한 방식이다. 다만 선형 이력 규칙 때문에 merge commit은 `main`에 반영될 수 없으며, 일상 작업에는 Squash merge를 권장한다. |
| Require status checks to pass | 켜기 | CI가 성공한 변경만 `main`에 반영한다. |
| Required check | `verify` from GitHub Actions | PR과 `main` push에서 실행되는 CI job 이름이다. 테스트와 build 검증이 성공해야 한다. |
| Require branches to be up to date | 끄기 | 혼자 사용하는 저장소에서 불필요한 재실행을 줄인다. 다른 변경이 `main`에 먼저 들어간 경우에는 PR을 수동으로 최신화한다. |
| Do not require status checks on creation | 끄기 | 이미 존재하는 `main`을 보호하므로, 검사 없는 브랜치 생성을 별도로 허용할 필요가 없다. |

## 4. 설정하지 않은 규칙

아래 항목은 현재 Ruleset에 포함하지 않았다. 기능을 활성화하기 전에 필요한 도구나 운영 방식이 있는 항목이기 때문이다.

| 규칙 | 현재 미설정 이유 |
|---|---|
| Restrict creations | 이미 존재하는 기본 브랜치의 재생성까지 별도로 제한할 필요가 없다. |
| Restrict updates | Pull Request 요구 규칙이 직접 push를 이미 차단하므로 중복 설정하지 않는다. |
| Require deployments to succeed | GitHub Pages 배포는 `main` 반영 뒤에 실행된다. 배포 성공을 merge 전 조건으로 만들려면 별도 preview 환경이 필요하다. |
| Require signed commits | SourceTree와 GitHub CLI의 GPG 또는 SSH commit signing을 모두 구성한 뒤에만 켠다. 지금 켜면 일반 커밋이 거절된다. |
| Require code scanning results | CodeQL default setup이 아직 구성되지 않았다. 먼저 CodeQL을 안정적으로 실행한 뒤 필수 조건으로 전환한다. |
| Require code quality results | GitHub Code Quality 분석을 현재 사용하지 않는다. |
| Restrict code coverage | 커버리지 업로드와 기준값이 아직 없다. |
| Automatically request Copilot code review | Copilot Free에서는 GitHub Pull Request 자동 코드 리뷰를 사용할 수 없다. |

## 5. 일상 작업 절차

1. SourceTree에서 `main`을 기준으로 `feat/...`, `fix/...`, `docs/...` 브랜치를 만든다.
2. 해당 브랜치에 commit하고 origin으로 push한다.
3. GitHub에서 대상 브랜치가 `main`인 Pull Request를 만든다.
4. `verify` CI가 성공한 것을 확인한다.
5. 기본적으로 Squash merge를 사용해 `main`에 반영한다.
6. merge 뒤에는 원격 작업 브랜치를 삭제한다.

SourceTree나 GitHub CLI에서 `main`으로 직접 push하면 Ruleset 위반으로 거절되는 것이 정상이다. 긴급한 예외가 필요한 경우에는 Pull Request 안에서만 관리자 bypass를 사용할 수 있다.

## 6. 관련 저장소 설정

Ruleset과 함께 다음 설정을 유지한다.

- GitHub Actions workflow 기본 권한은 read-only로 유지한다.
- Secret scanning과 push protection은 활성 상태를 유지한다.
- Dependabot security updates와 CodeQL default setup은 별도 설정 후 활성화를 검토한다.
- Pull Request 브랜치 자동 삭제와 Squash merge 전용 정책은 저장소 General 설정에서 별도로 적용한다.

## 7. 참고 문서

- [GitHub Ruleset 생성](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository)
- [Ruleset에서 사용할 수 있는 규칙](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets)
- [필수 status check 문제 해결](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/troubleshooting-required-status-checks)
- [GitHub Copilot 플랜 비교](https://docs.github.com/en/copilot/get-started/plans)
