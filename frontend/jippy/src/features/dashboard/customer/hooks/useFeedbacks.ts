import { useState, useEffect } from 'react';

export interface Feedback {
  id: number;
  storeId: number;
  category: string;
  content: string;
  createdAt: string;
}

const useFeedbacks = (storeId: number, category: string | null) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedbacks = async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = category
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/feedback/${storeId}/select/${category}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/feedback/${storeId}/select`;
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error('피드백 조회에 실패했습니다.');
      const json = await res.json();
      // 백엔드 ApiResponse 형식: { data: Feedback[] }
      setFeedbacks(json.data);
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
    fetchFeedbacks();
  }, [storeId, category]);

  const deleteFeedback = async (feedbackId: number) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feedback/${storeId}/delete/${feedbackId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('삭제에 실패했습니다.');
      // 삭제 후 새로 조회
      fetchFeedbacks();
    } catch (err) {
      console.error(err);
    }
  };

  return { feedbacks, loading, error, deleteFeedback, refetch: fetchFeedbacks };
};

export default useFeedbacks;
