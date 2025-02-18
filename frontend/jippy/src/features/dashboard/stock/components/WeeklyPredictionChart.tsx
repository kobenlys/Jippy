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

interface WeeklyDataset {
  name: string;
  data: number[];
}

interface WeeklyPredictionStatistics {
  total_predicted: number;
  average_daily: number;
  max_predicted: number;
  min_predicted: number;
}

interface WeeklyPrediction {
  date: string;
  day_of_week: string;
  predicted_quantity: number;
  confidence_interval: number;
  features_used: {
    year: number;
    month: number;
    day: number;
    dayofweek: number;
    season: number;
  };
}

interface WeeklyPredictionResponse {
  status: string;
  message: string;
  data: {
    labels: string[];
    datasets: WeeklyDataset[];
    statistics: WeeklyPredictionStatistics;
    predictions: WeeklyPrediction[];
  };
}

const WeeklyPredictionChart = () => {
  const [chartData, setChartData] = useState<ChartData<"bar" | "line", number[], string> | null>(null);
  const [loading, setLoading] = useState(true);
  const storeId = 1;

  useEffect(() => {
    async function fetchWeeklyPrediction() {
      try {
        const response = await fetch(
          `https://jippy.duckdns.org/stock-ml/api/${storeId}/predictions/weekly`,
          { cache: "no-store" }
        );
        const json = (await response.json()) as WeeklyPredictionResponse;
        const labels = json.data.labels;
        const predDataset = json.data.datasets.find((ds) => ds.name === "예측 판매량");
        const upperDataset = json.data.datasets.find((ds) => ds.name === "신뢰구간 상한");
        const lowerDataset = json.data.datasets.find((ds) => ds.name === "신뢰구간 하한");

        const data: ChartData<"bar" | "line", number[], string> = {
          labels,
          datasets: [
            {
              label: "예측 판매량",
              data: predDataset ? predDataset.data : [],
              type: "line",
              borderColor: "rgba(255, 99, 132, 1)",
              backgroundColor: "rgba(255, 99, 132, 0.5)",
              fill: false,
              tension: 0.3,
            },
            {
              label: "신뢰구간 상한",
              data: upperDataset ? upperDataset.data : [],
              type: "line",
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.5)",
              borderDash: [5, 5],
              fill: false,
              tension: 0.3,
            },
            {
              label: "신뢰구간 하한",
              data: lowerDataset ? lowerDataset.data : [],
              type: "line",
              borderColor: "rgba(153, 102, 255, 1)",
              backgroundColor: "rgba(153, 102, 255, 0.5)",
              borderDash: [5, 5],
              fill: false,
              tension: 0.3,
            },
          ],
        };
        setChartData(data);
      } catch (error) {
        console.error("주간 예측 데이터 호출 오류:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchWeeklyPrediction();
  }, []);

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "1주일 재고 판매 예측",
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
        <p>1주일 예측 데이터를 불러오는 중...</p>
      ) : chartData ? (
        <Chart type="bar" data={chartData as unknown as ChartData<"bar", number[], string>} options={options} />
      ) : (
        <p>데이터가 없습니다.</p>
      )}
    </div>
  );
};

export default WeeklyPredictionChart;
