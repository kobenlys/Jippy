# app.py
import os
from fastapi import FastAPI
from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from konlpy.tag import Mecab
from collections import Counter
import uvicorn
from dotenv import load_dotenv

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load environment variables from .env file
load_dotenv()

# 데이터베이스 연결 정보
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_NAME = os.getenv("DB_NAME")

# SQLAlchemy 연결 문자열
connection_string = f"mysql+mysqlconnector://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"
engine: Engine = create_engine(connection_string, pool_recycle=3600)

# --- 2. 모델 및 토크나이저 로드 ---
model_name = "Beomi/KcELECTRA-base"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name, num_labels=2)
model.to(device)
model.eval()

def predict_sentiment(text: str, max_len: int = 128) -> str:
    """
    입력 텍스트에 대해 KcELECTRA 모델로 긍정/부정을 예측하는 함수.
    """
    encoding = tokenizer(
        text,
        add_special_tokens=True,
        max_length=max_len,
        truncation=True,
        padding="max_length",
        return_tensors="pt"
    )
    # GPU 사용 시 encoding 값들을 device로 이동
    encoding = {key: val.to(device) for key, val in encoding.items()}
    with torch.no_grad():
        outputs = model(**encoding)
        logits = outputs.logits
        prediction = torch.argmax(logits, dim=1).item()
    return "positive" if prediction == 1 else "negative"

mecab = Mecab(dicpath='/usr/local/lib/mecab/dic/mecab-ko-dic')

def extract_keywords(texts, top_n=5):
    """
    여러 텍스트 리스트에서 명사를 추출한 후, 빈도수가 높은 단어 상위 top_n개를 키워드로 반환합니다.
    """
    all_nouns = []
    for text in texts:
        nouns = mecab.nouns(text)
        all_nouns.extend(nouns)
    counter = Counter(all_nouns)
    keywords = [word for word, count in counter.most_common(top_n)]
    return keywords

# -----------------------------------------------------------------------------
# 3. 카테고리 매핑 (DB의 category 값 해석)
# -----------------------------------------------------------------------------
CATEGORY_MAPPING = {
    1: "서비스 관련",
    2: "실시간 서비스 관련",
    3: "제품 관련",
    4: "기타 서비스 관련"
}

# --- 4. FastAPI 애플리케이션 생성 ---
app = FastAPI(title="Customer Feedback Sentiment API")

# -----------------------------------------------------------------------------
# 5. API 엔드포인트 구현
# -----------------------------------------------------------------------------
@app.get("/predictions/{store_id}")
def get_predictions(store_id: int):
    """
    지정된 store_id의 고객 피드백 데이터를 MySQL에서 가져와,  
    각 피드백에 대해 긍정/부정 예측을 수행하고,  
    긍정, 부정 리뷰의 개수, 상위 5개 샘플, 그리고 키워드를 추출하여 반환합니다.
    """
    # 매장별 피드백 데이터 조회 (파라미터 바인딩)
    query = text("SELECT category, content, created_at FROM customer_feedback WHERE store_id = :store_id")
    
    positive_reviews = []
    negative_reviews = []
    with engine.connect() as connection:
        results = connection.execute(query, {"store_id": store_id})
        for row in results:
            category, content, created_at = row
            sentiment = predict_sentiment(content)
            review_data = {
                "category": CATEGORY_MAPPING.get(category, str(category)),
                "content": content,
                "created_at": str(created_at),
                "sentiment": sentiment
            }
            if sentiment == "positive":
                positive_reviews.append(review_data)
            else:
                negative_reviews.append(review_data)
    
    # 리뷰 개수
    positive_count = len(positive_reviews)
    negative_count = len(negative_reviews)
    
    # 상위 5개 샘플 (리뷰가 없으면 빈 리스트)
    positive_samples = positive_reviews[:5] if positive_reviews else []
    negative_samples = negative_reviews[:5] if negative_reviews else []
    
    # 각 그룹의 전체 리뷰 텍스트에서 키워드 추출 (최상위 5개)
    positive_texts = [review["content"] for review in positive_reviews]
    negative_texts = [review["content"] for review in negative_reviews]
    positive_keywords = extract_keywords(positive_texts) if positive_texts else []
    negative_keywords = extract_keywords(negative_texts) if negative_texts else []
    
    return {
        "store_id": store_id,
        "positive_count": positive_count,
        "negative_count": negative_count,
        "positive_samples": positive_samples,
        "negative_samples": negative_samples,
        "positive_keywords": positive_keywords,
        "negative_keywords": negative_keywords
    }

# --- 4. 서버 실행 ---
if __name__ == "__main__":
    # 디버그 모드에서 실행 (개발 시)
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
