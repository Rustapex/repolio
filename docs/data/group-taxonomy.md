# 저장소 그룹 분류 규칙

## 목적

저장소의 기술과 도메인을 상위 그룹과 세부 그룹으로 일관되게 분류한다. 필터와 카드의 기본 표시는 상위 그룹을 사용하고, 세부 그룹은 카드에서 사용자가 펼쳐 확인하거나 직접 선택할 때 사용한다.

## JSON 구조

`src/data/groups.json`은 다음 세 영역을 가진다.

- `categories`: 상위 그룹 ID, 표시명, 포함하는 세부 그룹 ID
- `groups`: 세부 그룹 ID와 표시명
- `repositories`: 저장소 이름과 세부 그룹 ID 배열

상위 그룹은 저장소에 직접 배정하지 않는다. 저장소의 상위 그룹은 세부 그룹이 속한 `categories` 관계로 계산한다.

## 명명 규칙

- 내부 ID는 영문 소문자 kebab-case를 사용한다. 예: `spring-boot`, `aws-ec2`, `react-router`
- 표시명은 제품·기술의 공식 표기를 우선하고, 일반 개념은 명확한 한글 명사를 사용한다.
- 화면의 `#`은 표시 요소가 붙이며 데이터에는 저장하지 않는다.
- 하나의 세부 그룹은 하나의 의미만 나타낸다. 포괄적인 상위 개념은 세부 그룹으로 만들지 않는다.

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

## 병합과 제외

- `spring`과 `legacy`는 `spring-framework`로, `oracle`과 `oracle19c`는 `oracle-database`로 병합한다.
- `javaBasics`는 `java`로, `containerization`은 `docker`로 병합한다.
- `cloud`, `frontend`, `database`, `desktopApp`은 상위 그룹으로 흡수한다.
- `webApp`, `webProject`, `github`는 탐색 기준이 불명확하므로 제거한다.
- `solo`, `team`, `acorn`, `studySource`, `portfolio`는 기술·도메인 분류가 아니므로 그룹 데이터에서 제외한다. 필요하면 별도 메타데이터 기능으로 다룬다.

## UI와 필터 동작

- 그룹 필터는 상위 그룹만 표시한다.
- 카드에는 상위 그룹 칩을 기본 표시하고, `세부 그룹 N개`를 펼치면 세부 그룹 칩을 표시한다.
- 상위 그룹 칩은 그 상위 그룹에 속한 모든 저장소를, 세부 그룹 칩은 해당 세부 그룹이 배정된 저장소만 필터링한다.
- 카드의 그룹 칩을 누르면 기존 검색, 언어, 유형, 정렬 조건을 초기화하고 해당 그룹만 적용한다.

## 검증 규칙

- 모든 ID는 kebab-case여야 한다.
- 상위 그룹이 참조하는 세부 그룹과 저장소가 참조하는 세부 그룹은 모두 `groups`에 존재해야 한다.
- 상위 그룹과 저장소의 세부 그룹 ID는 중복될 수 없다.
- 모든 세부 그룹은 정확히 하나의 상위 그룹에 속해야 한다.
