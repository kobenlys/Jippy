# 기본 이미지 설정
FROM node:22.13.1-alpine

# timezone 설정
ENV TZ Asia/Seoul

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 파일 복사
COPY package.json package-lock.json ./

# 의존성 설치
RUN npm i

# 소스 코드 복사
COPY . .

# 빌드
RUN npm run build
