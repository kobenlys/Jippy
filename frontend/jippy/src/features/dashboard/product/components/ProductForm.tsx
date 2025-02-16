// @/features/dashboard/product/components/ProductForm.tsx
"use client";
import React, { useState, ChangeEvent } from "react";
import RecipeForm from "./RecipeForm";

interface ProductItem {
  id: number;
  storeId: number;
  productCategoryId: number;
  name: string;
  price: number;
  status: boolean;
  image: string;
  productType?: "ICE" | "HOT" | "EXTRA";
  productSize?: "S" | "M" | "L" | "F";
  totalSold?: number;
}

interface ProductFormProps {
  mode: "create" | "edit";
  productData?: ProductItem;
  onClose: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ mode, productData, onClose }) => {
  const [product, setProduct] = useState<ProductItem>({
    id: productData?.id || 0,
    storeId: productData?.storeId || 1, // 기본 storeId 1
    productCategoryId: productData?.productCategoryId || 0,
    name: productData?.name || "",
    price: productData?.price || 0,
    status: productData?.status ?? true,
    image: productData?.image || "",
    productType: productData?.productType || "ICE",
    productSize: productData?.productSize || "S",
    totalSold: productData?.totalSold || 0,
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [createdProductId, setCreatedProductId] = useState<number | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      // 미리보기용 URL 생성
      const previewUrl = URL.createObjectURL(file);
      setProduct({ ...product, image: previewUrl });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const storeId = product.storeId.toString();
    const url =
      mode === "create"
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/product/${storeId}/create`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/product/${storeId}/update/${product.id}`;
    
    const formData = new FormData();
    // 생성 모드와 수정 모드에 따라 JSON 데이터를 key 이름을 다르게 보냅니다.
    if (mode === "create") {
      formData.append(
        "createProduct",
        new Blob(
          [
            JSON.stringify({
              productCategoryId: product.productCategoryId,
              storeId: product.storeId,
              name: product.name,
              price: product.price,
              status: product.status,
              productType: product.productType,
              productSize: product.productSize,
            }),
          ],
          { type: "application/json" }
        )
      );
    } else {
      formData.append(
        "productUpdateRequest",
        new Blob(
          [
            JSON.stringify({
              productCategoryId: product.productCategoryId,
              name: product.name,
              price: product.price,
              status: product.status,
              productType: product.productType,
              productSize: product.productSize,
            }),
          ],
          { type: "application/json" }
        )
      );
    }
    
    // 이미지 파일이 있다면 FormData에 추가
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        body: formData,
      });
      const jsonResponse = await response.json();
      if (jsonResponse.success) {
        if (mode === "create") {
          alert("상품이 등록되었습니다.");
          // 새로 생성된 상품의 id가 반환되었다고 가정
          setCreatedProductId(jsonResponse.data.id);
          setProduct((prev) => ({ ...prev, id: jsonResponse.data.id }));
          // 모달은 닫지 않고 레시피 등록 폼을 보여줍니다.
        } else {
          alert("상품이 수정되었습니다.");
          onClose();
          window.location.reload();
        }
      } else {
        alert("상품 등록/수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <>
      {/* 상품 등록/수정 폼 */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">상품명</label>
          <input
            type="text"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">가격</label>
          <input
            type="number"
            value={product.price}
            onChange={(e) =>
              setProduct({ ...product, price: parseInt(e.target.value) })
            }
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">상품 타입</label>
          <select
            value={product.productType}
            onChange={(e) =>
              setProduct({
                ...product,
                productType: e.target.value as "ICE" | "HOT" | "EXTRA",
              })
            }
            className="w-full border p-2 rounded"
          >
            <option value="ICE">ICE</option>
            <option value="HOT">HOT</option>
            <option value="EXTRA">EXTRA</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">상품 사이즈</label>
          <select
            value={product.productSize}
            onChange={(e) =>
              setProduct({
                ...product,
                productSize: e.target.value as "S" | "M" | "L" | "F",
              })
            }
            className="w-full border p-2 rounded"
          >
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="F">F</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">카테고리 ID</label>
          <input
            type="number"
            value={product.productCategoryId}
            onChange={(e) =>
              setProduct({
                ...product,
                productCategoryId: parseInt(e.target.value),
              })
            }
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">상품 이미지 첨부</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
            required={mode === "create"}
          />
          {imageFile && (
            <div className="mt-2">
              <img
                src={product.image}
                alt="미리보기"
                className="max-h-40 object-contain border"
              />
            </div>
          )}
        </div>
        <div className="flex items-center">
          <label className="mr-2">판매 상태</label>
          <input
            type="checkbox"
            checked={product.status}
            onChange={(e) =>
              setProduct({ ...product, status: e.target.checked })
            }
          />
        </div>
        <button
          type="submit"
          className="bg-[#F27B39] text-white px-4 py-2 rounded"
        >
          {mode === "create" ? "등록" : "수정"}
        </button>
      </form>

      {/* 상품 등록 후 또는 수정 시 레시피 등록/수정 폼 */}
      {((mode === "edit") || (mode === "create" && createdProductId)) && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">레시피 등록/수정</h3>
          <RecipeForm
            productId={mode === "create" ? createdProductId! : product.id}
            mode={mode}
          />
        </div>
      )}
    </>
  );
};

export default ProductForm;
