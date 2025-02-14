import StockTable from "./StockTable";
import StockChart from "./StockChart";
import { StoreProvider } from "@/redux/StoreProvider";
import StockBarChart from "./StockBarChart";

async function getStockData(storeId: string) {
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/stock/${storeId}/select`;
  console.log(API_URL);

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
    <StoreProvider preloadedState={stockData}>
      <div className="min-h-screen">
        <div className="bg-white pt-0 p-4 rounded-lg shadow-md">
          <StockTable />
        </div>
        <div className="bg-white rounded-lg shadow-md flex ">
          <div className="p-4 w-1/2">
            <StockChart />
          </div>
          <div className="p-4 w-1/2">
            <StockBarChart />
          </div>
          {/* <PieChart /> */}
        </div>
      </div>
    </StoreProvider>
  );
}
