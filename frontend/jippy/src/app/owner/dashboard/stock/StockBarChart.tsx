"use client";

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const data = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
  datasets: [
    {
      label: 'Current Year',
      type: 'bar',
      backgroundColor: '#FF6B00',
      data: [8000, 7000, 6500, 5000, 5500, 6800, 5200, 4500, 5000, 3000, 4000]
    },
    {
      label: 'Past Year',
      type: 'bar',
      backgroundColor: '#FFC099',
      data: [7800, 6800, 6000, 4800, 5300, 6600, 5000, 4300, 4800, 2900, 3900]
    },
    {
      label: '주문수',
      type: 'line',
      borderColor: '#FF0080',
      backgroundColor: '#FF0080',
      fill: false,
      data: [7500, 6700, 6100, 7200, 8500, 8200, 7700, 6900, 6200, 5000, 5800]
    }
  ]
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top'
    },
    title: {
      display: true,
      text: '주문수 대비 재고 사용량 및 재고 예측량'
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function(value) {
          return `$${value / 1000}K`;
        }
      }
    }
  }
};

export default function InventoryChart() {
  return (
      <div className="h-full p-2">
        <Bar data={data} options={options} />
      </div>
  );
}
