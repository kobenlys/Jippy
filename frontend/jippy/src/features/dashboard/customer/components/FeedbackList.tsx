import React from 'react';
import useFeedbacks, { Feedback } from '@/features/dashboard/customer/hooks/useFeedbacks';
import styles from '@/features/dashboard/customer/styles/FeedbackList.module.css';

interface FeedbackListProps {
  storeId: number;
  selectedCategory: string | null;
}

const FeedbackList: React.FC<FeedbackListProps> = ({ storeId, selectedCategory }) => {
  const { feedbacks, loading, error, deleteFeedback } = useFeedbacks(storeId, selectedCategory);

  return (
    <div>
      {loading && <p>로딩중...</p>}
      {error && <p>오류: {error}</p>}
      {!loading && feedbacks.length === 0 && <p>피드백이 없습니다.</p>}
      <ul className={styles.feedbackList}>
        {feedbacks.map((fb: Feedback) => (
          <li key={fb.id} className={styles.feedbackItem}>
            <div>
              <strong>{fb.category}</strong> - {fb.content}
              <br />
              <small>{fb.createdAt}</small>
            </div>
            <button onClick={() => deleteFeedback(fb.id)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FeedbackList;
