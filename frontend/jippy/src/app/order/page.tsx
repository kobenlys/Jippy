"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchProducts } from "@/redux/slices/productSlice";
import CreateCategory from "@/features/order/components/Category";
import Image from "next/image";
import { ProductDetailResponse, ProductType } from "@/features/product/types";
import Button from "@/features/common/components/ui/button/Button";
import { Plus } from "lucide-react";
import ProductRegistrationModal from "@/features/order/components/ProductRegistrationModal";

interface OrderItem {
  menuItem: ProductDetailResponse;
  quantity: number;
}

const POSOrderPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentShop = useSelector((state: RootState) => state.shop.currentShop);
  const { loading, error } = useSelector((state: RootState) => state.product);
  const products = useSelector((state: RootState) => {
    const productsState = state.product.products;
    return Array.isArray(productsState) 
      ? productsState 
      : (productsState as { data: ProductDetailResponse[] }).data || [];
  });
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  
  const DEFAULT_IMAGE_PATH = "/images/ProductPlaceholder.png";

  // 이미지 URL 유효성 검사 함수
  const getValidImageUrl = (url: string): string => {
    if (!url) return DEFAULT_IMAGE_PATH;
    return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/") 
      ? url 
      : DEFAULT_IMAGE_PATH;
  };

  useEffect(() => {
    if (currentShop?.id) {
      dispatch(fetchProducts(currentShop.id));
    }
  }, [dispatch, currentShop?.id]);

  const productList = products && Array.isArray(products)
  ? products.map(product => ({
      ...product,
      storeId: currentShop?.id || 0,
      productType: Number(product.productType) as ProductType,
    })) 
  : [];
  
  const filteredProducts = selectedCategory === "전체"
    ? productList
    : productList.filter((item) => item.productCategoryId.toString() === selectedCategory);

  const addToOrder = (menuItem: ProductDetailResponse) => {
    // storeId가 현재 shop의 id와 같다고 가정
    const itemWithStore = {
      ...menuItem,
      storeId: currentShop?.id || 0
    };
    
    setOrderItems((prev) => {
      const existingItem = prev.find(
        (item) => item.menuItem.id === itemWithStore.id
      );
      if (existingItem) {
        return prev.map((item) =>
          item.menuItem.id === itemWithStore.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { menuItem: itemWithStore, quantity: 1 }];
    });
  };

  const removeFromOrder = (menuItem: ProductDetailResponse) => {
    setOrderItems((prev) =>
      prev.filter((item) => item.menuItem.id !== menuItem.id)
    );
  };

  const updateQuantity = (menuItem: ProductDetailResponse, quantity: number) => {
    if (quantity <= 0) {
      removeFromOrder(menuItem);
      return;
    }

    setOrderItems((prev) =>
      prev.map((item) =>
        item.menuItem.id === menuItem.id ? { ...item, quantity } : item
      )
    );
  };

  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );

  if (!currentShop) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">매장을 선택해주세요.</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen max-h-screen overflow-hidden">
      {/* 메뉴 영역 */}
      <div className="flex-1 flex flex-col h-full">
        {/* 카테고리 영역 */}
        <div className="p-3 w-full bg-white sticky top-0 border-b border-gray-200">
          <div className="px-4">
            <CreateCategory
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
            />
          </div>
        </div>

        {/* 메뉴 그리드 영역 */}
        <div className="flex-1 overflow-auto m-4">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-full text-red-500">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4 p-4 mb-8">
              {filteredProducts.length === 0 ? (
                <div className="col-span-4 text-center py-8 text-gray-500">
                  표시할 상품이 없습니다.
                </div>
              ) : (
                <>
                  {filteredProducts.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => item.status && addToOrder(item)}
                      className={`bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow ${
                        !item.status && "opacity-50"
                      }`}
                    >
                      <div className="relative w-full h-32 bg-gray-200 rounded-lg mb-2">
                        <Image
                          src={getValidImageUrl(item.image)}
                          alt={item.name}
                          fill
                          className="object-cover rounded-lg"
                          onError={(e) => {
                            const imgElement = e.target as HTMLImageElement;
                            if (imgElement.src !== DEFAULT_IMAGE_PATH) {
                              imgElement.src = DEFAULT_IMAGE_PATH;
                            }
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

                  {/* 상품 추가 버튼 추가 */}
                  <div 
                    onClick={() => setIsRegistrationModalOpen(true)}
                    className="bg-white rounded-lg shadow-md p-4 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-12 h-12 text-gray-500" />
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 주문 영역 */}
      <div className="w-[420px] bg-gray-100 flex flex-col h-full">
        {/* 주문 내역 헤더 */}
        <div className="p-6 bg-white border-b border-gray-200 w-full sticky top-0">
          <h2 className="text-xl font-bold">주문 내역</h2>
        </div>
        
        {/* 주문 목록 - 스크롤 가능 영역 */}
        <div className="flex-1 overflow-auto p-4">
          {orderItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              주문 내역이 없습니다.
            </div>
          ) : (
            orderItems.map((item) => (
              <div
                key={item.menuItem.id}
                className="bg-white p-4 rounded-lg mb-2 shadow-sm"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">{item.menuItem.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromOrder(item.menuItem);
                    }}
                    className="text-red-500 hover:text-red-600"
                  >
                    삭제
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateQuantity(item.menuItem, item.quantity - 1);
                      }}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateQuantity(item.menuItem, item.quantity + 1);
                      }}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                  <span>
                    {(item.menuItem.price * item.quantity).toLocaleString()}원
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 결제 영역 - 고정 높이 */}
        <div className="min-h-[320px] border-t border-gray-200 p-8 bg-white rounded-xl">
          {/* 총 금액 표시 */}
          <div className="mb-4">
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-800 text-xl">총 금액</span>
              <span className="font-bold text-3xl text-gray-800">
                {totalAmount.toLocaleString()}원
              </span>
            </div>
          </div>

          {/* 결제 버튼 */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <button className="w-full py-6 bg-gray-500 text-white text-xl font-medium rounded-lg hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50">
              현금
            </button>
            <button className="w-full py-6 bg-pink-500 text-white text-xl font-medium rounded-lg hover:bg-pink-600 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50">
              QR
            </button>
          </div>

          <div className="mb-8">
            <Button variant="brownSquare" className="w-full">결제하기</Button>
          </div>
        </div>
      </div>
      {/* 상품 등록 모달 */}
      <ProductRegistrationModal 
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
      />
    </div>
  );
};

export default POSOrderPage;