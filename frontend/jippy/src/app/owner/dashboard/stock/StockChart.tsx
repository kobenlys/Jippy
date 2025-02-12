"use client";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData
} from "chart.js";
import { Pie } from "react-chartjs-2";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useState, useEffect } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

// Define TypeScript type for stock item
interface StockItem {
  stockName: string;
  stockTotalValue: number;
}

// Define ChartData Type
type PieChartData = ChartData<"pie", number[], string>;

// HEX to HSL Conversion
const hexToHsl = (hex: string) => {
  const r = parseInt(hex.substring(1, 3), 16) / 255;
  const g = parseInt(hex.substring(3, 5), 16) / 255;
  const b = parseInt(hex.substring(5, 7), 16) / 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
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

// HSL to HEX Conversion
const hslToHex = (h: number, s: number, l: number) => {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
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

// Generate color shades
const generateColorShades = (baseHex: string, count: number) => {
  const baseHSL = hexToHsl(baseHex);
  const minLightness = 40;
  const maxLightness = 80;

  return Array.from({ length: count }, (_, i) => {
    const lightness = minLightness + ((maxLightness - minLightness) / (count - 1)) * i;
    return hslToHex(baseHSL.h, baseHSL.s, lightness);
  });
};

// Convert stockData to Chart.js format
const dataFormatChange = (stockData: StockItem[]): PieChartData => {
  if (!stockData || !Array.isArray(stockData)) {
    return { labels: [], datasets: [{ data: [], backgroundColor: [], hoverBackgroundColor: [] }] };
  }

  const topStocks = [...stockData]
    .sort((a, b) => b.stockTotalValue - a.stockTotalValue)
    .slice(0, 5);

  const labels = topStocks.map(stock => stock.stockName);
  const data = topStocks.map(stock => stock.stockTotalValue);
  const colors = generateColorShades("#FF5C00", labels.length);

  return {
    labels: labels ?? [],
    datasets: [{
      data: data ?? [],
      backgroundColor: colors ?? [],
      hoverBackgroundColor: colors.map(c => hslToHex(hexToHsl(c).h, hexToHsl(c).s, hexToHsl(c).l + 10)) ?? []
    }],
  };
};

const ChartPage = () => {
  const stockData = useSelector((state: RootState) => state.stock);
  const [chartData, setChartData] = useState<PieChartData>({
    labels: [],
    datasets: [{ data: [], backgroundColor: [], hoverBackgroundColor: [] }]
  });
  const [topStockList, setTopStockList] = useState<StockItem[]>([]);

  useEffect(() => {
    if (stockData && Array.isArray(stockData)) {
      const topStocks = [...stockData].sort((a, b) => b.stockTotalValue - a.stockTotalValue).slice(0, 5);
      setTopStockList(topStocks);
      setChartData(dataFormatChange(stockData));
    }
  }, [stockData]);

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "10px", alignItems: "center", marginTop: "20px" }}>
      <div style={{ width: "280px" }}>
        {chartData.labels && chartData.labels.length > 0 ? (
          <Pie data={chartData} options={{ responsive: true, plugins: { legend: { position: "bottom" } } }} />
        ) : (
          <p>데이터를 불러오는 중...</p>
        )}
      </div>

      <div style={{ width: "200px", padding: "10px", border: "1px solid #ddd", borderRadius: "10px" }}>
        <h3 style={{ fontSize: "16px", marginBottom: "10px" }}>재고별 데이터</h3>
        {topStockList.map((stock, index) => (
          <div key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ display: "flex", alignItems: "center" }}>
              {/* ✅ Fix: Ensure `backgroundColor` is an array before indexing */}
              <span 
                style={{ 
                  width: "10px", 
                  height: "10px", 
                  backgroundColor: Array.isArray(chartData.datasets[0]?.backgroundColor)
                    ? chartData.datasets[0]?.backgroundColor[index] || "#CCC"
                    : "#CCC",
                  borderRadius: "50%", 
                  marginRight: "5px" 
                }}
              ></span>
              {stock.stockName}
            </span>
            <span>{stock.stockTotalValue}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartPage;
