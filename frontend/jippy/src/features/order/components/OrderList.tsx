'use client';

import { useState, useEffect } from 'react';
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

  // 스토어 ID (환경 설정 또는 글로벌 상태에서 가져오기)
  const storeId = 1;

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      setError(null);

      try {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/api/payment-history/`;

        // 필터에 따라 다른 엔드포인트 선택
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

        const response = await fetch(`${url}?storeId=${storeId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('결제 내역을 불러오는 데 실패했습니다.');
        }

        const data = await response.json();
        
        // 날짜 기준 내림차순 정렬
        const sortedPayments = data.data.sort((a: PaymentHistoryItem, b: PaymentHistoryItem) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setPayments(sortedPayments);

        // 첫 번째 결제 내역의 상세 정보 자동 로드
        if (sortedPayments.length > 0) {
          await fetchPaymentDetail(sortedPayments[0].uuid);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // 결제 상세 정보 가져오기
    const fetchPaymentDetail = async (uuid: string) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/payment-history/detail??storeId=${storeId}&paymentUUIDRequest=${uuid}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );

        if (!response.ok) {
          throw new Error('결제 상세 정보를 불러오는 데 실패했습니다.');
        }

        const data = await response.json();
        onSelectPayment(data.data);
        return data.data;
      } catch (err) {
        console.error('결제 상세 정보 조회 실패:', err);
        return null;
      }
    };

    fetchPayments();
  }, [filter, onSelectPayment]);

  if (loading) {
    return <div className="text-center py-4">결제 내역을 불러오는 중...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  if (payments.length === 0) {
    return <div className="text-center py-4 text-gray-500">결제 내역이 없습니다.</div>;
  }

  return (
    <div className="bg-white shadow rounded-lg h-full">
      <table className="w-full">
        <thead className="bg-gray-100 sticky top-0 z-10">
          <tr>
            <th className="px-4 py-2 text-left">결제일시</th>
            <th className="px-4 py-2 text-right">결제금액</th>
            <th className="px-4 py-2 text-center">결제수단</th>
            <th className="px-4 py-2 text-center">상태</th>
          </tr>
        </thead>
      </table>
      <div className="overflow-y-auto max-h-[calc(100vh-250px)]">
        <table className="w-full">
          <tbody>
            {payments.map((payment) => (
              <tr 
                key={payment.uuid}
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
      </div>
    </div>
  );
}