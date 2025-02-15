'use client';

import { useState } from 'react';
import PaymentHistoryList from '@/features/payment/components/HistoryList';
import PaymentHistoryDetail from '@/features/payment/components/HistoryDetail';
import { PaymentHistoryDetail as PaymentDetailType } from '@/features/payment/types/history';

export default function PaymentHistoryPage() {
  const [selectedPayment, setSelectedPayment] = useState<PaymentDetailType | null>(null);
  const [historyFilter, setHistoryFilter] = useState<'all' | 'success' | 'cancel'>('all');

  // 첫 렌더링 시 기본적으로 전체 내역의 첫 번째 항목을 선택하도록 하는 핸들러
  const handleSelectFirstPayment = (payment: PaymentDetailType) => {
    setSelectedPayment(payment);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">결제 내역</h1>
      
      <div className="mb-4 flex space-x-2">
        <button 
          onClick={() => setHistoryFilter('all')}
          className={`px-4 py-2 rounded ${
            historyFilter === 'all' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          전체 내역
        </button>
        <button 
          onClick={() => setHistoryFilter('success')}
          className={`px-4 py-2 rounded ${
            historyFilter === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          결제 성공
        </button>
        <button 
          onClick={() => setHistoryFilter('cancel')}
          className={`px-4 py-2 rounded ${
            historyFilter === 'cancel' 
              ? 'bg-red-500 text-white' 
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          결제 취소
        </button>
      </div>
      
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-7">
          <PaymentHistoryList 
            filter={historyFilter}
            onSelectPayment={(payment) => {
              setSelectedPayment(payment);
              // 첫 번째 항목 선택 시 상세 정보도 자동으로 표시
              handleSelectFirstPayment(payment);
            }} 
          />
        </div>
        
        <div className="col-span-5">
          <PaymentHistoryDetail payment={selectedPayment} />
        </div>
      </div>
    </div>
  );
}