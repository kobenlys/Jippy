"use client";

import { useState } from "react";
import PaymentHistoryList from "@/features/payment/components/HistoryList";
import PaymentHistoryDetail from "@/features/payment/components/HistoryDetail";
import CashSettlementModal from "@/features/payment/components/SettlementModal";
import {
  PaymentHistoryDetail as PaymentDetailType,
  PaymentHistoryItem,
  ApiResponse,
} from "@/features/payment/types/history";

const PaymentHistoryPage = () => {
  const [selectedPayment, setSelectedPayment] =
    useState<PaymentDetailType | null>(null);
  const [historyFilter, setHistoryFilter] = useState<
    "all" | "success" | "cancel"
  >("all");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCashModalOpen, setIsCashModalOpen] = useState(false);

  const fetchPaymentDetail = async (storeId: number, paymentUUID: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payment-history/detail`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentUUID,
            storeId: 1,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("결제 상세 정보를 불러오는데 실패했습니다");
      }

      const result: ApiResponse<PaymentDetailType> = await response.json();

      if (!result.success) {
        throw new Error("결제 상세 정보를 불러오는데 실패했습니다");
      }

      setSelectedPayment(result.data);
    } catch (error) {
      setError("알 수 없는 오류가 발생했습니다");
      console.log(error);
      setSelectedPayment(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">결제 내역</h1>
        <button
          onClick={() => setIsCashModalOpen(true)}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200"
        >
          정산
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setHistoryFilter("all")}
          className={`px-4 py-2 rounded-lg transition-colors duration-200 text-sm sm:text-base ${
            historyFilter === "all"
              ? "bg-orange-500 text-white hover:bg-orange-600"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          전체 내역
        </button>
        <button
          onClick={() => setHistoryFilter("success")}
          className={`px-4 py-2 rounded-lg transition-colors duration-200 text-sm sm:text-base ${
            historyFilter === "success"
              ? "bg-orange-500 text-white hover:bg-orange-600"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          결제 성공
        </button>
        <button
          onClick={() => setHistoryFilter("cancel")}
          className={`px-4 py-2 rounded-lg transition-colors duration-200 text-sm sm:text-base ${
            historyFilter === "cancel"
              ? "bg-orange-500 text-white hover:bg-orange-600"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          결제 취소
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <PaymentHistoryList
            filter={historyFilter}
            onSelectPayment={(payment: PaymentHistoryItem) => {
              fetchPaymentDetail(1, payment.uuid);
            }}
          />
        </div>

        <div className="lg:col-span-5">
          <div className="bg-white rounded-lg shadow p-4 h-full">
            {isLoading ? (
              <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500" />
              </div>
            ) : error ? (
              <div className="text-red-500 p-4 text-center bg-red-50 rounded-lg">
                <p className="font-medium">오류 발생</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            ) : selectedPayment ? (
              <PaymentHistoryDetail payment={selectedPayment} />
            ) : (
              <div className="text-gray-500 text-center py-12">
                결제 내역을 선택해주세요
              </div>
            )}
          </div>
        </div>
      </div>

      <CashSettlementModal
        isOpen={isCashModalOpen}
        onClose={() => setIsCashModalOpen(false)}
        storeId={1}
      />
    </div>
  );
};

export default PaymentHistoryPage;
