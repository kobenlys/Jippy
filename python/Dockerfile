# 베이스 이미지로 Python 3.9 slim 사용
FROM python:3.9-slim

# 작업 디렉토리 설정
WORKDIR /app

# 시스템 패키지 업데이트 및 설치
# - openjdk-11-jdk: Konlpy 사용을 위한 JDK 설치
# - mecab, libmecab-dev: Mecab 및 개발 파일 설치
# - mecab-ko-dic: 한국어 사전 (패키지명은 시스템에 따라 다를 수 있음)
# - gcc, make 등: mecab-ko-dic 빌드에 필요한 경우 설치 (필요시 추가)
RUN apt-get update && apt-get install -y \
    openjdk-11-jdk \
    mecab \
    libmecab-dev \
    mecab-ko-dic \
    gcc \
    make \
    && rm -rf /var/lib/apt/lists/*

# 필요 시, 만약 apt-get에서 mecab-ko-dic이 원하는 버전이 없거나 제대로 동작하지 않으면,
# 아래와 같이 GitHub에서 mecab-ko-dic 소스를 클론하여 빌드하는 방법도 고려할 수 있습니다.
# RUN apt-get update && apt-get install -y git curl xz-utils file
# RUN git clone --depth 1 https://bitbucket.org/eunjeon/mecab-ko-dic.git
# RUN cd mecab-ko-dic && ./autogen.sh && ./configure && make && make install && ldconfig

# Python 패키지 설치를 위해 requirements.txt 복사
COPY requirements.txt .

# pip 업데이트 후, requirements.txt에 명시된 Python 패키지 설치
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

# 애플리케이션 소스 코드 복사
COPY . .

# 컨테이너 외부에 노출할 포트 설정 (FastAPI 기본 포트: 8000)
EXPOSE 8000

# 컨테이너 시작 시 실행할 명령어: uvicorn을 이용해 FastAPI 서버 실행
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
