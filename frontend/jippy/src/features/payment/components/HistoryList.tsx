'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { PaymentHistoryItem, PaymentHistoryDetail } from '@/features/payment/types/history';

interface HistoryListProps {
  onSelectPayment: (payment: PaymentHistoryDetail) => void;
  filter?: 'all' | 'success' | 'cancel';
}

export default function PaymentHistoryList({ 
  onSelectPayment, 
  filter = 'all' 
}: HistoryListProps) {
  const [payments, setPayments] = useState<PaymentHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const storeId = 1;

  const fetchPaymentDetail = useCallback(async (uuid: string) => {
    try {
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/payment-history/detail`);
      url.searchParams.append('storeId', storeId.toString());
      url.searchParams.append('paymentUUID', uuid);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`결제 상세 정보를 불러오는 데 실패했습니다. 상태 코드: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        onSelectPayment(data.data);
        return data.data;
      }
      throw new Error(data.message || '결제 상세 정보를 불러오는 데 실패했습니다.');
    } catch (err) {
      console.error('결제 상세 정보 조회 실패:', err);
      return null;
    }
  }, [onSelectPayment, storeId]);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/api/payment-history/`;

      switch (filter) {
        case 'success':
          url += 'list/success';
          break;
        case 'cancel':
          url += 'list/cancel';
          break;
        default:
          url += 'list';
      }

      const params = new URLSearchParams({
        storeId: storeId.toString()
      });

      const response = await fetch(`${url}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('결제 내역을 불러오는 데 실패했습니다.');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || '결제 내역을 불러오는 데 실패했습니다.');
      }

      setPayments(result.data);

      if (result.data.length > 0 && currentPage === 1) {
        await fetchPaymentDetail(result.data[0].uuid);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filter, currentPage, fetchPaymentDetail]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  // 날짜 필터링 및 페이지네이션 처리된 데이터
  const filteredAndPaginatedPayments = useMemo(() => {
    let filtered = [...payments];

    // 날짜 필터링
    if (startDate || endDate) {
      filtered = filtered.filter(payment => {
        const paymentDate = new Date(payment.createdAt);
        const start = startDate ? new Date(startDate) : new Date(0);
        const end = endDate ? new Date(endDate) : new Date();
        end.setHours(23, 59, 59, 999); // 종료일은 해당 일자의 마지막 시간으로 설정
        
        return paymentDate >= start && paymentDate <= end;
      });
    }

    // 페이지네이션
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filtered.slice(startIndex, startIndex + itemsPerPage);
  }, [payments, startDate, endDate, currentPage]);

  const totalPages = useMemo(() => {
    const filteredCount = payments.filter(payment => {
      if (!startDate && !endDate) return true;
      
      const paymentDate = new Date(payment.createdAt);
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date();
      end.setHours(23, 59, 59, 999);
      
      return paymentDate >= start && paymentDate <= end;
    }).length;
    
    return Math.ceil(filteredCount / itemsPerPage);
  }, [payments, startDate, endDate]);

  const handlePaymentSelect = async (payment: PaymentHistoryItem) => {
    await fetchPaymentDetail(payment.uuid);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleDateFilter = () => {
    setCurrentPage(1); // 필터 적용 시 첫 페이지로 이동
  };

  return (
    <div className="bg-white shadow rounded-lg">
      {/* 날짜 필터 */}
      <div className="p-4 border-b">
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <label htmlFor="startDate">시작일:</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="endDate">종료일:</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>
          <button
            onClick={handleDateFilter}
            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
          >
            조회
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-4">결제 내역을 불러오는 중...</div>
      ) : error ? (
        <div className="text-red-500 text-center py-4">{error}</div>
      ) : filteredAndPaginatedPayments.length === 0 ? (
        <div className="text-center py-4 text-gray-500">결제 내역이 없습니다.</div>
      ) : (
        <>
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">결제일시</th>
                <th className="px-4 py-2 text-right">결제금액</th>
                <th className="px-4 py-2 text-center">결제수단</th>
                <th className="px-4 py-2 text-center">상태</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndPaginatedPayments.map((payment) => (
                <tr 
                  key={payment.uuid}
                  onClick={() => handlePaymentSelect(payment)}
                  className="hover:bg-gray-50 cursor-pointer border-b"
                >
                  <td className="px-4 py-2">
                    {new Date(payment.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {payment.totalCost.toLocaleString()}원
                  </td>
                  <td className="px-4 py-2 text-center">
                    {payment.paymentType}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {payment.paymentStatus}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 페이지네이션 */}
          <div className="flex justify-center items-center gap-2 p-4">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border disabled:opacity-50"
            >
              {'<<'}
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border disabled:opacity-50"
            >
              {'<'}
            </button>
            
            <span className="mx-4">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border disabled:opacity-50"
            >
              {'>'}
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border disabled:opacity-50"
            >
              {'>>'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}