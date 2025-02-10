# 베이스 이미지로 Python 3.11 slim 사용
FROM python:3.11-slim

# 작업 디렉토리 설정
WORKDIR /app

# Python 패키지 설치를 위해 requirements.txt 복사
COPY requirements.txt .

# 시스템 업데이트 및 필요한 패키지 설치
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y --no-install-recommends openjdk-17-jdk-headless && \
    apt-get install -y git curl bash python3-dev wget build-essential automake autoconf libtool pkg-config && \
    rm -rf /var/lib/apt/lists/*

#########################
# 1. MeCab 설치
#########################
WORKDIR /www

# MeCab 설치 (mecab 0.996-ko-0.9.2)
RUN wget https://bitbucket.org/eunjeon/mecab-ko/downloads/mecab-0.996-ko-0.9.2.tar.gz && \
    tar -zxvf mecab-0.996-ko-0.9.2.tar.gz && \
    rm mecab-0.996-ko-0.9.2.tar.gz

WORKDIR /www/mecab-0.996-ko-0.9.2
RUN ./configure && \
    make && \
    make check && \
    make install && \
    ldconfig

#########################
# 2. mecab-ko-dic 설치
#########################
WORKDIR /www
RUN wget https://bitbucket.org/eunjeon/mecab-ko-dic/downloads/mecab-ko-dic-2.0.1-20150920.tar.gz && \
    tar -zxvf mecab-ko-dic-2.0.1-20150920.tar.gz && \
    rm mecab-ko-dic-2.0.1-20150920.tar.gz

WORKDIR /www/mecab-ko-dic-2.0.1-20150920
RUN ./autogen.sh && \
    ./configure && \
    make && \
    make install && \
    ldconfig

#########################
# 3. mecab-python 설치 (Python binding)
#########################
WORKDIR /www
RUN git clone https://bitbucket.org/eunjeon/mecab-python-0.996.git mecab-python-0.996
WORKDIR /www/mecab-python-0.996
RUN python setup.py build && \
    python setup.py install

#########################
# 4. Python 패키지 설치 (requirements.txt)
#########################
WORKDIR /app
COPY . .
RUN pip install --no-cache-dir --disable-pip-version-check -r requirements.txt

# 컨테이너 외부에 노출할 포트 설정 (FastAPI 기본 포트: 8000)
EXPOSE 8000

# 컨테이너 시작 시 실행할 명령어: uvicorn을 이용해 FastAPI 서버 실행
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
