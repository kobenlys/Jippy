"use client";

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { GetServerSideProps } from "next";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ChartProps {
  labels: string[];
  data: number[];
}

async function fetchStockData(apiUrl) {
    try {
      const response = await fetch(apiUrl, { cache: "no-store" });
      if (!response.ok) throw new Error("데이터를 불러오는데 실패했습니다.");
      const data = await response.json();
      return data?.data?.inventory || [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async function dataFormatChange(responseData) {
    let labels = [];
    let data = [];

    try {
        responseData.array.forEach(stock => { 
            labels.push(stock.stock_name);
            data.push(stock.stock_total_value);
        });
      return {
        props: {
            labels: labels,
            data: data,
          },
      };
    } catch (error) {
      console.error(error);
      return  {
        props: {
        labels: [],
        data: [],
      },
    };
  }
}


export const getServerSideProps: GetServerSideProps = async () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL + "/api/stock/1/select";
  const responseData = await fetchStockData(apiUrl);
  const chartData = dataFormatChange(responseData);
  return {
    props: {
      labels: chartData.labels,
      data: chartData.data,
    },
  };
};

const ChartPage = ({ labels, data }: ChartProps) => {
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: "SSR Bar Chart Example" },
    },
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: "Sales",
        data,
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };

  return (
    <div style={{ width: "600px", margin: "0 auto" }}>
      <h1>Server-Side Rendered Chart</h1>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default ChartPage;
