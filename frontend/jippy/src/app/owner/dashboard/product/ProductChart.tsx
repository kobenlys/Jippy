// app/owner/dashboard/product/ProductChart.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { ChartData } from "chart.js";
import "chart.js/auto";

type ProductChartProps = {
  storeId: number;
};

const ProductChart: React.FC<ProductChartProps> = ({ storeId }) => {
  const [chartData, setChartData] = useState<ChartData<"bar"> | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 31);
        const endDate = new Date();

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/product/${storeId}/fetch/all?startDate=${startDate
            .toISOString()
            .slice(0, 7)}&endDate=${endDate.toISOString().slice(0, 7)}`
        );
        const jsonResponse = await response.json();
        console.log("data:", jsonResponse);

        if (
          jsonResponse &&
          jsonResponse.data &&
          jsonResponse.data.productSoldInfo
        ) {
          const productSales = jsonResponse.data.productSoldInfo;

          type ProductSalesItem = {
            name: string;
            totalSold: number;
          };

          const labels = productSales.map(
            (item: ProductSalesItem) => item.name
          );
          const salesData = productSales.map(
            (item: ProductSalesItem) => item.totalSold
          );

          setChartData({
            labels,
            datasets: [
              {
                label: "최근 30일 판매량",
                data: salesData,
                backgroundColor: "#F27B39",
                borderColor: "#F27B39",
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
    <div className="w-full overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4" style={{ color: "#F27B39" }}>
        최근 30일 재고별 판매량
      </h2>
      {/* 고정 높이로 설정하여 스크롤 발생 가능 */}
      <div className="h-80">
        <Bar
          data={chartData}
          options={{ responsive: true, maintainAspectRatio: false }}
        />
      </div>
    </div>
  );
};

export default ProductChart;
