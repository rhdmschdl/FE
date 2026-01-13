## 🍀 Develop Convention

### 📌 Commit 메시지 컨벤션

| 커밋 태그  | 설명                                         |
| ---------- | -------------------------------------------- |
| `feat`     | ✨ 새로운 기능 추가 또는 기존 기능 수정      |
| `fix`      | 🐛 버그 수정                                 |
| `style`    | 🎨 UI 스타일 변경 (CSS 등)                   |
| `chore`    | 🔧 기타 설정 변경 (ex. 패키지, gitignore 등) |
| `refactor` | ♻️ 리팩토링 (기능 변화 없음)                 |
| `test`     | ✅ 테스트 코드 추가/보완                     |
| `docs`     | 📝 문서 수정 (ex. README 등)                 |
| `comment`  | ✏️ 필요한 주석 추가                          |
| `remove`   | 🗑️ 파일 삭제                                 |
| `rename`   | 🔄 파일 경로 변경 혹은 파일 이름 변경        |

### 📌 Branch 컨벤션
- feature/issue-이슈번호
  - feat -> feature로 작성
  - 나머지는 커밋 컨벤션 적용  
    ex) style/issue-01
- develop 브랜치에서 브랜치를 따서 작업 후 충분히 테스트 한 뒤 main브랜치로 병합하여 출시

### 📌 폴더구조

```text
├─ src/                  - 애플리케이션 소스 코드
│  ├─ assets/            - 이미지/아이콘 등 정적 리소스
│  ├─ components/        - 재사용 가능한 UI 컴포넌트
│  ├─ data/              - 더미/정적 데이터
│  ├─ enums/             - 열거형 타입 정의
│  ├─ hooks/             - 커스텀 훅
│  ├─ libs/              - 외부 라이브러리 래퍼/헬퍼
│  ├─ pages/             - 라우팅 페이지 컴포넌트
│  ├─ router/            - 라우터 설정
│  ├─ store/             - 전역 상태 관리
│  ├─ styles/            - 전역/공통 스타일
│  ├─ types/             - 전역 타입 정의
│  └─ utils/             - 유틸리티 함수

- 빈 폴더에 파일 추가시 `.gitkeep` 파일 제거
- 폴더에 새로운 파일을 만들 때 `.gitkeep` 파일을 삭제하는 방식으로 운영합니다.
```

## 🧑‍🤝‍🧑 Members

| [<img src="https://avatars.githubusercontent.com/u/81173010?s=400&v=4" width="100px">](https://github.com/choikyungsoo) | [<img src="https://avatars.githubusercontent.com/u/163626142?v=4" width="100px">](https://github.com/rhdmschdl) |
| :---------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------: |
|                                                         김정민                                                          |                                                     최고은                                                      |

```

```
