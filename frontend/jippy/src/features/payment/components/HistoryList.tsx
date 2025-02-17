"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  PaymentHistoryItem,
  PaymentHistoryDetail,
} from "@/features/payment/types/history";

interface HistoryListProps {
  onSelectPayment: (payment: PaymentHistoryDetail) => void;
  filter?: "all" | "success" | "cancel";
}

export default function PaymentHistoryList({
  onSelectPayment,
  filter = "all",
}: HistoryListProps) {
  const [payments, setPayments] = useState<PaymentHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPaymentDetail, setSelectedPaymentDetail] =
    useState<PaymentHistoryDetail | null>(null);
  const itemsPerPage = 10;

  const storeId = 1;

  // 공통 API 호출 함수 (fetch 방식 통일)
  const fetchFromAPI = async (url: string, options?: RequestInit) => {
    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
        ...options,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `API 호출 실패. 상태 코드: ${response.status}, 메시지: ${errorText}`
        );
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "API 호출에 실패했습니다.");
      }

      return result.data;
    } catch (err) {
      console.error("API 호출 중 오류:", err);
      throw err;
    }
  };

  // 결제 상세 정보 조회 함수
  const fetchPaymentDetail = useCallback(
    async (uuid: string) => {
      try {
        if (!process.env.NEXT_PUBLIC_API_URL) {
          throw new Error("API URL이 설정되지 않았습니다.");
        }

        const data = await fetchFromAPI(
          `${process.env.NEXT_PUBLIC_API_URL}/api/payment-history/detail`,
          {
            method: "POST",
            body: JSON.stringify({
              storeId: storeId,
              paymentUUID: uuid,
            }),
          }
        );

        // 상태값 변환 추가
        const transformedData = {
          ...data,
          paymentStatus: data.paymentStatus === 'PURCHASE' ? '완료' : 
                        data.paymentStatus === 'CANCEL' ? '취소' : 
                        data.paymentStatus
        };

        onSelectPayment(transformedData);
        return transformedData;
      } catch (err) {
        console.error("결제 상세 정보 조회 실패:", err);
        throw err;
      }
    },
    [onSelectPayment, storeId]
  );

  // 결제 내역 조회 함수
  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error("API URL이 설정되지 않았습니다.");
      }

      const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/payment-history`;
      const params = new URLSearchParams({
        storeId: storeId.toString(),
      });

      let url;
      switch (filter) {
        case "success":
          url = `${baseUrl}/list/success?${params}`;  // 구매(완료) 상태만 조회
          break;
        case "cancel":
          url = `${baseUrl}/list/cancel?${params}`;   // 취소 상태만 조회
          break;
        default:
          url = `${baseUrl}/list?${params}`;         // 전체 조회
      }

      console.log('Fetching payments from:', url); // 디버깅용 로그

      const data = await fetchFromAPI(url);

      // 백엔드 상태값('PURCHASE', 'CANCEL')을 화면 표시용('완료', '취소')으로 변환
      const mappedData = data.map((payment: any) => ({
        ...payment,
        paymentStatus: payment.paymentStatus === 'PURCHASE' ? '완료' : 
                      payment.paymentStatus === 'CANCEL' ? '취소' : 
                      payment.paymentStatus
      }));

      setPayments(mappedData || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "결제 내역을 불러오는 중 알 수 없는 오류가 발생했습니다.";

      setError(errorMessage);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }, [filter, storeId]);

  // 초기 API URL 로깅 (디버깅용)
  useEffect(() => {
    console.log("Current API URL:", process.env.NEXT_PUBLIC_API_URL);
  }, []);

  // 결제 내역 초기 로딩
  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  // 필터링 및 페이지네이션 로직
  const filteredAndPaginatedPayments = useMemo(() => {
    let filtered = [...payments];

    filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    if (startDate || endDate) {
      filtered = filtered.filter((payment) => {
        const paymentDate = new Date(payment.createdAt);
        const start = startDate ? new Date(startDate) : new Date(0);
        const end = endDate ? new Date(endDate) : new Date();
        end.setHours(23, 59, 59, 999);

        return paymentDate >= start && paymentDate <= end;
      });
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    return filtered.slice(startIndex, startIndex + itemsPerPage);
  }, [payments, startDate, endDate, currentPage]);

  // 전체 페이지 수 계산
  const totalPages = useMemo(() => {
    const filteredCount = payments.filter((payment) => {
      if (!startDate && !endDate) return true;

      const paymentDate = new Date(payment.createdAt);
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date();
      end.setHours(23, 59, 59, 999);

      return paymentDate >= start && paymentDate <= end;
    }).length;

    return Math.ceil(filteredCount / itemsPerPage);
  }, [payments, startDate, endDate]);

  // 결제 항목 선택 핸들러
  const handlePaymentSelect = async (payment: PaymentHistoryItem) => {
    try {
      const result = await fetchPaymentDetail(payment.uuid);
      if (result) {
        setSelectedPaymentDetail(result);
        onSelectPayment(result);
      }
    } catch (error) {
      console.error("결제 상세 정보 조회 실패:", error);
    }
  };

  // 페이지 변경 핸들러
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="bg-white shadow rounded-lg w-full max-w-6xl mx-auto">
      {/* 날짜 필터 섹션 유지 */}
      <div className="p-4 border-b">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
            <label
              htmlFor="startDate"
              className="text-gray-600 whitespace-nowrap"
            >
              시작일:
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded px-2 py-1 w-full sm:w-auto"
            />
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
            <label
              htmlFor="endDate"
              className="text-gray-600 whitespace-nowrap"
            >
              종료일:
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded px-2 py-1 w-full sm:w-auto"
            />
          </div>
        </div>
      </div>

      {/* 결제 내역 테이블 섹션 유지 */}
      {loading ? (
        <div className="text-center py-4">결제 내역을 불러오는 중...</div>
      ) : error ? (
        <div className="text-red-500 text-center py-4">{error}</div>
      ) : filteredAndPaginatedPayments.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          결제 내역이 없습니다.
        </div>
      ) : (
        <div className="overflow-hidden">
          <div className="min-w-full overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left whitespace-nowrap">
                    결제일시
                  </th>
                  <th className="px-4 py-2 text-right whitespace-nowrap">
                    결제금액
                  </th>
                  <th className="px-4 py-2 text-center whitespace-nowrap">
                    결제수단
                  </th>
                  <th className="px-4 py-2 text-center whitespace-nowrap">
                    상태
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAndPaginatedPayments.map((payment) => (
                  <tr
                    key={payment.uuid}
                    onClick={() => handlePaymentSelect(payment)}
                    className={`hover:bg-orange-50 cursor-pointer border-b ${
                      selectedPaymentDetail?.uuid === payment.uuid
                        ? "bg-orange-100"
                        : ""
                    }`}
                  >
                    <td className="px-4 py-2 whitespace-nowrap">
                      {new Date(payment.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-right text-orange-600 font-medium whitespace-nowrap">
                      {payment.totalCost.toLocaleString()}원
                    </td>
                    <td className="px-4 py-2 text-center whitespace-nowrap">
                      {payment.paymentType}
                    </td>
                    <td className="px-4 py-2 text-center whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-sm
                        ${
                          payment.paymentStatus === "완료"
                            ? "bg-green-100 text-green-800"
                            : payment.paymentStatus === "취소"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {payment.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 페이지네이션 섹션 유지 */}
          <div className="flex justify-center items-center gap-1 sm:gap-2 p-4 flex-wrap">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="px-2 sm:px-3 py-1 rounded border disabled:opacity-50 text-sm sm:text-base"
            >
              {"<<"}
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-2 sm:px-3 py-1 rounded border disabled:opacity-50 text-sm sm:text-base"
            >
              {"<"}
            </button>

            <span className="mx-2 sm:mx-4 text-sm sm:text-base">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-2 sm:px-3 py-1 rounded border disabled:opacity-50 text-sm sm:text-base"
            >
              {">"}
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="px-2 sm:px-3 py-1 rounded border disabled:opacity-50 text-sm sm:text-base"
            >
              {">>"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
