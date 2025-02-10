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

import pandas as pd

df = pd.read_excel('한국어_단발성_대화_데이터셋.xlsx')
print(df.head())

print(df['Emotion'].value_counts())

# 7개 감정을 긍정/부정 두 클래스로 매핑하는 함수 정의
def map_emotion_to_sentiment(emotion):
    if emotion in ['행복', '놀람', '중립']:
        return 1  # positive
    else:
        return 0  # negative

# 새 레이블 컬럼 추가
df['label'] = df['Emotion'].apply(map_emotion_to_sentiment)


from sklearn.model_selection import train_test_split

# 학습/검증 데이터 분할 (레이블 분포 유지)
train_df, val_df = train_test_split(df, test_size=0.2, stratify=df['label'], random_state=42)

# KcELECTRA 토크나이저 로드 (모델 이름은 Beomi/KcELECTRA-base로 설정)
tokenizer = AutoTokenizer.from_pretrained("Beomi/KcELECTRA-base")

# 최대 토큰 길이 설정
MAX_LEN = 128

class EmotionDataset(torch.utils.data.Dataset):
    def __init__(self, dataframe, tokenizer, max_length):
        self.data = dataframe.reset_index(drop=True)
        self.tokenizer = tokenizer
        self.max_length = max_length

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        text = str(self.data.loc[idx, "Sentence"])
        label = int(self.data.loc[idx, "label"])
        encoding = self.tokenizer(
            text,
            add_special_tokens=True,
            max_length=self.max_length,
            truncation=True,
            padding='max_length',
            return_tensors="pt"
        )
        # encoding은 배치 차원이 있으므로 squeeze하여 차원 축소
        item = {key: encoding[key].squeeze() for key in encoding}
        item["labels"] = torch.tensor(label, dtype=torch.long)
        return item

# 데이터셋 객체 생성
train_dataset = EmotionDataset(train_df, tokenizer, MAX_LEN)
val_dataset = EmotionDataset(val_df, tokenizer, MAX_LEN)


from transformers import TrainingArguments, Trainer
import accelerate

training_args = TrainingArguments(
    output_dir="./kcelectra_sentiment",
    num_train_epochs=3,
    per_device_train_batch_size=16,
    per_device_eval_batch_size=16,
    evaluation_strategy="epoch",  # 평가 주기를 epoch 단위로 설정
    save_strategy="epoch",         # 저장 주기를 epoch 단위로 설정
    logging_dir="./logs",
    logging_steps=10,
    load_best_model_at_end=True,
    metric_for_best_model="accuracy"
)


# 평가 지표 함수 정의 (accuracy)
import numpy as np
import evaluate  # huggingface evaluate 라이브러리

accuracy_metric = evaluate.load("accuracy")

def compute_metrics(eval_pred):
    logits, labels = eval_pred
    predictions = np.argmax(logits, axis=-1)
    return accuracy_metric.compute(predictions=predictions, references=labels)

# Trainer 객체 생성
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=val_dataset,
    compute_metrics=compute_metrics
)

# 모델 학습
trainer.train()

# 평가
eval_result = trainer.evaluate()
print("\nEvaluation results:")
print(eval_result)


tokenizer = AutoTokenizer.from_pretrained("Beomi/KcELECTRA-base")

def predict_sentiment(model, tokenizer, sentence, max_len=128):
    model.eval()
    encoding = tokenizer(
        sentence,
        add_special_tokens=True,
        max_length=max_len,
        truncation=True,
        padding='max_length',
        return_tensors="pt"
    )
    # GPU 사용 시 디바이스로 이동 (예: device가 "cuda"라면)
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
    query = text("SELECT category, content, created_at FROM store_feedback WHERE store_id = :store_id")
    
    positive_reviews = []
    negative_reviews = []
    with engine.connect() as connection:
        results = connection.execute(query, {"store_id": store_id})
        for row in results:
            category, content, created_at = row
            sentiment = predict_sentiment(model, tokenizer, content)
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
