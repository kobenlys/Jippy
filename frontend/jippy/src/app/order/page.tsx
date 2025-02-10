"use client";

import { useState } from "react";
import CreateCategory from "@/features/order/components/category";

interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
}

interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
}

const POSOrderPage = () => {
  const DEFAULT_IMAGE_PATH = "/images/PlaceHolder.png";

  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const menuItems: MenuItem[] = [
    {
      id: 1,
      name: "카페라떼 (HOT)",
      price: 4500,
      category: "커피",
      image: DEFAULT_IMAGE_PATH,
    },
    // Add more menu items here
  ];

  const addToOrder = (menuItem: MenuItem) => {
    setOrderItems((prev) => {
      const existingItem = prev.find(
        (item) => item.menuItem.id === menuItem.id
      );
      if (existingItem) {
        return prev.map((item) =>
          item.menuItem.id === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { menuItem, quantity: 1 }];
    });
  };

  const removeFromOrder = (menuItem: MenuItem) => {
    setOrderItems((prev) =>
      prev.filter((item) => item.menuItem.id !== menuItem.id)
    );
  };

  const updateQuantity = (menuItem: MenuItem, quantity: number) => {
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

  const filteredMenuItems =
    selectedCategory === "전체"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );

  return (
    <div className="flex h-screen">
      {/* 메뉴 영역 */}
      <div className="flex-1 flex flex-col">
        {/* 카테고리 영역 - 상단 고정 */}
        <div className="w-full sticky top-0">
          <CreateCategory
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
        </div>

        {/* 메뉴 그리드 영역 - 스크롤 가능 */}
        <div className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-3 gap-4">
            {filteredMenuItems.map((item) => (
              <div
                key={item.id}
                onClick={() => addToOrder(item)}
                className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="w-full h-32 bg-gray-200 rounded-lg mb-2" />
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-600">{item.price.toLocaleString()}원</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 주문 영역 */}
      <div className="w-96 bg-gray-100 p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-4">주문 내역</h2>

        {/* 주문 목록 */}
        <div className="flex-1 overflow-auto">
          {orderItems.map((item) => (
            <div
              key={item.menuItem.id}
              className="bg-white p-4 rounded-lg mb-2"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">{item.menuItem.name}</span>
                <button
                  onClick={() => removeFromOrder(item.menuItem)}
                  className="text-red-500"
                >
                  삭제
                </button>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.menuItem, item.quantity - 1)
                    }
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.menuItem, item.quantity + 1)
                    }
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    +
                  </button>
                </div>
                <span>
                  {(item.menuItem.price * item.quantity).toLocaleString()}원
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 총액 및 결제 버튼 */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold">총 금액</span>
            <span className="font-bold text-xl">
              {totalAmount.toLocaleString()}원
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button className="w-full py-3 bg-gray-500 text-white rounded-lg">
              현금
            </button>
            <button className="w-full py-3 bg-pink-500 text-white rounded-lg">
              QR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSOrderPage;
