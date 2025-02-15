// app/owner/dashboard/product/page.tsx
import ProductTable from "./ProductTable";
import { StoreProvider } from "@/redux/StoreProvider";
import ProductChart from "./ProductChart";

async function getStockData(storeId: number) {
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/product/${storeId}/select`;
  try {
    const response = await fetch(API_URL, { cache: "no-store" });
    if (!response.ok) throw new Error("데이터를 불러오는데 실패했습니다.");
    const data = await response.json();
    return data?.data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function StockPage() {
  const storeId: number = 1;
  const stockData = await getStockData(storeId);
  return (
    <StoreProvider preloadedState={stockData}>
      {/* 최대 1024px, 중앙 정렬, 스크롤바는 숨김 */}
      <div className="max-w-[1024px] mx-auto p-4 h-screen overflow-y-auto no-scrollbar">
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <ProductTable />
        </div>
        <div className="bg-white rounded-lg shadow-md flex flex-col md:flex-row">
          <div className="p-4 w-full md:w-1/2">
            <ProductChart storeId={storeId} />
          </div>
          <div className="p-4 w-full md:w-1/2 flex items-center justify-center">
            {/* 추가 차트 영역 */}
            <div className="w-full text-center text-gray-500">추가 차트 영역</div>
          </div>
        </div>
      </div>
    </StoreProvider>
  );
}
