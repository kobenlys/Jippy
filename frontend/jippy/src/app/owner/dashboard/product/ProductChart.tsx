// app/owner/dashboard/product/ProductChart.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { ChartData } from "chart.js";
import "chart.js/auto";

type ProductChartProps = {
  storeId: number;
};

type ProductSalesItem = {
  name: string;
  totalSold: number;
};

const ProductChart: React.FC<ProductChartProps> = ({ storeId }) => {
  // viewType: "recent" for 최근 30일, "monthly" for 월별 데이터
  const [viewType, setViewType] = useState<"recent" | "monthly">("recent");
  // 월별 선택용
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<string>(
    String(new Date().getMonth() + 1).padStart(2, "0")
  );
  const [chartData, setChartData] = useState<ChartData<"bar"> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // 최근 30일 데이터 fetch
  const fetchRecentData = async () => {
    setLoading(true);
    try {
      const today = new Date();
      const startDate = new Date();
      startDate.setDate(today.getDate() - 30);
      // API expects yyyy-MM
      const startStr = startDate.toISOString().slice(0, 7);
      const endStr = today.toISOString().slice(0, 7);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/product/${storeId}/fetch/all?startDate=${startStr}&endDate=${endStr}`
      );
      const jsonResponse = await response.json();
      if (
        jsonResponse &&
        jsonResponse.success &&
        jsonResponse.data &&
        jsonResponse.data.productSoldInfo
      ) {
        const productSales: ProductSalesItem[] = jsonResponse.data.productSoldInfo;
        const labels = productSales.map((item) => item.name);
        const salesData = productSales.map((item) => item.totalSold);
        setChartData({
          labels,
          datasets: [
            {
              label: "최근 30일 판매량",
              data: salesData,
              backgroundColor: "#F27B39",
              borderColor: "#F27B39",
              borderWidth: 1,
               // 추가할 속성들
              hoverBackgroundColor: "#D35F1D",  // hover 시 더 진한 색상
              borderRadius: 8,  // 모서리를 둥글게
              barThickness: 'flex',  // 자동으로 적절한 두께 조정
            },
          ],
        });
      }
    } catch (error) {
      console.error("Error fetching recent data:", error);
    }
    setLoading(false);
  };

  // 월별 데이터 fetch (선택한 연도와 월 사용)
  const fetchMonthlyData = async () => {
    setLoading(true);
    try {
      const startDate = `${selectedYear}-${selectedMonth}`; // yyyy-MM
      const endDate = startDate; // 동일 월
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/product/${storeId}/fetch/all?startDate=${startDate}&endDate=${endDate}`
      );
      const jsonResponse = await response.json();
      if (
        jsonResponse &&
        jsonResponse.success &&
        jsonResponse.data &&
        jsonResponse.data.productSoldInfo
      ) {
        const productSales: ProductSalesItem[] = jsonResponse.data.productSoldInfo;
        const labels = productSales.map((item) => item.name);
        const salesData = productSales.map((item) => item.totalSold);
        setChartData({
          labels,
          datasets: [
            {
              label: `판매량 (${selectedYear}-${selectedMonth})`,
              data: salesData,
              backgroundColor: "#F27B39",
              borderColor: "#F27B39",
              borderWidth: 1,
            },
          ],
        });
      }
    } catch (error) {
      console.error("Error fetching monthly data:", error);
    }
    setLoading(false);
  };

  // viewType 또는 월별 선택값 변경 시 데이터를 새로 가져옵니다.
  useEffect(() => {
    if (viewType === "recent") {
      fetchRecentData();
    } else {
      fetchMonthlyData();
    }
  }, [storeId, viewType, selectedYear, selectedMonth]);

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-4">
        <h2 className="text-2xl font-bold" style={{ color: "#F27B39" }}>
          {viewType === "recent" ? "최근 30일 판매량" : "월별 판매량"}
        </h2>
        <div className="flex items-center gap-4 mt-2 sm:mt-0">
          <select
            value={viewType}
            onChange={(e) => setViewType(e.target.value as "recent" | "monthly")}
            className="border p-1 rounded"
          >
            <option value="recent">최근 30일</option>
            <option value="monthly">월별</option>
          </select>
          {viewType === "monthly" && (
            <>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="border p-1 rounded"
              >
                {Array.from({ length: 5 }, (_, i) => currentYear - i).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="border p-1 rounded"
              >
                {[
                  { value: "01", label: "1월" },
                  { value: "02", label: "2월" },
                  { value: "03", label: "3월" },
                  { value: "04", label: "4월" },
                  { value: "05", label: "5월" },
                  { value: "06", label: "6월" },
                  { value: "07", label: "7월" },
                  { value: "08", label: "8월" },
                  { value: "09", label: "9월" },
                  { value: "10", label: "10월" },
                  { value: "11", label: "11월" },
                  { value: "12", label: "12월" },
                ].map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>
      </div>
      {loading ? (
        <p>차트를 불러오는 중...</p>
      ) : chartData ? (
        <div className="h-80">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: "top" },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      ) : (
        <p>데이터가 없습니다.</p>
      )}
    </div>
  );
};

export default ProductChart;
