# 베이스 이미지로 Python 3.9 slim 사용
FROM python:3.9-slim

# 작업 디렉토리 설정
WORKDIR /app

# Python 패키지 설치를 위해 requirements.txt 복사
COPY requirements.txt .

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y --no-install-recommends openjdk-17-jdk-headless && \
    apt-get install -y git && \
    apt-get install -y curl && \
    apt-get install -y bash && \
    apt-get install -y python3-dev

RUN git clone https://bitbucket.org/eunjeon/mecab-python-0.996.git
WORKDIR /www/mecab-python-0.996
RUN python setup.py build
RUN python setup.py install
WORKDIR /www

RUN wget https://bitbucket.org/eunjeon/mecab-ko/downloads/mecab-0.996-ko-0.9.2.tar.gz
RUN tar -zxvf mecab-0.996-ko-0.9.2.tar.gz
WORKDIR /www/mecab-0.996-ko-0.9.2
RUN ./configure
RUN make
RUN make check
RUN make install
WORKDIR /www

RUN wget https://bitbucket.org/eunjeon/mecab-ko-dic/downloads/mecab-ko-dic-2.0.1-20150920.tar.gz
RUN tar -zxvf mecab-ko-dic-2.0.1-20150920.tar.gz
WORKDIR /www/mecab-ko-dic-2.0.1-20150920/
RUN ./autogen.sh
RUN ./configure
RUN make
RUN make install
WORKDIR /www

RUN pip install --no-cache-dir --disable-pip-version-check -r requirements.txt


# 애플리케이션 소스 코드 복사
COPY . .

# 컨테이너 외부에 노출할 포트 설정 (FastAPI 기본 포트: 8000)
EXPOSE 8000

# 컨테이너 시작 시 실행할 명령어: uvicorn을 이용해 FastAPI 서버 실행
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
