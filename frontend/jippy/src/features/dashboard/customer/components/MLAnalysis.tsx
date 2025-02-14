import React from 'react';
import usePrediction from '@/features/dashboard/customer/hooks/usePrediction';
import styles from '@/features/dashboard/customer/styles/MLAnalysis.module.css';

interface MLAnalysisProps {
  storeId: number;
}

const MLAnalysis: React.FC<MLAnalysisProps> = ({ storeId }) => {
  const { data, loading, error } = usePrediction(storeId);

  if (loading) return <p>분석 데이터를 불러오는 중...</p>;
  if (error) return <p>오류: {error}</p>;
  if (!data) return null;

  return (
    <div className={styles.mlAnalysis}>
      <div className={styles.counts}>
        <p>긍정 피드백: {data.positive_count}</p>
        <p>부정 피드백: {data.negative_count}</p>
      </div>

      <div className={styles.samples}>
        <h3>긍정 샘플</h3>
        <ul>
          {data.positive_samples.map((sample, idx) => (
            <li key={idx}>
              <p>
                <strong>카테고리:</strong> {sample.category}
              </p>
              <p>{sample.content}</p>
              <p>{sample.created_at}</p>
            </li>
          ))}
        </ul>

        <h3>부정 샘플</h3>
        <ul>
          {data.negative_samples.map((sample, idx) => (
            <li key={idx}>
              <p>
                <strong>카테고리:</strong> {sample.category}
              </p>
              <p>{sample.content}</p>
              <p>{sample.created_at}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.keywords}>
        <h3>긍정 키워드</h3>
        <ul>
          {data.positive_keywords.map((kw, idx) => (
            <li key={idx}>{kw}</li>
          ))}
        </ul>
        <h3>부정 키워드</h3>
        <ul>
          {data.negative_keywords.map((kw, idx) => (
            <li key={idx}>{kw}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MLAnalysis;
