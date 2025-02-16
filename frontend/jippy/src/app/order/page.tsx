// app/pos/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import ProductGrid from "@/features/order/components/ProductGrid";
import { Button } from "@/features/common/components/ui/button";
import { ProductDetailResponse } from "@/redux/types/product";
import { setOrderData } from "@/redux/slices/paymentSlice";
import {
  OrderItem,
  PaymentMethod,
  PaymentType,
  CashDenomination,
} from "@/features/order/types/pos";
import { OrderSummary } from "@/features/order/components/OrderSummary";
import { PaymentMethodSelector } from "@/features/order/components/PaymentMethodSelector";
// import { CashPaymentModal } from "@/features/order/components/CashPaymentModal";
import {
  calculateTotal,
  convertToProduct,
} from "@/features/order/components/utils";

const POSPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    null
  );
  const [isCashPaymentModalOpen, setIsCashPaymentModalOpen] = useState(false);

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
    setIsCashPaymentModalOpen(false);
  };

  const handleCompleteOrder = async () => {
    if (!paymentMethod) {
      alert("결제 방법을 선택해주세요.");
      return;
    }

    const orderData = {
      storeId: 1, // Hardcoded for now, might need to be dynamic
      totalCost: calculateTotal(currentOrder),
      paymentType: paymentMethod === "qr" ? "QRCODE" : ("CASH" as PaymentType),
      productList: currentOrder.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
    };

    if (paymentMethod === "qr") {
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

    // Cash Payment Flow
    if (paymentMethod === "cash") {
      setIsCashPaymentModalOpen(true);
    }
  };

  // const handleCashPaymentConfirm = async (
  //   cashDenomination: CashDenomination
  // ) => {
  //   try {
  //     const cashPaymentRequest = {
  //       storeId: 1, // 하드코딩 값
  //       totalCost: calculateTotal(currentOrder),
  //       paymentType: "CASH" as PaymentType,
  //       productList: currentOrder.map((item) => ({
  //         productId: item.id,
  //         quantity: item.quantity,
  //       })),
  //       cashRequest: cashDenomination,
  //     };

  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL}/api/payment/cash/confirm`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(cashPaymentRequest),
  //       }
  //     );

  //     if (!response.ok) {
  //       // 에러 응답 본문 로깅
  //       const errorBody = await response.text();
  //       console.error("Error response body:", errorBody);
  //       throw new Error(`Cash payment failed with status ${response.status}`);
  //     }

  //     const responseData = await response.json();
  //     console.log("결제 응답:", responseData);

  //     // 결제 후 처리
  //     handleCancelOrder();

  //     // 결제 성공 메시지
  //     alert(responseData.message || "현금 결제가 완료되었습니다.");
  //   } catch (error) {
  //     console.error("Cash payment error:", error);
  //     alert("현금 결제 중 오류가 발생했습니다. 다시 시도해주세요.");
  //   }
  // };

  return (
    <div className="flex h-full">
      <div className="w-4/6 overflow-y-auto pb-8">
        <ProductGrid onAddProduct={handleAddProduct} />
      </div>

      <div className="w-2/6 h-full bg-white p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-4">현재 주문</h2>
        <div className="flex-1 overflow-hidden flex flex-col">
          <OrderSummary
            currentOrder={currentOrder}
            onQuantityChange={handleQuantityChange}
            calculateTotal={() => calculateTotal(currentOrder)}
          />

          <PaymentMethodSelector
            paymentMethod={paymentMethod}
            onSelectPaymentMethod={setPaymentMethod}
          />

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

      {/* <CashPaymentModal
        isOpen={isCashPaymentModalOpen}
        totalAmount={calculateTotal(currentOrder)}
        onClose={() => setIsCashPaymentModalOpen(false)}
        onConfirm={handleCashPaymentConfirm}
      /> */}
    </div>
  );
};

export default POSPage;
