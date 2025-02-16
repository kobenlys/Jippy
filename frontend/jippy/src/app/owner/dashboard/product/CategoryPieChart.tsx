// app/owner/dashboard/product/CategoryPieChart.tsx
"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Pie } from "react-chartjs-2";
import { ChartData } from "chart.js";
import "chart.js/auto";

interface ProductSoldInfo {
  productId: number;
  productCategoryId: number;
  storeId: number;
  name: string;
  price: number;
  status: boolean;
  totalSold: number;
  image: string;
  productType: string;
  productSize: string;
}

interface CategoryResponse {
  id: number;
  categoryName: string;
}

interface CategoryPieChartProps {
  storeId: number;
}

const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ storeId }) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = String(now.getMonth() + 1).padStart(2, "0");

  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);
  const [chartData, setChartData] = useState<ChartData<"pie"> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [categoryMap, setCategoryMap] = useState<Record<number, string>>({});

  // 카테고리 목록 가져오기 (최초 mount 시)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const catRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/category/${storeId}/select`
        );
        const catJson = await catRes.json();
        if (catJson.success) {
          const catData: CategoryResponse[] = catJson.data;
          const map: Record<number, string> = {};
          catData.forEach((cat) => {
            map[cat.id] = cat.categoryName;
          });
          setCategoryMap(map);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [storeId]);

  const fetchCategoryPieData = useCallback(async () => {
    setLoading(true);
    try {
      const startDate = `${selectedYear}-${selectedMonth}`;
      const endDate = startDate;
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/product/${storeId}/fetch/all?startDate=${startDate}&endDate=${endDate}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        const productSoldInfo: ProductSoldInfo[] = json.data.productSoldInfo || [];
        const catTotals: Record<number, number> = {};
        productSoldInfo.forEach((item) => {
          const catId = item.productCategoryId;
          if (!catTotals[catId]) {
            catTotals[catId] = 0;
          }
          catTotals[catId] += item.totalSold;
        });
        const labels: string[] = [];
        const data: number[] = [];
        Object.entries(catTotals).forEach(([catIdStr, total]) => {
          const catId = Number(catIdStr);
          const catName = categoryMap[catId] || `카테고리 ${catId}`;
          labels.push(catName);
          data.push(total);
        });
        const pieData: ChartData<"pie"> = {
          labels,
          datasets: [
            {
              label: "카테고리 판매량",
              data,
              backgroundColor: [
                "#F27B39",
                "#EAB308",
                "#22C55E",
                "#3B82F6",
                "#6366F1",
                "#EC4899",
                "#F87171",
                "#FB923C",
                "#FBBF24",
                "#84CC16",
              ],
            },
          ],
        };
        setChartData(pieData);
      }
    } catch (error) {
      console.error("Error fetching category pie data:", error);
    }
    setLoading(false);
  }, [selectedYear, selectedMonth, storeId, categoryMap]);

  useEffect(() => {
    if (Object.keys(categoryMap).length > 0) {
      fetchCategoryPieData();
    }
  }, [selectedYear, selectedMonth, storeId, categoryMap, fetchCategoryPieData]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4" style={{ color: "#F27B39" }}>
        카테고리별 판매량
      </h2>
      <div className="mb-4 flex items-center gap-4">
        <label className="text-sm font-medium">연도:</label>
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
        <label className="text-sm font-medium">월:</label>
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
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : chartData ? (
        <div style={{ width: "100%", height: "250px" }}>
          <Pie
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: "right" },
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

export default CategoryPieChart;
