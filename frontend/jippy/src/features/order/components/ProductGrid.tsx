"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchProducts } from "@/redux/slices/productSlice";
import { ProductDetailResponse } from "@/features/product/types";

interface ProductGridProps {
  onProductSelect?: (product: ProductDetailResponse) => void;
}

export default function ProductGrid({ onProductSelect }: ProductGridProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error } = useSelector((state: RootState) => state.product);
  const currentShop = useSelector((state: RootState) => state.shop.currentShop);
  
  const DEFAULT_IMAGE_PATH = "/images/PlaceHolder.png";

  useEffect(() => {
    // currentShop이 변경될 때마다 해당 매장의 상품을 불러옴
    if (currentShop?.id) {
      dispatch(fetchProducts(currentShop.id));
    }
  }, [dispatch, currentShop?.id]); // currentShop.id가 변경될 때마다 실행

  if (!currentShop) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-gray-500">매장을 선택해주세요.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full text-red-500">
        {error}
      </div>
    );
  }

  // 현재 매장의 상품만 표시
  const filteredProducts = products.filter(
    product => product.storeId === currentShop.id
  );

  return (
    <div className="grid grid-cols-4 gap-4 p-4 mb-8">
      {filteredProducts.length === 0 ? (
        <div className="col-span-4 text-center py-8 text-gray-500">
          등록된 상품이 없습니다.
        </div>
      ) : (
        filteredProducts.map((product) => (
          <div
            key={product.id}
            onClick={() => onProductSelect?.(product)}
            className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="relative w-full h-32 bg-gray-200 rounded-lg mb-2">
              <Image
                src={product.image ? `data:image/jpeg;base64,${product.image}` : DEFAULT_IMAGE_PATH}
                alt={product.name}
                fill
                className="object-cover rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = DEFAULT_IMAGE_PATH;
                }}
              />
            </div>
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-gray-600">{product.price.toLocaleString()}원</p>
            {!product.status && (
              <span className="inline-block mt-2 px-2 py-1 text-sm bg-red-100 text-red-800 rounded">
                품절
              </span>
            )}
          </div>
        ))
      )}
    </div>
  );
}