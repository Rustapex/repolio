# Repolio

Rustapex 계정의 공개 GitHub 저장소를 검색하고 분류해 한눈에 살펴보는 저장소 인덱스입니다.

배포 주소: <https://rustapex.github.io/repolio/>

## 주요 기능

- 공개 저장소의 이름, 설명, 상태, 언어 비율, stars, 수정일을 GitHub에서 자동 수집합니다.
- README를 카드 안에서 GitHub Flavored Markdown으로 미리 보여줍니다.
- 이름·설명 검색과 유형·언어·사용자 지정 그룹 필터, 최근 수정·이름·stars 정렬을 제공합니다.
- 라이트/다크 테마를 전환하고 선택을 브라우저에 저장합니다.
- GitHub Actions가 6시간마다 데이터를 갱신하고 Pages를 재배포합니다.
- Actions의 `Sync and Deploy` 워크플로를 필요할 때 수동으로 실행할 수 있습니다.

## 그룹 관리

그룹만 [`src/data/groups.json`](src/data/groups.json)에서 직접 관리합니다. 키는 저장소 이름이고 값은 그룹 문자열 배열입니다.

```json
{
  "example-repository": ["study", "frontend"]
}
```

저장소의 공개 전환이나 새 공개 저장소 추가는 다음 동기화부터 자동 반영됩니다. 저장소 이름·언어·README 같은 GitHub 메타데이터를 별도로 입력할 필요가 없습니다.

## 로컬 실행

```bash
npm install
npm run sync
npm run dev
```

GitHub API의 비인증 요청 제한을 피하려면 선택적으로 `GITHUB_TOKEN` 환경 변수를 사용할 수 있습니다. 토큰은 생성 파일이나 브라우저 번들에 포함되지 않습니다.

## 문서

- [구현 계획](docs/plans/implementation-plan.md)
- [구현 로드맵과 운영 계획](docs/plans/roadmap.md)
