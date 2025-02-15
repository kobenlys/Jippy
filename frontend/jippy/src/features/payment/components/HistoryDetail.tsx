'use client';

import { PaymentHistoryDetail } from '@/features/payment/types/history';

interface HistoryDetailProps {
  payment: PaymentHistoryDetail | null;
}

export default function HistoryDetail({ payment }: HistoryDetailProps) {
  // 초기 상태일 때 null 대신 undefined로 명시적 처리
  if (payment === null) {
    return (
      <div className="bg-white shadow rounded-lg p-4 text-center text-gray-500">
        결제 내역을 선택해주세요.
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">결제 상세 내역</h2>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="font-medium">결제 일시</span>
          <span>{new Date(payment.createdAt).toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="font-medium">결제 수단</span>
          <span>{payment.paymentType}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="font-medium">결제 상태</span>
          <span>{payment.paymentStatus}</span>
        </div>
        
        <div className="border-t my-2"></div>
        
        <h3 className="font-bold mb-2">구매 상품</h3>
        {payment.buyProduct && payment.buyProduct.length > 0 ? (
          payment.buyProduct.map((product) => (
            <div 
              key={product.productId} 
              className="flex justify-between bg-gray-50 p-2 rounded mb-2"
            >
              <div>
                <div className="font-medium">{product.productName}</div>
                <div className="text-sm text-gray-500">
                  {product.productQuantity}개
                </div>
              </div>
              <div className="font-medium">
                {(product.price * product.productQuantity).toLocaleString()}원
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">
            구매 상품 정보가 없습니다.
          </div>
        )}
        
        <div className="border-t my-2"></div>
        
        <div className="flex justify-between font-bold text-lg">
          <span>총 결제 금액</span>
          <span>{payment.totalCost.toLocaleString()}원</span>
        </div>
      </div>
    </div>
  );
}