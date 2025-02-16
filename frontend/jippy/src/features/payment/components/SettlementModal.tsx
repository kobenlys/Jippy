"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/features/common/components/ui/dialog/dialog";

interface CashSettlementModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeId: number;
}

interface CashData {
  id: number;
  store_id: number;
  fifty_thousand_won: number;
  ten_thousand_won: number;
  five_thousand_won: number;
  one_thousand_won: number;
  five_hundred_won: number;
  one_hundred_won: number;
  fifty_won: number;
  ten_won: number;
}

interface PaymentHistoryItem {
  createdAt: string;
  paymentStatus: string;
  paymentType: string;
  totalCost: number;
  uuid: string;
}

interface ApiResponse<T> {
  code: number;
  success: boolean;
  data: T;
}

export default function CashSettlementModal({
  isOpen,
  onClose,
  storeId,
}: CashSettlementModalProps) {
  const [activeTab, setActiveTab] = useState<"cash" | "qr">("cash");
  const [cashData, setCashData] = useState<CashData | null>(null);
  const [qrPayments, setQrPayments] = useState<PaymentHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialCash, setInitialCash] = useState<
    Omit<CashData, "id" | "store_id">
  >({
    fifty_thousand_won: 0,
    ten_thousand_won: 0,
    five_thousand_won: 0,
    one_thousand_won: 0,
    five_hundred_won: 0,
    one_hundred_won: 0,
    fifty_won: 0,
    ten_won: 0,
  });
  const [modifiedCash, setModifiedCash] = useState<CashData | null>(null);

  const denominationMap = {
    fifty_thousand_won: { value: 50000, label: "50,000원" },
    ten_thousand_won: { value: 10000, label: "10,000원" },
    five_thousand_won: { value: 5000, label: "5,000원" },
    one_thousand_won: { value: 1000, label: "1,000원" },
    five_hundred_won: { value: 500, label: "500원" },
    one_hundred_won: { value: 100, label: "100원" },
    fifty_won: { value: 50, label: "50원" },
    ten_won: { value: 10, label: "10원" },
  };

  const fetchQrPayments = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payment-history/list/success?storeId=${storeId}`
      );

      if (!response.ok) {
        throw new Error("QR 결제 내역을 불러오는데 실패했습니다");
      }

      const result: ApiResponse<PaymentHistoryItem[]> = await response.json();

      if (!result.success) {
        throw new Error("QR 결제 내역을 불러오는데 실패했습니다");
      }

      const qrPaymentsOnly = result.data.filter(
        (payment) => payment.paymentType === "QR"
      );
      setQrPayments(qrPaymentsOnly);
    } catch (error) {
      setError("QR 결제 내역을 불러오는데 실패했습니다");
      console.error("QR payments fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCashData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cash/${storeId}/select`
      );

      if (!response.ok) {
        if (response.status === 404 || response.status === 500) {
          setCashData(null);
          setModifiedCash(null);
          return;
        }
        throw new Error("시재 정보를 불러오는데 실패했습니다");
      }

      const result: ApiResponse<CashData> = await response.json();

      if (!result.success) {
        throw new Error("시재 정보를 불러오는데 실패했습니다");
      }

      setCashData(result.data);
      setModifiedCash(result.data);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message !== "시재 정보를 불러오는데 실패했습니다"
      ) {
        setError("알 수 없는 오류가 발생했습니다");
      }
      console.error("Cash data fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (activeTab === "cash") {
        fetchCashData();
      } else {
        fetchQrPayments();
      }
    }
  }, [isOpen, activeTab, storeId]);

  const createInitialCash = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cash/${storeId}/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(initialCash),
        }
      );

      if (!response.ok) {
        throw new Error("시재 추가에 실패했습니다");
      }

      const result: ApiResponse<CashData> = await response.json();

      if (!result.success) {
        throw new Error("시재 추가에 실패했습니다");
      }

      fetchCashData();
    } catch (error) {
      setError("시재 추가에 실패했습니다");
      console.error("Create cash error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCashData = async () => {
    if (!modifiedCash) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cash/${storeId}/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fifty_thousand_won: modifiedCash.fifty_thousand_won,
            ten_thousand_won: modifiedCash.ten_thousand_won,
            five_thousand_won: modifiedCash.five_thousand_won,
            one_thousand_won: modifiedCash.one_thousand_won,
            five_hundred_won: modifiedCash.five_hundred_won,
            one_hundred_won: modifiedCash.one_hundred_won,
            fifty_won: modifiedCash.fifty_won,
            ten_won: modifiedCash.ten_won,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("시재 수정에 실패했습니다");
      }

      const result: ApiResponse<CashData> = await response.json();

      if (!result.success) {
        throw new Error("시재 수정에 실패했습니다");
      }

      setCashData(modifiedCash);
    } catch (error) {
      setError("시재 수정에 실패했습니다");
      console.error("Update cash error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCashUpdate = (
    key: keyof Omit<CashData, "id" | "store_id">,
    count: number
  ) => {
    setInitialCash((prev) => ({
      ...prev,
      [key]: count,
    }));
  };

  const handleModifiedCashChange = (
    key: keyof Omit<CashData, "id" | "store_id">,
    count: number
  ) => {
    if (!modifiedCash) return;

    setModifiedCash({
      ...modifiedCash,
      [key]: count,
    });
  };

  const calculateTotal = (data: Omit<CashData, "id" | "store_id">) => {
    return Object.entries(denominationMap).reduce((sum, [key, { value }]) => {
      return sum + value * data[key as keyof typeof data];
    }, 0);
  };

  const calculateQrTotal = () => {
    return qrPayments.reduce((sum, payment) => sum + payment.totalCost, 0);
  };

  const hasChanges = () => {
    if (!cashData || !modifiedCash) return false;
    return Object.keys(denominationMap).some(
      (key) =>
        cashData[key as keyof CashData] !== modifiedCash[key as keyof CashData]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>시재 정산</DialogTitle>
        </DialogHeader>

        <div className="mb-4">
          <div className="flex space-x-2 border-b">
            <button
              className={`px-4 py-2 ${
                activeTab === "cash"
                  ? "border-b-2 border-orange-500 text-orange-500"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("cash")}
            >
              현금 정산
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === "qr"
                  ? "border-b-2 border-orange-500 text-orange-500"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("qr")}
            >
              QR 정산
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500" />
          </div>
        ) : error ? (
          <div className="text-red-500 p-4 text-center bg-red-50 rounded-lg">
            <p className="text-sm">{error}</p>
          </div>
        ) : activeTab === "qr" ? (
          <div className="mt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 font-medium text-gray-600">
                <div>시간</div>
                <div className="text-center">상태</div>
                <div className="text-right">금액</div>
              </div>
              <div className="space-y-2">
                {qrPayments.map((payment) => (
                  <div key={payment.uuid} className="grid grid-cols-3 gap-4">
                    <div>
                      {new Date(payment.createdAt).toLocaleTimeString()}
                    </div>
                    <div className="text-center">{payment.paymentStatus}</div>
                    <div className="text-right">
                      {payment.totalCost.toLocaleString()}원
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t">
                <div className="grid grid-cols-2 gap-4">
                  <div className="font-semibold">총계</div>
                  <div className="text-right font-semibold">
                    {calculateQrTotal().toLocaleString()}원
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : !cashData ? (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-4">초기 시재 입력</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-gray-600">권종</div>
              <div className="text-center">수량</div>
              <div className="text-right">금액</div>
              {Object.entries(denominationMap).map(
                ([key, { label, value }]) => (
                  <React.Fragment key={key}>
                    <div>{label}</div>
                    <div className="text-center">
                      <input
                        type="number"
                        min="0"
                        className="w-16 text-center border rounded-md"
                        value={initialCash[key as keyof typeof initialCash]}
                        onChange={(e) =>
                          handleCashUpdate(
                            key as keyof Omit<CashData, "id" | "store_id">,
                            parseInt(e.target.value) || 0
                          )
                        }
                      />
                    </div>
                    <div className="text-right">
                      {(
                        initialCash[key as keyof typeof initialCash] * value
                      ).toLocaleString()}
                      원
                    </div>
                  </React.Fragment>
                )
              )}
            </div>
            <div className="mt-6 pt-4 border-t">
              <div className="grid grid-cols-2 gap-4">
                <div className="font-semibold">총계</div>
                <div className="text-right font-semibold">
                  {calculateTotal(initialCash).toLocaleString()}원
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={createInitialCash}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200"
              >
                시재 등록
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">현금 정산</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-gray-600">권종</div>
                <div className="text-center">수량</div>
                <div className="text-right">금액</div>
                {Object.entries(denominationMap).map(
                  ([key, { label, value }]) => (
                    <React.Fragment key={key}>
                      <div>{label}</div>
                      <div className="text-center">
                        <input
                          type="number"
                          min="0"
                          className="w-16 text-center border rounded-md"
                          value={modifiedCash?.[key as keyof CashData] ?? 0}
                          onChange={(e) =>
                            handleModifiedCashChange(
                              key as keyof Omit<CashData, "id" | "store_id">,
                              parseInt(e.target.value) || 0
                            )
                          }
                        />
                      </div>
                      <div className="text-right">
                        {(
                          (modifiedCash?.[key as keyof CashData] ?? 0) * value
                        ).toLocaleString()}
                        원
                      </div>
                    </React.Fragment>
                  )
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t">
              <div className="grid grid-cols-2 gap-4">
                <div className="font-semibold">총계</div>
                <div className="text-right font-semibold">
                  {modifiedCash &&
                    calculateTotal(modifiedCash).toLocaleString()}
                  원
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={updateCashData}
                disabled={!hasChanges()}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                  hasChanges()
                    ? "bg-orange-500 text-white hover:bg-orange-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                시재 수정
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
