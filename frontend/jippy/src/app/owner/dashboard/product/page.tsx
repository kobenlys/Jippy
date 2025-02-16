'use client'

import ProductTable from "./ProductTable";
import ProductChart from "./ProductChart";
import CategoryPieChart from "./CategoryPieChart";
import SeasonPreferenceChart from "./SeasonPreferenceChart";
import { StoreProvider } from "@/redux/StoreProvider";

async function getProductData(storeId: number) {
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

export default async function ProductDashboardPage() {
  const storeId: number = 1;
  const productData = await getProductData(storeId);
  return (
    <StoreProvider preloadedState={productData}>
      <div className="min-h-screen max-w mx-auto p-4 h-screen overflow-y-auto no-scrollbar">
        <div className="bg-white p-4 rounded-lg shadow-md mb-4 border border-gray-200">
      <ProductTable />
        </div>

        {/* 1. 최근 30일 재고별 판매량 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-2">
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <ProductChart storeId={storeId} />
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <CategoryPieChart storeId={storeId} />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 p-2">
          {/* 2. 시즌 선호도 (월별 총 주문량 & 연간 판매 상위 상품) */}
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <SeasonPreferenceChart storeId={storeId} />
          </div>
        </div>
        
      </div>
    </StoreProvider>
  );
}
