# 1단계: 빌드 단계
FROM python:3.11-slim as builder

WORKDIR /build

# 시스템 업데이트 및 빌드에 필요한 패키지 설치
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        git curl bash python3-dev wget build-essential automake autoconf libtool pkg-config && \
    rm -rf /var/lib/apt/lists/*

#########################
# MeCab 설치
#########################
RUN wget https://bitbucket.org/eunjeon/mecab-ko/downloads/mecab-0.996-ko-0.9.2.tar.gz && \
    tar -zxvf mecab-0.996-ko-0.9.2.tar.gz && \
    rm mecab-0.996-ko-0.9.2.tar.gz

WORKDIR /build/mecab-0.996-ko-0.9.2
RUN ./configure && make && make install && ldconfig

#########################
# mecab-ko-dic 설치
#########################
WORKDIR /build
RUN wget https://bitbucket.org/eunjeon/mecab-ko-dic/downloads/mecab-ko-dic-2.0.1-20150920.tar.gz && \
    tar -zxvf mecab-ko-dic-2.0.1-20150920.tar.gz && \
    rm mecab-ko-dic-2.0.1-20150920.tar.gz

WORKDIR /build/mecab-ko-dic-2.0.1-20150920
RUN ./autogen.sh && ./configure && make && make install && ldconfig

#########################
# mecab-python 설치
#########################
WORKDIR /build
RUN git clone https://bitbucket.org/eunjeon/mecab-python-0.996.git mecab-python-0.996
WORKDIR /build/mecab-python-0.996
RUN python setup.py build && python setup.py install

# 2단계: 런타임 이미지
FROM python:3.11-slim

WORKDIR /app

# 필요한 런타임 패키지 설치 (예: OpenJDK는 실제 애플리케이션에서 사용하는 경우만)
RUN apt-get update && \
    apt-get install -y --no-install-recommends openjdk-17-jdk-headless && \
    rm -rf /var/lib/apt/lists/*

# 빌드 단계에서 설치한 MeCab 관련 바이너리, 라이브러리 등을 런타임 이미지로 복사
# 보통 /usr/local에 설치되었으므로, 필요한 경우 이 부분은 생략해도 됩니다.
# 예: COPY --from=builder /usr/local/bin/mecab* /usr/local/bin/
#     COPY --from=builder /usr/local/lib/libmecab* /usr/local/lib/

#########################
# PATH 업데이트
#########################
# MeCab가 /usr/local/bin에 설치되어 있으므로 해당 경로를 PATH에 추가
ENV PATH="/usr/local/bin:${PATH}"

# 애플리케이션 코드 및 requirements.txt 복사
COPY requirements.txt .
COPY . .

RUN pip install --no-cache-dir --disable-pip-version-check -r requirements.txt

EXPOSE 8000
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
