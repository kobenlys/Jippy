'use client';

import { PaymentHistoryDetail } from '@/features/payment/types/history';

interface HistoryDetailProps {
  payment: PaymentHistoryDetail | null;
}

export default function HistoryDetail({ payment }: HistoryDetailProps) {
  if (payment === null) {
    return (
      <div className="bg-white shadow rounded-lg p-4 text-center text-gray-500">
        결제 내역을 선택해주세요.
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-800">결제 상세 내역</h2>
      
      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
          <span className="font-medium text-gray-600">결제 일시</span>
          <span className="text-gray-800">{new Date(payment.createdAt).toLocaleString()}</span>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
          <span className="font-medium text-gray-600">결제 수단</span>
          <span className="text-gray-800">{payment.paymentType}</span>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
          <span className="font-medium text-gray-600">결제 상태</span>
          <span className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-sm
            ${payment.paymentStatus === '완료' ? 'bg-green-100 text-green-800' : 
              payment.paymentStatus === '취소' ? 'bg-red-100 text-red-800' : 
              'bg-gray-100 text-gray-800'}`}>
            {payment.paymentStatus}
          </span>
        </div>
        
        <div className="border-t my-4"></div>
        
        <h3 className="font-bold text-gray-800 mb-3">구매 상품</h3>
        {payment.buyProduct && payment.buyProduct.length > 0 ? (
          <div className="space-y-2">
            {payment.buyProduct.map((product) => (
              <div 
                key={product.productId} 
                className="flex flex-col sm:flex-row justify-between bg-gray-50 p-3 rounded-lg"
              >
                <div className="mb-2 sm:mb-0">
                  <div className="font-medium text-gray-800">{product.productName}</div>
                  <div className="text-sm text-gray-500">
                    {product.productQuantity}개
                  </div>
                </div>
                <div className="font-medium text-gray-800 text-right">
                  {(product.price * product.productQuantity).toLocaleString()}원
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-4">
            구매 상품 정보가 없습니다.
          </div>
        )}
        
        <div className="border-t my-4"></div>
        
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
          <span className="font-bold text-lg text-gray-800">총 결제 금액</span>
          <span className="font-bold text-xl sm:text-2xl text-orange-500">
            {payment.totalCost.toLocaleString()}원
          </span>
        </div>
      </div>
    </div>
  );
}