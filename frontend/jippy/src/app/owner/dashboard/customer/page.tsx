"use client";

import React, { useState, useEffect } from 'react';
import FeedbackList from '@/features/dashboard/customer/components/FeedbackList';
import MLAnalysis from '@/features/dashboard/customer/components/MLAnalysis';
import useUserInfo from "@/utils/useUserInfo";


const CustomerDashboardPage = () => {
  
  const userInfo = useUserInfo();
  const storeIdList = userInfo.storeIdList;
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);
  // 전체/카테고리별 필터 (null이면 전체)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
   // 매장 목록이 존재하면 기본값으로 첫 번째 매장을 선택합니다.
   useEffect(() => {
    if (storeIdList.length > 0 && selectedStoreId === null) {
      setSelectedStoreId(storeIdList[0]);
    }
  }, [storeIdList, selectedStoreId]);

  // 매장 목록이 없을 경우 메시지 표시
  if (storeIdList.length === 0) {
    return (
      <div className="p-6">
        <p className="text-red-500">등록된 매장이 없습니다.</p>
      </div>
    );
  }

  const buttonClass = (active: boolean) =>
    `px-4 py-2 rounded border transition-colors ${
      active
        ? 'bg-[#F27B39] text-white'
        : 'bg-white text-gray-700 hover:bg-gray-100'
    }`;

    return (
      <div className="flex flex-col md:flex-row h-screen">
        {/* 왼쪽: 매장 선택, 필터 버튼, 고객 피드백 리스트 */}
        <div className="md:w-1/2 p-6 border-r overflow-y-auto">
          {/* 매장 선택 드롭다운 */}
          <div className="mb-4">
            <label htmlFor="storeSelect" className="mr-2 font-semibold">
              매장 선택:
            </label>
            <select
              id="storeSelect"
              value={selectedStoreId ?? ''}
              onChange={(e) => setSelectedStoreId(Number(e.target.value))}
              className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              {storeIdList.map((id) => (
                <option key={id} value={id}>
                  매장 {id}
                </option>
              ))}
            </select>
          </div>
  
          <h2 className="text-2xl font-bold mb-4">고객 피드백</h2>
          {/* 카테고리 선택 버튼 */}
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
          {/* 선택한 매장과 카테고리에 따른 피드백 리스트 */}
          {selectedStoreId && (
            <FeedbackList
              storeId={selectedStoreId}
              selectedCategory={selectedCategory}
            />
          )}
        </div>
  
        {/* 오른쪽: 머신러닝 피드백 분석 */}
        <div className="md:w-1/2 p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4">피드백 분석</h2>
          {selectedStoreId && <MLAnalysis storeId={selectedStoreId} />}
        </div>
      </div>
    );
  };
  
  export default CustomerDashboardPage;
