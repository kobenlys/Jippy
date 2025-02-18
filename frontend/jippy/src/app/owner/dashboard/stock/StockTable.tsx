"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { StockItem } from "@/redux/slices/stockDashSlice";
import StockRegisterModal from "@/features/dashboard/stock/components/StockRegisterModal";
import StockUpdateModal from "@/features/dashboard/stock/components/StockUpdateModal";
import { Edit2, Trash2 } from "lucide-react";

const StockTable = () => {
  const stockData = useSelector((state: RootState) => state.stock) as StockItem[];

  const formatUnit = (unit: string) => {
    switch (unit.toLowerCase()) {
      case 'l':
        return 'L';
      case 'ml':
        return 'mL';
      default:
        return unit;
    }
  };

  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedStockItem, setSelectedStockItem] = useState<StockItem | null>(null);

  const handleRegisterSuccess = () => {
    window.location.reload();
  };

  const handleUpdateSuccess = () => {
    window.location.reload();
  };

  const deleteStock = async (
    storeId: number, 
    stockName: string, 
    stockUnitSize: string, 
    stockUnit: string
  ) => {
    const payload = {
      inventory: [
        {
          stock: [
            {
              stockUnitSize: Number(stockUnitSize),
              stockUnit
            }
          ]
        }
      ]
    };
  
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/stock/${storeId}/delete/${encodeURIComponent(stockName)}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) throw new Error("삭제 실패");
      alert("재고 삭제 성공");
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("재고 삭제 중 오류 발생");
    }
  };

  return (
    <div>
      <div className="flex gap-1 mb-4">
        <div className="bg-orange-500 text-white px-4 py-1 rounded-full">재고</div>
        <button
          className="bg-gray-100 text-gray-600 px-4 py-1 rounded-full"
          onClick={() => setRegisterModalOpen(true)}
        >
          재고 등록
        </button>
      </div>
      <StockRegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        onSuccess={handleRegisterSuccess}
      />
      <StockUpdateModal
        isOpen={isUpdateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        stockItem={selectedStockItem}
        onSuccess={handleUpdateSuccess}
      />
      <div className="bg-white rounded-lg">
        <div className="overflow-x-auto">
          <div className="max-h-72 overflow-y-auto relative">
            <table className="w-full table-fixed">
              <thead className="bg-orange-50 sticky top-0 z-10">
                <tr className="bg-orange-50">
                  <th className="p-2 text-left border-b w-12">번호</th>
                  <th className="p-2 text-left border-b w-40">재고명</th>
                  <th className="p-2 text-left border-b w-32">용량(단위)</th>
                  <th className="p-2 text-left border-b w-24">수량</th>
                  <th className="p-2 text-left border-b w-32">총량</th>
                  <th className="p-2 text-center border-b w-20">관리</th>
                </tr>
              </thead>
              <tbody>
                {stockData.length > 0 ? (
                  stockData.flatMap((item, itemIndex) =>
                    item.stock.map((unit, unitIndex) => (
                      <tr key={`${itemIndex}-${unitIndex}`} className="hover:bg-gray-50">
                        <td className="p-2 border-b">{itemIndex * item.stock.length + unitIndex + 1}</td>
                        <td className="p-2 border-b">{item.stockName}</td>
                        <td className="p-2 border-b">
                          {unit.stockUnitSize}{formatUnit(unit.stockUnit)}
                        </td>
                        <td className="p-2 border-b">
                          {unit.stockCount}
                        </td>
                        <td className="p-2 border-b">
                          {unit.stockCount * parseFloat(unit.stockUnitSize)}{formatUnit(unit.stockUnit)}
                        </td>
                        <td className="p-2 border-b text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              className="text-blue-500 hover:text-blue-700"
                              onClick={() => {
                                setSelectedStockItem({
                                  ...item,
                                  stock: [unit]
                                });
                                setUpdateModalOpen(true);
                              }}
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              className="text-red-500 hover:text-red-700"
                              onClick={() => {
                                if (!window.confirm(`${item.stockName}의 ${unit.stockUnitSize}${formatUnit(unit.stockUnit)} 단위를 삭제하시겠습니까?`)) return;
                                deleteStock(1, item.stockName, unit.stockUnitSize, unit.stockUnit);
                              }}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-gray-500">
                      재고 데이터가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-orange-50 sticky bottom-0 z-10">
                <tr>
                  <td className="p-2">
                    {stockData.reduce((sum, item) => sum + item.stock.length, 0)}
                  </td>
                  <td colSpan={2} className="p-2 text-right">
                    전체 수량
                  </td>
                  <td className="p-2">
                    {stockData.reduce(
                      (sum, item) =>
                        sum + item.stock.reduce((s, unit) => s + unit.stockCount, 0),
                      0
                    )}
                  </td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockTable;
