// POSPage.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import ProductGrid from "@/features/order/components/ProductGrid";
import { ProductDetailResponse } from "@/redux/types/product";
import { setOrderData } from "@/redux/slices/paymentSlice";
import { OrderItem, PaymentMethod } from "@/features/order/types/pos";
import {
  calculateTotal,
  convertToProduct,
} from "@/features/order/components/utils";
import { OrderPayment } from "@/features/order/components/OrderSummary";

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

  const handleCancelOrder = () => {
    setCurrentOrder([]);
    setPaymentMethod(null);
  };

  const handlePaymentSubmit = async () => {
    if (!paymentMethod) {
      alert("결제 방법을 선택해주세요.");
      return;
    }

    if (paymentMethod === "qr") {
      const orderData = {
        totalAmount: calculateTotal(currentOrder),
        orderName: `주문 ${new Date().toLocaleString()}`,
        customerName: "고객",
        storeId: 1,
        products: currentOrder.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        })),
      };

      try {
        dispatch(setOrderData(orderData));
        localStorage.setItem("orderData", JSON.stringify(orderData));
        router.push("/payment/request");
      } catch (error) {
        console.error("Error saving order data:", error);
        alert("주문 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
      return;
    }

    alert("현금 결제는 아직 구현되지 않았습니다.");
  };

  return (
    <div className="flex h-full">
      <div className="w-4/6 overflow-y-auto pb-8">
        <ProductGrid onAddProduct={handleAddProduct} />
      </div>

      <div className="w-2/6 h-full">
        <OrderPayment
          currentOrder={currentOrder}
          onQuantityChange={handleQuantityChange}
          calculateTotal={() => calculateTotal(currentOrder)}
          paymentMethod={paymentMethod}
          onSelectPaymentMethod={setPaymentMethod}
          onPaymentSubmit={handlePaymentSubmit}
          onCancelOrder={handleCancelOrder}
        />
      </div>
    </div>
  );
};

export default POSPage;
