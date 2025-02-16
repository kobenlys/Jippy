export const dynamic = "force-dynamic";

// app/owner/dashboard/product/page.tsx
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
      {/* 서버 컴포넌트로 작성 – "use client" 제거 */}
      <div className="max-w mx-auto p-4 pb-20 h-screen overflow-y-auto no-scrollbar">
        {/* 상품 테이블 카드 */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-4 border border-gray-200">
          <ProductTable />
        </div>

        {/* 2열 그리드: ProductChart와 CategoryPieChart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <ProductChart storeId={Number(storeId)} />
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <CategoryPieChart storeId={storeId} />
          </div>
        </div>

        {/* SeasonPreferenceChart 카드 */}
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <SeasonPreferenceChart storeId={Number(storeId)} />
        </div>
      </div>
    </StoreProvider>
  );
}
