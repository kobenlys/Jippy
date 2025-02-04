import Navigation from "@/components/Navigation";
import StockTable from "./StockTable";
import StockChart from "./StockChart";

export default function StockPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="bg-white p-4 rounded-lg shadow-md">
        <StockTable />
      </div>
      <div>
        <StockChart />
      </div>
    </div>
  );
}
