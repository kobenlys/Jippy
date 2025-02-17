"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { useState } from "react";

// 페이지를 동적으로 처리하도록 설정
export const dynamic = "force-dynamic";

// 실제 결제 처리를 담당하는 컴포넌트
const PaymentSuccessContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleConfirmPayment = async () => {
    setIsLoading(true);
    setError(null);
  
    try {
      const paymentKey = searchParams.get("paymentKey");
      const orderId = searchParams.get("orderId");
      const amount = searchParams.get("amount");
  
      if (!paymentKey || !orderId || !amount) {
        throw new Error("필수 파라미터가 누락되었습니다.");
      }
  
      const savedOrderData = localStorage.getItem("orderData");
      if (!savedOrderData) {
        throw new Error("주문 정보를 찾을 수 없습니다.");
      }
  
      const orderData = JSON.parse(savedOrderData);
      const amountNumber = Number(amount);

      const requestBody = {
        storeId: orderData.storeId,
        totalCost: amountNumber,
        paymentType: "QRCODE",
        productList: orderData.products.map((product: { id: string | number; quantity: number }) => ({
          productId: product.id,
          quantity: product.quantity
        })),
        orderId,
        paymentKey,
        amount: amountNumber
      };
  
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payment/qrcode/confirm`,
        requestBody
      );
  
      if (response.status === 200 || response.status === 201) {
        setIsConfirmed(true);
        localStorage.removeItem("orderData");
        
        setTimeout(() => {
          router.push("/order");
        }, 3000);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status || "Unknown";
        const errorMessage = err.response?.data?.message || err.message;
        setError(`결제 처리 중 오류가 발생했습니다. (${status}: ${errorMessage})`);
      } else {
        setError("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {isLoading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">결제 확인 중...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => setError(null)}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              다시 시도
            </button>
          </div>
        ) : isConfirmed ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-green-600 mb-4">
              결제가 완료되었습니다!
            </h1>
            <p className="text-gray-600">
              잠시 후 주문 페이지로 이동합니다...
            </p>
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              결제 확인
            </h1>
            <p className="text-gray-600 mb-6">
              결제를 확인하려면 아래 버튼을 클릭해주세요.
            </p>
            <button
              onClick={handleConfirmPayment}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              disabled={isLoading}
            >
              결제 확인하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// 메인 페이지 컴포넌트
const PaymentSuccessPage = () => {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
};

export default PaymentSuccessPage;