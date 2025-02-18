"use client";

import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import type { ChartData } from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface ComparisonDataset {
  name: string;
  data: number[];
}

interface ComparisonAccuracyMetrics {
  mape: number;
  correlation: number;
}

interface ComparisonStatistics {
  total_actual: number;
  total_predicted: number;
  accuracy_metrics: ComparisonAccuracyMetrics;
}

interface ComparisonDataItem {
  date: string;
  actual: number;
  predicted: number;
  difference: number;
  difference_percentage: number;
}

interface ComparisonResponse {
  status: string;
  message: string;
  data: {
    labels: string[]; // 날짜 문자열 (예: "2024-02-22")
    datasets: ComparisonDataset[];
    statistics: ComparisonStatistics;
    comparison_data: ComparisonDataItem[];
  };
}

const StockComparisonChart = () => {
  const [chartData, setChartData] = useState<
    ChartData<"bar" | "line", number[], string> | null
  >(null);
  const [loading, setLoading] = useState(true);
  const storeId = 1;

  useEffect(() => {
    async function fetchComparisonData() {
      try {
        const response = await fetch(
          `https://jippy.duckdns.org/stock-ml/api/${storeId}/stock/comparison`,
          { cache: "no-store" }
        );
        const json = (await response.json()) as ComparisonResponse;
        const labels = json.data.labels;
        // API에서 받은 전체 데이터 중 최근 30일만 사용하도록 필터링
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 30);

        // 필터링된 인덱스와 라벨을 구합니다.
        const filteredIndices: number[] = [];
        const filteredLabels: string[] = [];
        labels.forEach((dateStr, index) => {
          const dateObj = new Date(dateStr);
          if (dateObj >= cutoff) {
            filteredIndices.push(index);
            filteredLabels.push(dateStr);
          }
        });

        // 각 데이터셋도 인덱스에 따라 필터링합니다.
        const filterData = (data: number[]) =>
          data.filter((_, index) => filteredIndices.includes(index));

        const actualDataset = json.data.datasets.find((ds) => ds.name === "실제 판매량");
        const predictedDataset = json.data.datasets.find((ds) => ds.name === "예측 판매량");

        const data: ChartData<"bar" | "line", number[], string> = {
          labels: filteredLabels,
          datasets: [
            {
              label: "최근 30일 실제 판매량",
              data: actualDataset ? filterData(actualDataset.data) : [],
              type: "bar",
              backgroundColor: "rgba(54, 162, 235, 0.5)",
            },
            {
              label: "최근 30일 예측 판매량",
              data: predictedDataset ? filterData(predictedDataset.data) : [],
              type: "line",
              borderColor: "rgba(255, 99, 132, 1)",
              backgroundColor: "rgba(255, 99, 132, 0.5)",
              fill: false,
              tension: 0.3,
            },
          ],
        };
        setChartData(data);
      } catch (error) {
        console.error("최근 30일 비교 데이터 호출 오류:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchComparisonData();
  }, []);

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "최근 30일 재고 판매 비교",
      },
      legend: {
        position: "bottom" as const,
        labels: {
          boxWidth: 15,
          font: { size: 10 },
          padding: 10,
        },
      },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div>
      {loading ? (
        <p>최근 30일 비교 데이터를 불러오는 중...</p>
      ) : chartData ? (
        <Chart
          type="bar"
          data={chartData as unknown as ChartData<"bar", number[], string>}
          options={options}
        />
      ) : (
        <p>데이터가 없습니다.</p>
      )}
    </div>
  );
};

export default StockComparisonChart;
