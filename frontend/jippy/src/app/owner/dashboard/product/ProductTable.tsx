"use client";

import { RootState } from "@/redux/store";
import React from "react";
import { useSelector } from "react-redux";

// ✅ Define the Product Type
interface ProductItem {
  id: number;
  productCategoryId: number;
  name: string;
  price: number;
  status: boolean;
  image: string;
}

const ProductTable = () => {
  // ✅ Explicitly type `productData`
  const productData = useSelector((state: RootState) => state.stock) as ProductItem[];

  console.log(productData);

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 mb-4">
        <div className="bg-orange-500 text-white px-4 py-1 rounded-full">상품</div>
        <button className="bg-gray-100 text-gray-600 px-4 py-1 rounded-full">상품 등록</button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-lg">
        <div className="overflow-x-auto">
          <div className="max-h-72 overflow-y-auto relative">
            <table className="w-full table-fixed">
              <thead className="bg-orange-50 sticky top-0 z-10">
                <tr className="bg-orange-50">
                  <th className="p-2 text-left border-b w-12">번호</th>
                  <th className="p-2 text-left border-b w-40">상품명</th>
                  <th className="p-2 text-left border-b w-24">가격</th>
                  <th className="p-2 text-left border-b w-24">상태</th>
                  <th className="p-2 text-left border-b w-32">이미지</th>
                </tr>
              </thead>
              <tbody>
                {/* ✅ Ensure `productData` is an array before accessing it */}
                {Array.isArray(productData) && productData.length > 0 ? (
                  productData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-2 border-b">{index + 1}</td>
                      <td className="p-2 border-b">{item.name}</td>
                      <td className="p-2 border-b">{item.price.toLocaleString()}원</td>
                      <td className="p-2 border-b">{item.status ? "판매중" : "판매중지"}</td>
                      <td className="p-2 border-b">
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-500">
                      상품 데이터가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-orange-50 sticky bottom-0 z-10">
                <tr>
                  <td className="p-2">{Array.isArray(productData) ? productData.length : 0}</td>
                  <td colSpan={2} className="p-2 text-right">총 상품 수</td>
                  <td className="p-2">{Array.isArray(productData) ? productData.length : 0}</td>
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

export default ProductTable;
