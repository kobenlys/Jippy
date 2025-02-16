"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchProducts } from "@/redux/slices/productSlice";
import { ProductDetailResponse } from "@/redux/types/product";
import ProductRegistrationModal from "./ProductRegistrationModal";
import ProductOptionModal from "./ProductOptionModal";
import { Plus } from "lucide-react";
import CreateCategory from "./Category";

interface ProductGridProps {
  onProductSelect?: (product: ProductDetailResponse) => void;
  onAddProduct?: (product: ProductDetailResponse) => void;
  showAddButton?: boolean;
}

const ProductGrid = ({
  onProductSelect,
  onAddProduct,
  showAddButton = true,
}: ProductGridProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedProduct, setSelectedProduct] = useState<
    ProductDetailResponse[] | null
  >(null);
  const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | -1>(-1);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const DEFAULT_IMAGE_PATH = "/images/ProductPlaceholder.png";

  const currentShop = useSelector((state: RootState) => state.shop.currentShop);
  const { products, loading, error } = useSelector(
    (state: RootState) => state.product
  );

  useEffect(() => {
    if (currentShop?.id) {
      console.log("상점 ID로 상품 조회:", currentShop.id);
      dispatch(fetchProducts(currentShop.id));
    }
  }, [dispatch, currentShop?.id]);

  const handleCategorySelect = (
    categoryName: string,
    categoryId: number | -1
  ) => {
    console.log("카테고리 선택:", { categoryName, categoryId });
    setSelectedCategory(categoryName);
    setSelectedCategoryId(categoryId);
  };

  // 상품 그룹화 로직
  const groupedProducts = useMemo(() => {
    console.log("상품 그룹화 시작:", products);
    if (!Array.isArray(products)) return [];

    const groups: { [key: string]: ProductDetailResponse[] } = {};

    products.forEach((product) => {
      if (!groups[product.name]) {
        groups[product.name] = [];
      }
      groups[product.name].push(product);
    });

    const result = Object.entries(groups).map(([name, variants]) => ({
      ...variants[0],
      variants: variants,
    }));

    console.log("그룹화된 상품:", result);
    return result;
  }, [products]);

  const handleProductClick = (
    product: ProductDetailResponse & { variants: ProductDetailResponse[] }
  ) => {
    console.group("===== 상품 클릭 테스트 =====");
    console.log("1. 선택된 기본 상품:", {
      id: product.id,
      name: product.name,
      price: product.price,
      type: product.productType,
      size: product.productSize,
    });

    // variants 데이터 구조 확인
    const variantsSummary = product.variants.map((v) => ({
      id: v.id,
      name: v.name,
      price: v.price,
      type: v.productType,
      size: v.productSize,
    }));
    console.log("2. 생성된 variants:", variantsSummary);

    // 옵션이 하나뿐이거나 기본 상품만 있을 경우 바로 추가
    if (product.variants.length === 1) {
      console.log("단일 상품 바로 추가");
      if (onProductSelect) {
        onProductSelect(product.variants[0]);
      }
      if (onAddProduct) {
        onAddProduct(product.variants[0]);
      }
      console.groupEnd();
      return;
    }

    // 옵션이 여러 개인 경우 모달 오픈
    setSelectedProduct(product.variants);
    setIsOptionModalOpen(true);
    console.groupEnd();
  };

  const handleOptionSelect = (selectedOption: ProductDetailResponse) => {
    console.group("옵션 선택");
    console.log("선택된 옵션:", selectedOption);

    if (!selectedOption) {
      console.warn("⚠️ 선택된 옵션이 없습니다.");
      return;
    }

    if (onAddProduct) {
      console.log("📌 onAddProduct 호출");
      onAddProduct(selectedOption); // POSPage에 상품 추가 전달
    }

    setIsOptionModalOpen(false);
    setSelectedProduct(null);
    console.groupEnd();
  };

  if (!currentShop) return <div>매장을 선택해주세요.</div>;
  if (loading)
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-full text-red-500">
        {error}
      </div>
    );

  const filteredProducts =
    selectedCategoryId === -1
      ? groupedProducts
      : groupedProducts.filter(
          (product) => product.productCategoryId === selectedCategoryId
        );

  return (
    <div className="h-full flex flex-col">
      <div className="flex-none bg-white p-4 border-b border-t">
        <div className="px-4">
          <CreateCategory
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-4 gap-4 p-4">
          {filteredProducts.map((item) => (
            <div
              key={item.id}
              onClick={() => handleProductClick(item)}
              className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="relative w-full h-32 bg-gray-200 rounded-lg mb-2">
                <Image
                  src={
                    item.image &&
                    (item.image.startsWith("http") ||
                      item.image.startsWith("/"))
                      ? item.image
                      : DEFAULT_IMAGE_PATH
                  }
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = DEFAULT_IMAGE_PATH;
                  }}
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

          {filteredProducts.length === 0 && (
            <div className="col-span-4 text-center py-8 text-gray-500">
              <p>이 카테고리에 등록된 상품이 없습니다.</p>
            </div>
          )}

          {showAddButton && (
            <div
              onClick={() => setIsRegistrationModalOpen(true)}
              className="bg-white rounded-lg shadow-md p-4 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <Plus className="w-12 h-12 text-gray-500" />
            </div>
          )}
        </div>
      </div>

      {selectedProduct && (
        <ProductOptionModal
          isOpen={isOptionModalOpen}
          onClose={() => {
            console.log("옵션 모달 닫기");
            setIsOptionModalOpen(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
          onSelect={handleOptionSelect}
        />
      )}

      <ProductRegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
      />
    </div>
  );
};

export default ProductGrid;
