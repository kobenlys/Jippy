"use client";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { ChartData } from "chart.js";
import "chart.js/auto";

type InventorySalesChartProps = {
  storeId: string;
};

const InventorySalesChart: React.FC<InventorySalesChartProps> = ({ storeId }) => {
  // ✅ chartData의 타입을 명확하게 정의
  const [chartData, setChartData] = useState<ChartData<"bar"> | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 31);
        const endDate = new Date();

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/product/${storeId}/fetch/all?startDate=${startDate.toISOString().slice(0, 7)}&endDate=${endDate.toISOString().slice(0, 7)}`
        );
        const jsonResponse = await response.json();
        console.log("data:", jsonResponse);

        if (jsonResponse && jsonResponse.data && jsonResponse.data.productSoldInfo) {
          const productSales = jsonResponse.data.productSoldInfo;

          type ProductSalesItem = {
            name: string;
            totalSold: number;
          };

          const labels = productSales.map((item: ProductSalesItem) => item.name);
          const salesData = productSales.map((item: ProductSalesItem) => item.totalSold);

          // ✅ setChartData의 타입을 ChartData<"bar">로 설정
          setChartData({
            labels,
            datasets: [
              {
                label: "최근 30일 판매량",
                data: salesData,
                backgroundColor: "#FF5C00",
                borderColor: "#FF5C00",
                borderWidth: 1,
              },
            ],
          } as ChartData<"bar">);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [storeId]);

  if (!chartData) return <p>Loading chart...</p>;

  return (
    <div style={{ width: "80%", margin: "auto", height: "auto" }}>
      <h2>최근 30일 재고별 판매량</h2>
      <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: true }} />
    </div>
  );
};

export default InventorySalesChart;
