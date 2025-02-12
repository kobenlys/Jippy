"use client";

import { RootState } from "@/redux/store";
import React from "react";
import { useSelector } from "react-redux";

// ✅ Define the Stock Type
interface StockUnit {
  stockUnitSize: string;
  stockUnit: string;
  stockCount: number;
}

interface StockItem {
  stockName: string;
  stock: StockUnit[];
}

const StockTable = () => {
  // ✅ Explicitly type `stockData`
  const stockData = useSelector((state: RootState) => state.stock) as StockItem[];

  console.log(stockData);

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 mb-4">
        <div className="bg-orange-500 text-white px-4 py-1 rounded-full">재고</div>
        <button className="bg-gray-100 text-gray-600 px-4 py-1 rounded-full">재고 등록</button>
      </div>

      {/* Table Container */}
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
                </tr>
              </thead>
              <tbody>
                {/* ✅ Ensure `stockData` is an array before accessing it */}
                {Array.isArray(stockData) && stockData.length > 0 ? (
                  stockData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-2 border-b">{index + 1}</td>
                      <td className="p-2 border-b">{item.stockName}</td>
                      <td className="p-2 border-b">
                        {item.stock.map((unit, idx) => (
                          <div key={idx} className="py-1">{unit.stockUnitSize}{unit.stockUnit}</div>
                        ))}
                      </td>
                      <td className="p-2 border-b">
                        {item.stock.map((unit, idx) => (
                          <div key={idx} className="py-1">{unit.stockCount}</div>
                        ))}
                      </td>
                      <td className="p-2 border-b">
                        {item.stock.map((unit, idx) => (
                          <div key={idx} className="py-1">
                            {unit.stockCount * parseFloat(unit.stockUnitSize)}
                            {unit.stockUnit}
                          </div>
                        ))}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-500">
                      재고 데이터가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-orange-50 sticky bottom-0 z-10">
                <tr>
                  <td className="p-2">{Array.isArray(stockData) ? stockData.length : 0}</td>
                  <td colSpan={2} className="p-2 text-right">전체 수량</td>
                  <td className="p-2">
                    {Array.isArray(stockData)
                      ? stockData.reduce((sum, item) =>
                          sum + item.stock.reduce((s, unit) => s + unit.stockCount, 0), 0
                        )
                      : 0}
                  </td>
                  <td></td>
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
