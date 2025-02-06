import Navigation from "@/components/Navigation";
import StockTable from "./StockTable";
import { StoreProvider } from "@/redux/StoreProvider";

async function getStockData(storeId: string) {
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/stock/${storeId}/select`;

  try {
    const response = await fetch(API_URL, { cache: "no-store" });
    console.log(response);
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
  console.log(stockData);
  return (
    <StoreProvider  preloadedState={stockData}>
      <div className="min-h-screen">
        <Navigation />
        <div className="bg-white p-4 rounded-lg shadow-md">
          <StockTable />
        </div>
      </div>
    </StoreProvider >
  );


}
