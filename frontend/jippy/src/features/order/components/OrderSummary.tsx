"use client";

import { type FC } from "react";
import { Button } from "@/features/common/components/ui/button";
import { Card } from "@/features/common/components/ui/card/Card";
import { OrderItem, PaymentMethod } from "@/features/order/types/pos";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { ProductSize, ProductType, ProductSizeLabel, ProductTypeLabel } from '@/redux/types/product';

interface OrderPaymentProps {
  currentOrder: OrderItem[];
  onQuantityChange: (productId: number, newQuantity: number) => void;
  calculateTotal: () => number;
  paymentMethod: PaymentMethod | null;
  onSelectPaymentMethod: (method: PaymentMethod) => void;
  onPaymentSubmit: () => Promise<void>;
  onCancelOrder: () => void;
}

export const OrderPayment: FC<OrderPaymentProps> = ({
  currentOrder = [],
  onQuantityChange,
  calculateTotal,
  paymentMethod,
  onSelectPaymentMethod,
  onPaymentSubmit,
  onCancelOrder,
}) => {

  // 컴포넌트 레벨에서 safeCurrentOrder 정의
  const safeCurrentOrder = currentOrder || [];

  const formatOrderItemName = (item: OrderItem) => {
    // 안전한 타입 체크 추가
    if (!item) return '';

    // 디버깅용 로그
    console.log('주문 아이템:', item);

    // enum 값으로 비교
    if (item.size === ProductSize.F || item.type === ProductType.EXTRA) {
      return item.name;
    }
  
    // 레이블을 사용하여 표시
    return `[${ProductSizeLabel[item.size]}] ${item.name} (${ProductTypeLabel[item.type]})`;
};

  return (
    <div className="flex flex-col h-full">
      <div className="flex-none bg-white p-4 border-b w-full flex justify-center items-center">
        <div className="px-4">
          <h1 className="h-[50px] text-xl font-semibold flex items-center justify-center">
            주문 목록
          </h1>
        </div>
      </div>

      <div className="flex-1 flex flex-col space-y-4 p-4 bg-white">
        <Card className="flex-1">
          <div className="p-4 h-full overflow-y-auto">
            {safeCurrentOrder.length === 0 ? (
              <p className="text-muted-foreground">주문 항목이 없습니다.</p>
            ) : (
              <ul className="space-y-2">
                {safeCurrentOrder.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between items-center py-2 border-b border-border last:border-0"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{formatOrderItemName(item)}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.price.toLocaleString()}원
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          onQuantityChange(
                            item.id,
                            Math.max(0, item.quantity - 1)
                          )
                        }
                        className="w-6 h-6 flex items-center justify-center bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                        aria-label="수량 감소"
                      >
                        -
                      </button>
                      <span className="w-8 text-center tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          onQuantityChange(item.id, item.quantity + 1)
                        }
                        className="w-6 h-6 flex items-center justify-center bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                        aria-label="수량 증가"
                      >
                        +
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>

        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <span className="font-medium">총 합계</span>
            <span className="text-lg font-bold tabular-nums">
              {calculateTotal().toLocaleString()}원
            </span>
          </div>

          <PaymentMethodSelector
            paymentMethod={paymentMethod}
            onSelectPaymentMethod={onSelectPaymentMethod}
          />

          <Button
            onClick={onPaymentSubmit}
            disabled={!paymentMethod || currentOrder.length === 0}
            className="w-full h-12"
            variant="orange"
          >
            결제하기
          </Button>

          <Button variant="default" className="w-full" onClick={onCancelOrder}>
            주문 취소
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderPayment;