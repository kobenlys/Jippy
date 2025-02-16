export const dynamic = "force-dynamic";

import StockTable from "./StockTable";
import StockBarChart from "./StockBarChart"; // 혼합형 바/라인 차트
import WeeklyPredictionChart from "@/features/dashboard/stock/components/WeeklyPredictionChart";
import StockComparisonChart from "@/features/dashboard/stock/components/StockComparisonChart";
import LowStockChart from "./LowStockChart"; // 새로 만든 저재고 수평 바 차트
import { StoreProvider } from "@/redux/StoreProvider";

async function getStockData(storeId: string) {
  // 재고 조회 API 호출 예시
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/stock/${storeId}/select`;
  try {
    const response = await fetch(API_URL, { cache: "no-store" });
    if (!response.ok) throw new Error("데이터를 불러오는데 실패했습니다.");
    const data = await response.json();
    return data?.data?.inventory || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function StockPage() {
  const storeId: string = "1";
  const stockData = await getStockData(storeId);
  return (
    <StoreProvider preloadedState={stockData}>
      <div className="min-h-screen">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <StockTable />
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 mt-4 flex gap-4">
          <div className="w-1/2">
            <h2 className="text-xl font-bold mb-2">재고 데이터</h2>
            <StockBarChart />
          </div>
          <div className="w-1/2">
            <h2 className="text-xl font-bold mb-2">주간 재고 변화 예측</h2>
            <WeeklyPredictionChart  />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 mt-4 flex gap-4">
          <div className="w-1/2">
            <h2 className="text-xl font-bold mb-2">최근 30일 재고 그래프</h2>
            <StockComparisonChart  />
          </div>
          <div className="w-1/2">
            <h2 className="text-xl font-bold mb-2">재고 부족 현황</h2>
            <LowStockChart />
          </div>
        </div>
      </div>
    </StoreProvider>
  );
}
