import React from "react";

async function fetchStockData(apiUrl) {
  try {
    const response = await fetch(apiUrl, { cache: "no-store" });
    if (!response.ok) throw new Error("데이터를 불러오는데 실패했습니다.");
    const data = await response.json();
    return data?.data?.inventory || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function StockTable() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL + "/api/stock/1/select";
  const stockData = await fetchStockData(apiUrl);

  return (
    <div className="p-4">
      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <div className="bg-orange-500 text-white px-6 py-2 rounded-full">제고</div>
        <button className="bg-gray-100 text-gray-600 px-6 py-2 rounded-full">제고 등록</button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-lg">
        {stockData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">재고 데이터가 없습니다.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-orange-50">
                  <th className="p-4 text-left border-b align-top">번호</th>
                  <th className="p-4 text-left border-b align-top">재고명</th>
                  <th className="p-4 text-left border-b">용량(단위)</th>
                  <th className="p-4 text-left border-b">수량</th>
                  <th className="p-4 text-left border-b">총량</th>
                </tr>
              </thead>
              <tbody>
                {stockData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-4 border-b align-top">{index + 1}</td>
                    <td className="p-4 border-b align-top">{item.stock_name}</td>
                    <td className="p-4 border-b">
                      {item.stock.map((unit, idx) => (
                        <div key={idx} className="py-1">{unit.stock_unit_size}</div>
                      ))}
                    </td>
                    <td className="p-4 border-b">
                      {item.stock.map((unit, idx) => (
                        <div key={idx} className="py-1">{unit.stock_count}</div>
                      ))}
                    </td>
                    <td className="p-4 border-b">
                      {item.stock.map((unit, idx) => (
                        <div key={idx} className="py-1">
                          {unit.stock_count * parseFloat(unit.stock_unit_size)}
                          {unit.stock_unit}
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-orange-50 font-medium">
                  <td className="p-4">{stockData.length}</td>
                  <td colSpan={2} className="p-4 text-right">전체 수량</td>
                  <td className="p-4">
                    {stockData.reduce((sum, item) => 
                      sum + item.stock.reduce((s, unit) => s + unit.stock_count, 0), 0
                    )}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
