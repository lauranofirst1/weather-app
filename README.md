# Weather App

## STUDY
아래의 노션 링크에 접속하면 스터디 내용을 볼 수 있다.
```text
https://www.notion.so/STUDY-FE-01-36225f5b74aa809abc97d5fbce2ee0c1?source=copy_link
```

## 배포 주소

Vercel에 배포한 주소는 아래와 같다.

```text
https://weather-app-delta-seven-82.vercel.app
```

## 실행 방법

의존성을 설치하고 환경 변수 파일을 생성한다.

```bash
npm install
cp .env.example .env.local
```

`.env.local`에 OpenWeather API 키를 입력한다.
```bash
OPENWEATHER_API_KEY=발급받은_API_KEY
```

개발 서버를 실행한다.
```bash
npm run dev
```

브라우저에서 아래 주소로 접속한다.

```text
http://localhost:3000
```
