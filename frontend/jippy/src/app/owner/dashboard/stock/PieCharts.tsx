"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const data = {
  labels: ["Red", "Blue", "Yellow"],
  datasets: [
    {
      data: [30, 50, 20], // 값 (퍼센트 아님, 자동 비율 계산)
      backgroundColor: ["#ff6384", "#36a2eb", "#ffce56"], // 색상 지정
      hoverBackgroundColor: ["#ff4364", "#1682cb", "#ffae36"], // 호버 시 색상 변경
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom" as const, // 라벨 위치 (top, bottom, left, right 가능)
    },
  },
};

export default function PieChart() {
  return <Pie data={data} options={options} />;
}
