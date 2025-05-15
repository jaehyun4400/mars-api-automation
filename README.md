
## MARS API 자동 분석 자동화 도구

이 프로젝트는 다양한 종류의 파일(zip, 문서, 실행 파일 등)을 자동으로 분석 서버에 업로드하고, 그 악성 여부 탐지 결과를 Excel 파일로 저장한 뒤 Microsoft Teams에 AdaptiveCard 형식으로 자동 전송하는 Node.js 기반의 자동화 스크립트입니다.

> 반복적인 수작업을 줄이고, 분석 결과를 구성원과 빠르게 공유하기 위해 설계되었습니다.

---

## 🛠 사용 기술 스택

- **Node.js**
- **Axios**: REST API 통신
- **dotenv**: 환경변수 관리
- **XLSX**: Excel 파일 생성
- **FormData**: 파일 업로드 구성
- **Microsoft Teams Webhook**: AdaptiveCard 전송

---

## 📂 폴더 구조

```
mars-api-automation/
├── index.js                  # 메인 실행 스크립트
├── modules/                  # 기능별 분리된 모듈
│   ├── uploadFile.js
│   ├── pollReport.js
│   ├── saveToExcel.js
│   └── sendTeamsCard.js
├── upload/                   # 분석 대상 파일을 넣는 폴더
├── Analyses_Result/          # 결과 Excel이 저장되는 폴더
├── .env.example              # 환경 변수 예시 파일
├── .gitignore                # GitHub 업로드 제외 목록
└── README.md                 # 이 설명 문서
```

---

## 사전 준비

1. Node.js 설치  
   👉 [https://nodejs.org](https://nodejs.org)

2. 프로젝트 클론 및 초기 설정

```bash
git clone https://github.com/yourname/mars-api-automation.git
cd mars-api-automation
npm install
```

3. `.env` 파일 생성 (`.env.example` 참고)

```env
API_BASE_URL=https://your-api.com/api/upload
BEARER_TOKEN=your_token_here
TEAMS_WEBHOOK_URL=https://outlook.office.com/webhook/...
```

4. `./upload/` 폴더에 분석할 zip, exe, 문서 등의 파일 추가

---

## ▶ 실행 방법

```bash
node index.js
```

- 각 파일이 API 서버에 자동 업로드됨
- 분석이 완료되면 결과 요약이 Teams에 전송됨
- 결과는 `.xlsx`로 `Analyses_Result/` 폴더에 저장됨

---

## 기능 요약

| 기능 | 설명 |
|------|------|
|  파일 업로드    | zip, exe 등 다양한 파일 자동 업로드 |
|  리포트 polling | API 서버에서 txId 기반 결과 확인 |
|  Excel 저장      | 분석 결과를 `.xlsx`로 저장 |
|  Teams 공유     | AdaptiveCard 형식으로 결과 전송 |

---

## 제작 배경 및 성과

- 수작업 반복 업무 자동화  
- 오류 및 누락 방지  
- 구성원 간 빠른 공유 → 협업 효율성 향상  
- 실무 현장에서 바로 적용 가능한 자동화 툴

---

## 작성자

**박재현(@jaeko__)**  
📧 [blueskyhot_5@naver.com]  
🌐 GitHub: [https://github.com/jaehyun4400/]

---

## 참고

- `.env` 파일은 **절대 GitHub에 업로드하지 마세요**
- `adaptive_payload.json`은 디버깅용 JSON이며 자동 생성됩니다
