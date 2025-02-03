import Navigation from "@/components/Navigation";
import StockTable from "./StockTable";

export default function StockPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="bg-white p-4 rounded-lg shadow-md">
        <StockTable />
      </div>
    </div>
  );
}
