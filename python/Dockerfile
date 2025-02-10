# 베이스 이미지로 Python 3.9 slim 사용
FROM python:3.9-slim

# 작업 디렉토리 설정
WORKDIR /app

# Mecab version
ENV MECAB_VERSION mecab-0.996-ko-0.9.2
ENV MECAB_DICT_VERSION mecab-ko-dic-2.1.1-20180720
ENV MECAB_PYTHON_VERSION mecab-python-1.0.10

# Python 패키지 설치를 위해 requirements.txt 복사
COPY requirements.txt .

RUN apt-get update && \
    apt-get install -y --no-install-recommends openjdk-11-jdk-headless python3-dev && \
    rm -rf /var/lib/apt/lists/* \
    && pip install --no-cache-dir --disable-pip-version-check -r requirements.txt

# Install Mecab
RUN set -ex \
    && curl -LO https://bitbucket.org/eunjeon/mecab-ko/downloads/${MECAB_VERSION}.tar.gz \
    && tar zxvf ${MECAB_VERSION}.tar.gz \
    && cd ${MECAB_VERSION} \
    && ./configure \
    && make \
    && make check \
    && make install \
    && ldconfig

# Install Mecab Dictionay
RUN set -ex \
    && curl -LO https://bitbucket.org/eunjeon/mecab-ko-dic/downloads/${MECAB_DICT_VERSION}.tar.gz \
    && tar zxvf ${MECAB_DICT_VERSION}.tar.gz \
    && cd ${MECAB_DICT_VERSION} \
    && ./autogen.sh \
    && ./configure \
    && make \
    && make install \
    && ldconfig

# Install mecab-python
RUN set -ex \
    && git clone https://bitbucket.org/eunjeon/${MECAB_PYTHON_VERSION}.git \
    && cd ${MECAB_PYTHON_VERSION} \
    && python setup.py build \
    && python setup.py install


# 애플리케이션 소스 코드 복사
COPY . .

# 컨테이너 외부에 노출할 포트 설정 (FastAPI 기본 포트: 8000)
EXPOSE 8000

# 컨테이너 시작 시 실행할 명령어: uvicorn을 이용해 FastAPI 서버 실행
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
