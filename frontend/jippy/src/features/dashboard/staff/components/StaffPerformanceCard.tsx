"use client";

import React, { useState } from "react";
import LoadingSpinner from "@/features/common/components/ui/LoadingSpinner";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
} from "recharts";
import { useStaffPerformance } from "../hooks/useStaffStatistic";

interface StaffPerformanceCardProps {
  storeId: number;
}

interface ChartData {
  id: number;
  name: string;
  value: number;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    payload: ChartData;
  }>;
}

const COLORS = ["#FF5C00", "#FF8C40", "#FFBD80", "#FFDEBF", "#FFF0E6"];

const StaffPerformanceCard = ({ storeId }: StaffPerformanceCardProps) => {
  const { isLoading, error, monthlySales } = useStaffPerformance(storeId);
  const [selectedStaff, setSelectedStaff] = useState<number | null>(null);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
  if (!monthlySales.length) return null;

  const lastMonth = monthlySales[0];
  const chartData: ChartData[] = lastMonth.staffSales
    .sort((a, b) => b.earnSales - a.earnSales)
    .map((staff) => ({
      id: staff.staffId,
      name: staff.staffName,
      value: staff.earnSales,
    }));

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border rounded shadow">
          <p className="font-medium">{data.name}</p>
          <p className="text-[#ff5c00]">{data.value.toLocaleString()}원</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {lastMonth.yearMonth} 직원별 매출
          </h2>
          <span className="text-[#ff5c00] font-bold">
            {lastMonth.totalSales.toLocaleString()}원
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="h-72 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                onMouseEnter={(data) => setSelectedStaff(data.id)}
                onMouseLeave={() => setSelectedStaff(null)}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    style={{
                      filter:
                        selectedStaff === entry.id
                          ? "brightness(0.9)"
                          : undefined,
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {chartData.map((staff, index) => (
            <div
              key={staff.id}
              className={`p-4 rounded-lg flex items-center gap-3 cursor-pointer transition-colors ${
                selectedStaff === staff.id
                  ? "bg-orange-50"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
              onMouseEnter={() => setSelectedStaff(staff.id)}
              onMouseLeave={() => setSelectedStaff(null)}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <div className="flex-1">
                <p className="font-medium">{staff.name}</p>
                <p className="text-sm text-gray-600">
                  {staff.value.toLocaleString()}원
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaffPerformanceCard;
