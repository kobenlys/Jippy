"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useState, useEffect } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

// HEX 색상을 HSL로 변환하는 함수
const hexToHsl = (hex: string) => {
  let r = parseInt(hex.substring(1, 3), 16) / 255;
  let g = parseInt(hex.substring(3, 5), 16) / 255;
  let b = parseInt(hex.substring(5, 7), 16) / 255;

  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
};

// HSL 색상을 HEX로 변환하는 함수
const hslToHex = (h: number, s: number, l: number) => {
  s /= 100;
  l /= 100;
  let c = (1 - Math.abs(2 * l - 1)) * s;
  let x = c * (1 - Math.abs((h / 60) % 2 - 1));
  let m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
  else if (h >= 60 && h < 120) { r = x; g = c; b = 0; }
  else if (h >= 120 && h < 180) { r = 0; g = c; b = x; }
  else if (h >= 180 && h < 240) { r = 0; g = x; b = c; }
  else if (h >= 240 && h < 300) { r = x; g = 0; b = c; }
  else if (h >= 300 && h < 360) { r = c; g = 0; b = x; }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};

// 데이터 개수에 맞춰 밝기를 조절하여 색상을 생성하는 함수
const generateColorShades = (baseHex: string, count: number) => {
  const baseHSL = hexToHsl(baseHex);
  const minLightness = 40;
  const maxLightness = 80;

  return Array.from({ length: count }, (_, i) => {
    const lightness = minLightness + ((maxLightness - minLightness) / (count - 1)) * i;
    return hslToHex(baseHSL.h, baseHSL.s, lightness);
  });
};

// stockData를 Chart.js에서 사용할 데이터 형식으로 변환하는 함수
const dataFormatChange = (stockData: any) => {
  if (!stockData || !Array.isArray(stockData)) {
    return { labels: [], datasets: [{ data: [], backgroundColor: [], hoverBackgroundColor: [] }] };
  }

  // 상위 5개만 선택하여 차트 데이터 생성
  const topStocks = [...stockData]
    .sort((a, b) => b.stock_total_value - a.stock_total_value)
    .slice(0, 5);

  const labels = topStocks.map(stock => stock.stock_name);
  const data = topStocks.map(stock => stock.stock_total_value);
  const colors = generateColorShades("#FF5C00", labels.length);

  return {
    labels,
    datasets: [{ data, backgroundColor: colors, hoverBackgroundColor: colors.map(c => hslToHex(hexToHsl(c).h, hexToHsl(c).s, hexToHsl(c).l + 10)) }],
  };
};

const ChartPage = () => {
  const stockData = useSelector((state: RootState) => state.stock);
  const [chartData, setChartData] = useState({ labels: [], datasets: [{ data: [], backgroundColor: [], hoverBackgroundColor: [] }] });
  const [topStockList, setTopStockList] = useState<any[]>([]);

  useEffect(() => {
    if (stockData && Array.isArray(stockData)) {
      const topStocks = [...stockData].sort((a, b) => b.stock_total_value - a.stock_total_value).slice(0, 5);
      setTopStockList(topStocks);
      setChartData(dataFormatChange(stockData));
    }
  }, [stockData]);

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "20px", alignItems: "center", marginTop: "20px" }}>
      <div style={{ width: "300px" }}>
        {chartData.labels.length > 0 ? <Pie data={chartData} options={{ responsive: true, plugins: { legend: { position: "bottom" } } }} /> : <p>데이터를 불러오는 중...</p>}
      </div>

      <div style={{ width: "300px", padding: "10px", border: "1px solid #ddd", borderRadius: "10px" }}>
        <h3 style={{ fontSize: "16px", marginBottom: "10px" }}>재고별 데이터</h3>
        {topStockList.map((stock, index) => (
          <div key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ display: "flex", alignItems: "center" }}>
              <span style={{ width: "10px", height: "10px", backgroundColor: chartData.datasets[0].backgroundColor[index], borderRadius: "50%", marginRight: "5px" }}></span>
              {stock.stock_name}
            </span>
            <span>{stock.stock_total_value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartPage;
