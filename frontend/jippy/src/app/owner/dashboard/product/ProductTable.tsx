// app/owner/dashboard/product/ProductTable.tsx
"use client";

import { RootState } from "@/redux/store";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import ProductForm from "@/features/dashboard/product/components/ProductForm";

interface ProductItem {
  id: number;
  storeId: number;
  productCategoryId: number;
  name: string;
  price: number;
  status: boolean;
  image: string;
}

const ProductTable = () => {
  const productData = useSelector(
    (state: RootState) => state.stock
  ) as ProductItem[];
  const [showFormModal, setShowFormModal] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(
    null
  );

  const handleDelete = async (storeId: number, productId: number) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/product/${storeId}/delete/${productId}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText);
        }
        const jsonResponse = await response.json();
        if (jsonResponse.success) {
          alert("상품이 삭제되었습니다.");
          window.location.reload();
        } else {
          alert("상품 삭제에 실패했습니다.");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("상품 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  const openCreateModal = () => {
    setFormMode("create");
    setSelectedProduct(null);
    setShowFormModal(true);
  };

  const openEditModal = (product: ProductItem) => {
    setFormMode("edit");
    setSelectedProduct(product);
    setShowFormModal(true);
  };

  const closeModal = () => {
    setShowFormModal(false);
  };

  return (
    <div className="w-full">
      {/* 상단 탭 및 버튼 영역 */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <div className="bg-orange-500 text-white px-3 py-2 rounded-full text-base">
            상품
          </div>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-gray-100 text-gray-600 px-3 py-2 rounded-full text-base"
        >
          상품 등록
        </button>
      </div>

      {/* 테이블 컨테이너 (최대 높이 300px, 수직 스크롤) */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <div
          className="min-w-full"
          style={{ maxHeight: "300px", overflowY: "auto" }}
        >
          <table className="w-full table-fixed">
            <thead className="bg-orange-50 sticky top-0 z-10">
              <tr>
                <th className="p-2 text-left border-b w-10">번호</th>
                <th className="p-2 text-left border-b w-32">상품명</th>
                <th className="p-2 text-left border-b w-20">가격</th>
                <th className="p-2 text-left border-b w-20">상태</th>
                <th className="p-2 text-left border-b w-28">이미지</th>
                <th className="p-2 text-left border-b w-32">액션</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(productData) && productData.length > 0 ? (
                productData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="p-2 border-b">{index + 1}</td>
                    <td className="p-2 border-b">{item.name}</td>
                    <td className="p-2 border-b">
                      {item.price.toLocaleString()}원
                    </td>
                    <td className="p-2 border-b">
                      {item.status ? "판매중" : "판매중지"}
                    </td>
                    <td className="p-2 border-b">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="p-2 border-b flex gap-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md transition-colors duration-200 text-sm flex items-center justify-center"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(item.storeId, item.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition-colors duration-200 text-sm flex items-center justify-center"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-4 text-gray-500 text-base"
                  >
                    상품 데이터가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot className="bg-orange-50 sticky bottom-0 z-10">
              <tr>
                <td className="p-2">
                  {Array.isArray(productData) ? productData.length : 0}
                </td>
                <td colSpan={2} className="p-2 text-right">
                  총 상품 수
                </td>
                <td className="p-2">
                  {Array.isArray(productData) ? productData.length : 0}
                </td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* 모달: 상품 등록/수정 폼 (최대 너비 600px, 최대 높이 90vh, 내부 스크롤 적용) */}
      {showFormModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 overflow-y-auto">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={closeModal}
          ></div>
          <div className="bg-white p-4 rounded shadow-lg z-10 w-full max-w-[600px] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold" style={{ color: "#F27B39" }}>
                {formMode === "create" ? "상품 등록" : "상품 수정"}
              </h2>
              <button onClick={closeModal} className="text-gray-500 text-2xl">
                &times;
              </button>
            </div>
            <ProductForm
              mode={formMode}
              productData={selectedProduct || undefined}
              onClose={closeModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTable;
