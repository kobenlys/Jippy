"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import ProductGrid from "@/features/order/components/ProductGrid";
import { Card } from "@/features/common/components/ui/card/Card";
import { Button } from "@/features/common/components/ui/button";
import { ProductDetailResponse } from "@/redux/types/product";
import { setOrderData } from "@/redux/slices/paymentSlice";

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image?: string;
}

export interface OrderItem extends Product {
  quantity: number;
}

type PaymentMethod = "cash" | "qr";

// ProductDetailResponse를 Product로 변환하는 함수
const convertToProduct = (productDetail: ProductDetailResponse): Product => {
  return {
    id: productDetail.id,
    name: productDetail.name,
    price: productDetail.price,
    category: productDetail.productCategoryId.toString(),
    image: productDetail.image,
  };
};

const POSPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    null
  );

  const handleAddProduct = (productDetail: ProductDetailResponse) => {
    const product = convertToProduct(productDetail);
    const existingItemIndex = currentOrder.findIndex(
      (item) => item.id === product.id
    );

    if (existingItemIndex > -1) {
      const updatedOrder = [...currentOrder];
      updatedOrder[existingItemIndex].quantity += 1;
      setCurrentOrder(updatedOrder);
    } else {
      setCurrentOrder([...currentOrder, { ...product, quantity: 1 }]);
    }
  };

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity === 0) {
      setCurrentOrder(currentOrder.filter((item) => item.id !== productId));
    } else {
      const updatedOrder = currentOrder.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
      setCurrentOrder(updatedOrder);
    }
  };

  const calculateTotal = () => {
    return currentOrder.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handleCancelOrder = () => {
    setCurrentOrder([]);
    setPaymentMethod(null);
  };

  const handleCompleteOrder = async () => {
    if (!paymentMethod) {
      alert("결제 방법을 선택해주세요.");
      return;
    }

    if (paymentMethod === "qr") {
      const orderData = {
        totalAmount: calculateTotal(),
        orderName: `주문 ${new Date().toLocaleString()}`,
        customerName: "고객",
        storeId: 1,
        products: currentOrder.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        })),
      };

      console.log("Creating order data:", orderData);

      try {
        // Redux store에 주문 데이터 저장
        dispatch(setOrderData(orderData));

        // localStorage에 백업
        localStorage.setItem("orderData", JSON.stringify(orderData));

        console.log("Order data saved successfully");

        // 결제 페이지로 이동
        router.push("/payment/request");
      } catch (error) {
        console.error("Error saving order data:", error);
        alert("주문 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
      return;
    }

    // 현금 결제 로직은 추후 구현
    alert("현금 결제는 아직 구현되지 않았습니다.");
  };

  return (
    <div className="flex h-full">
      <div className="w-4/6 overflow-y-auto pb-8">
        <ProductGrid onAddProduct={handleAddProduct} />
      </div>

      <div className="w-2/6 h-full bg-white p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-4">현재 주문</h2>
        <div className="flex-1 overflow-hidden flex flex-col">
          <Card className="flex-1 overflow-y-auto mb-4">
            <div className="p-4">
              {currentOrder.length === 0 ? (
                <p className="text-gray-500">주문 항목이 없습니다.</p>
              ) : (
                <ul>
                  {currentOrder.map((item) => (
                    <li
                      key={item.id}
                      className="flex justify-between items-center mb-2 pb-2 border-b"
                    >
                      <div>
                        <span>{item.name}</span>
                        <span className="text-gray-500 ml-2">
                          {item.price.toLocaleString()}원
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Button
                          variant="default"
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                          className="mr-2 sm"
                        >
                          -
                        </Button>
                        <span>{item.quantity}</span>
                        <Button
                          variant="default"
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                          className="ml-2 sm"
                        >
                          +
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>

          <div className="bg-gray-100 p-4 rounded">
            <div className="flex justify-between mb-4">
              <span className="font-bold">총 합계:</span>
              <span className="font-bold text-xl">
                {calculateTotal().toLocaleString()}원
              </span>
            </div>
            <div className="flex space-x-2 mb-4">
              <Button
                variant={paymentMethod === "cash" ? "primary" : "default"}
                className="w-1/2"
                onClick={() => setPaymentMethod("cash")}
              >
                현금
              </Button>
              <Button
                variant={paymentMethod === "qr" ? "primary" : "default"}
                className="w-1/2"
                onClick={() => setPaymentMethod("qr")}
              >
                QR
              </Button>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="default"
                className="w-1/2"
                onClick={handleCancelOrder}
              >
                주문 취소
              </Button>
              <Button
                variant="default"
                className="w-1/2"
                onClick={handleCompleteOrder}
                disabled={currentOrder.length === 0 || !paymentMethod}
              >
                결제하기
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSPage;
