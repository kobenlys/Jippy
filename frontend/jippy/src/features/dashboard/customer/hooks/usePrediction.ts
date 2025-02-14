import { useState, useEffect } from 'react';

export interface PredictionSample {
  category: string;
  content: string;
  created_at: string;
  sentiment: string;
}

export interface PredictionData {
  store_id: number;
  positive_count: number;
  negative_count: number;
  positive_samples: PredictionSample[];
  negative_samples: PredictionSample[];
  positive_keywords: string[];
  negative_keywords: string[];
}

const usePrediction = (storeId: number) => {
  const [data, setData] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrediction = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://52.79.170.206:8000/predictions/${storeId}`);
      if (!res.ok) throw new Error('분석 데이터 조회에 실패했습니다.');
      const json = await res.json();
      setData(json);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message || '알 수 없는 에러');
      } else {
        setError('알 수 없는 에러');
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPrediction();
  }, [storeId]);

  return { data, loading, error, refetch: fetchPrediction };
};

export default usePrediction;
