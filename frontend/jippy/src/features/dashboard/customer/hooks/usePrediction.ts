import { useState, useEffect } from 'react';
import { PredictionData } from '@/features/dashboard/customer/types/customer';


const usePrediction = (storeId: number) => {
  const [data, setData] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrediction = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:8000/predictions/${storeId}`);
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

    fetchPrediction();
  }, [storeId]);

  return { data, loading, error, refetch: () => {} };
};

export default usePrediction;
