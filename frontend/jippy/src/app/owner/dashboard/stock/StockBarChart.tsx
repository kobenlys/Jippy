"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { StockItem } from "@/redux/slices/stockDashSlice";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StockBarChart = () => {
  const stockData = useSelector((state: RootState) => state.stock) as StockItem[];

  // 모든 재고 항목을 재고 총량 기준 내림차순 정렬
  const sortedStocks = [...stockData].sort((a, b) => b.stockTotalValue - a.stockTotalValue);

  const labels = sortedStocks.map((stock) => stock.stockName);
  const dataValues = sortedStocks.map((stock) => stock.stockTotalValue);

  const data: ChartData<"bar", number[], string> = {
    labels,
    datasets: [
      {
        label: "재고 총량",
        data: dataValues,
        backgroundColor: "rgba(255, 107, 0, 0.6)",
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "재고별 데이터 (전체 품목)",
      },
      legend: { position: "bottom" },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  // key를 data.labels 기반으로 지정하여 데이터 변경 시 컴포넌트 재생성 (legend 갱신)
  return (
    <div className="p-4">
      <Bar key={labels.join("-")} data={data} options={options} />
    </div>
  );
};

export default StockBarChart;
