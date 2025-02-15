"use client";

import { useEffect, useState } from "react";
import staffApi from "../hooks/staffApi";
import LoadingSpinner from "@/features/common/components/ui/LoadingSpinner";

interface StoreSalaryCardProps {
  storeId: number;
}

const StoreSalaryCard = ({ storeId }: StoreSalaryCardProps) => {
  const [lastMonthSalary, setLastMonthSalary] = useState<number | null>(null);
  const [currentMonthSalary, setCurrentMonthSalary] = useState<number | null>(
    null
  );
  const [totalSalary, setTotalSalary] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSalaryData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth() + 1;

        const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
        const lastMonthYear =
          currentMonth === 1 ? currentYear - 1 : currentYear;

        const currentMonthStr = `${currentYear}-${String(currentMonth).padStart(
          2,
          "0"
        )}`;
        const lastMonthStr = `${lastMonthYear}-${String(lastMonth).padStart(
          2,
          "0"
        )}`;

        const [lastMonthData, currentMonthData, totalData] = await Promise.all([
          staffApi.getStoreSalary(storeId, lastMonthStr),
          staffApi.getStoreSalary(storeId, currentMonthStr),
          staffApi.getTotalStoreSalary(storeId),
        ]);

        if (
          lastMonthData.success &&
          currentMonthData.success &&
          totalData.success
        ) {
          setLastMonthSalary(lastMonthData.data.storeSalary);
          setCurrentMonthSalary(currentMonthData.data.storeSalary);
          setTotalSalary(totalData.data.totalStoreSalary);
        } else {
          throw new Error("데이터 조회에 실패했습니다.");
        }
      } catch (err) {
        setError("인건비 정보를 불러오는데 실패했습니다.");
        console.error("Failed to fetch salary data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSalaryData();
  }, [storeId]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">매장 인건비 현황</h2>
      </div>
      <div className="grid grid-cols-3 divide-x">
        <div className="p-4 text-center">
          <h3 className="text-sm text-gray-500 mb-2">저번 달 인건비</h3>
          <p className="text-xl font-bold">
            {lastMonthSalary?.toLocaleString()}원
          </p>
        </div>
        <div className="p-4 text-center">
          <h3 className="text-sm text-gray-500 mb-2">이번 달 인건비</h3>
          <p className="text-xl font-bold text-blue-600">
            {currentMonthSalary?.toLocaleString()}원
          </p>
        </div>
        <div className="p-4 text-center">
          <h3 className="text-sm text-gray-500 mb-2">누적 인건비</h3>
          <p className="text-xl font-bold text-purple-600">
            {totalSalary?.toLocaleString()}원
          </p>
        </div>
      </div>
    </div>
  );
};

export default StoreSalaryCard;
