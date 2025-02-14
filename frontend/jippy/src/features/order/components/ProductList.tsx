// components/ProductList.tsx
"use client";

import Image from "next/image";
import { ProductDetailResponse } from "@/redux/types/product";
import { Plus } from "lucide-react";

interface ProductListProps {
    products: ProductDetailResponse[];
    onProductClick?: (product: ProductDetailResponse) => void;
    showAddButton?: boolean;
    onAddProduct?: () => void;
    gridClassName?: string; // 그리드 클래스를 외부에서 주입
  }
  
const ProductList = ({ 
    products, 
    onProductClick, 
    showAddButton = true, 
    onAddProduct,
    gridClassName = "grid grid-cols-4 gap-4 p-4 mb-8" // 기본값 유지
  }: ProductListProps) => {
    const DEFAULT_IMAGE_PATH = "/images/ProductPlaceholder.png";
  
    return (
        <div className={gridClassName}>
            {products.map((item) => (
                <div
                key={item.id}
                onClick={() => onProductClick && onProductClick(item)}
                className={`bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow ${
                    !item.status && "opacity-50"
                }`}
                >
                <div className="relative w-full h-32 bg-gray-200 rounded-lg mb-2">
                    <Image 
                    src={item.image || DEFAULT_IMAGE_PATH}
                    alt={item.name}
                    width={500} 
                    height={500}
                    className="object-cover rounded-lg"
                    />
                </div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-600">{item.price.toLocaleString()}원</p>
                {!item.status && (
                    <span className="inline-block mt-2 px-2 py-1 text-sm bg-red-100 text-red-800 rounded">
                    품절
                    </span>
                )}
                </div>
            ))}

            {products.length === 0 && (
                <div className="col-span-4 text-center py-8 text-gray-500">
                <p>이 카테고리에 등록된 상품이 없습니다.</p>
                </div>
            )}

            {showAddButton && (
                <div 
                onClick={onAddProduct}
                className="bg-white rounded-lg shadow-md p-4 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                >
                <Plus className="w-12 h-12 text-gray-500" />
                </div>
            )}
        </div>
    );
};

export default ProductList;