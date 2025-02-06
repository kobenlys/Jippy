'use client';

import { RootState } from "@/redux/store";
import React from "react";
import { useSelector } from "react-redux";

const StockTable = () => {
  const stockData = useSelector((state: RootState) => state.stock);
  console.log(stockData);

  return (
    <div className="p-4">
      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <div className="bg-orange-500 text-white px-6 py-2 rounded-full">제고</div>
        <button className="bg-gray-100 text-gray-600 px-6 py-2 rounded-full">제고 등록</button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-orange-50">
                <th className="p-2 text-left border-b align-top">번호</th>
                <th className="p-2 text-left border-b align-top">재고명</th>
                <th className="p-2 text-left border-b">용량(단위)</th>
                <th className="p-2 text-left border-b">수량</th>
                <th className="p-2 text-left border-b">총량</th>
              </tr>
            </thead>
            <tbody>
              {stockData.length > 0 ? (
                stockData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-2 border-b align-top">{index + 1}</td>
                    <td className="p-2 border-b align-top">{item.stock_name}</td>
                    <td className="p-2 border-b">
                      {item.stock.map((unit, idx) => (
                        <div key={idx} className="py-1">{unit.stock_unit_size}</div>
                      ))}
                    </td>
                    <td className="p-2 border-b">
                      {item.stock.map((unit, idx) => (
                        <div key={idx} className="py-1">{unit.stock_count}</div>
                      ))}
                    </td>
                    <td className="p-2 border-b">
                      {item.stock.map((unit, idx) => (
                        <div key={idx} className="py-1">
                          {unit.stock_count * parseFloat(unit.stock_unit_size)}
                          {unit.stock_unit}
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
            <tfoot>
              <tr className="bg-orange-50 font-medium">
                <td className="p-2">{stockData.length}</td>
                <td colSpan={2} className="p-2 text-right">전체 수량</td>
                <td className="p-2">
                  {stockData.reduce((sum, item) =>
                    sum + item.stock.reduce((s, unit) => s + unit.stock_count, 0), 0
                  )}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StockTable;
