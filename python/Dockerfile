# 기존 konlpy 이미지 사용 (필요한 경우 태그를 확인)
FROM rurouni24/konlpy:python3.7

WORKDIR /app

# .env 및 애플리케이션 코드 복사
COPY . .

# 필요한 Python 패키지 설치 (이미 konlpy, Mecab 등이 포함되어 있으므로 requirements.txt에서 이들을 제거하거나, 그대로 두어도 괜찮음)
RUN pip install --no-cache-dir --disable-pip-version-check -r requirements.txt

EXPOSE 8000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
