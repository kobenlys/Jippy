"use client";

import React, { useState } from 'react';
import FeedbackList from '@/features/dashboard/customer/components/FeedbackList';
import MLAnalysis from '@/features/dashboard/customer/components/MLAnalysis';
import styles from '@/features/dashboard/customer/styles/Dashboard.module.css';

const CustomerDashboardPage = () => {
  // 전체/카테고리별 필터 (null이면 전체)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const storeId = 1; // 예시: 매장 ID 1

  return (
    <div className={styles.dashboardContainer}>
      {/* 왼쪽: 고객 피드백 목록 */}
      <div className={styles.leftPane}>
        <h2>고객 피드백</h2>
        <div className={styles.filterButtons}>
          <button onClick={() => setSelectedCategory(null)}>전체</button>
          <button onClick={() => setSelectedCategory('SERVICE')}>서비스</button>
          <button onClick={() => setSelectedCategory('LIVE')}>실시간 서비스</button>
          <button onClick={() => setSelectedCategory('PRODUCT')}>제품 관련</button>
          <button onClick={() => setSelectedCategory('ETC')}>기타</button>
        </div>
        <FeedbackList storeId={storeId} selectedCategory={selectedCategory} />
      </div>

      {/* 오른쪽: 머신러닝 피드백 분석 */}
      <div className={styles.rightPane}>
        <h2>피드백 분석</h2>
        <MLAnalysis storeId={storeId} />
      </div>
    </div>
  );
};

export default CustomerDashboardPage;
