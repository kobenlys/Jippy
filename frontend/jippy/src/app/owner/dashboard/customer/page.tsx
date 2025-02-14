"use client";

import React, { useState } from 'react';
import FeedbackList from '@/features/dashboard/customer/components/FeedbackList';
import MLAnalysis from '@/features/dashboard/customer/components/MLAnalysis';

const CustomerDashboardPage = () => {
  // 전체/카테고리별 필터 (null이면 전체)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const storeId = 1; // 예시: 매장 ID 1
  const buttonClass = (active: boolean) =>
    `px-4 py-2 rounded border transition-colors ${
      active
        ? 'bg-[#F27B39] text-white'
        : 'bg-white text-gray-700 hover:bg-gray-100'
    }`;

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* 왼쪽: 고객 피드백 목록 */}
      <div className="md:w-1/2 p-6 border-r overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">고객 피드백</h2>
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory(null)}
            className={buttonClass(selectedCategory === null)}
          >
            전체
          </button>
          <button
            onClick={() => setSelectedCategory('SERVICE')}
            className={buttonClass(selectedCategory === 'SERVICE')}
          >
            서비스
          </button>
          <button
            onClick={() => setSelectedCategory('LIVE')}
            className={buttonClass(selectedCategory === 'LIVE')}
          >
            실시간 서비스
          </button>
          <button
            onClick={() => setSelectedCategory('PRODUCT')}
            className={buttonClass(selectedCategory === 'PRODUCT')}
          >
            제품관련
          </button>
          <button
            onClick={() => setSelectedCategory('ETC')}
            className={buttonClass(selectedCategory === 'ETC')}
          >
            기타
          </button>
        </div>
        <FeedbackList storeId={storeId} selectedCategory={selectedCategory} />
      </div>

      {/* 오른쪽: 머신러닝 피드백 분석 */}
      <div className="md:w-1/2 p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">피드백 분석</h2>
        <MLAnalysis storeId={storeId} />
      </div>
    </div>
  );
};

export default CustomerDashboardPage;
