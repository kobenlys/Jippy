"use client";

import React, { useState } from "react";
import { loadTossPayments } from "@tosspayments/payment-sdk";
import { Card } from "@/features/common/components/ui/card/Card";
import { Button } from "@/features/common/components/ui/button";
import { useAppSelector } from "@/redux/hooks";
// import type { OrderData } from "@/features/payment/types/payment";

// test_ck_ma60RZblrqzQnGRxeeGz8wzYWBn1
// test_ck_yZqmkKeP8gpJeNxBdjGd3bQRxB9l
const TOSS_CLIENT_KEY = "test_ck_yZqmkKeP8gpJeNxBdjGd3bQRxB9l";

const generateRandomOrderId = () => {
  return "xxxx-xxxx-4xxx-yxxx-xxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// interface PaymentRequestProps {
//   orderData: OrderData;
// }

const PaymentRequestComponent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const orderData = useAppSelector((state) => state.payment.orderData);

  if (!orderData) {
    return null;
  }

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      const orderId = generateRandomOrderId();

      const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY);

      const paymentData = {
        amount: orderData.totalAmount,
        orderId: orderId,
        orderName: orderData.orderName || "주문",
        customerName: orderData.customerName || "고객",
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      };
      console.log(paymentData);
      await tossPayments.requestPayment("토스페이", paymentData);
    } catch (error: unknown) {
      console.error("결제 요청 중 오류 발생:", error);
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "USER_CANCEL"
      ) {
        alert("결제가 취소되었습니다.");
      } else {
        alert("결제 요청 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-#f8f8f8">
      <Card className="bg-white w-full max-w-xl">
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-6">주문 결제</h2>{" "}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">주문 금액</span>
              <span className="font-semibold">
                {orderData.totalAmount?.toLocaleString()}원
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">주문명</span>
              <span>{orderData.orderName || "주문"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">주문자</span>
              <span>{orderData.customerName || "고객"}</span>
            </div>
            {orderData.products && (
              <div className="mt-4 border-t pt-4">
                <h3 className="font-semibold mb-2">주문 상품</h3>
                {orderData.products.map((product, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center text-sm"
                  >
                    <span>
                      [{product.size}] {product.name} ({product.type})
                    </span>
                    <span>수량: {product.quantity}개</span>
                  </div>
                ))}
              </div>
            )}
            <Button
              onClick={handlePayment}
              disabled={isLoading}
              className="w-full bg-jippy-orange hover:bg-orange-600 text-white mt-4"
            >
              {isLoading ? "처리중..." : "결제하기"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PaymentRequestComponent;
