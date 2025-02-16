"use client";

import React from "react";
import { Button } from "@/features/common/components/ui/button";
import { Card } from "@/features/common/components/ui/card/Card";
import { OrderItem } from "@/features/order/types/pos";

interface OrderSummaryProps {
  currentOrder: OrderItem[];
  onQuantityChange: (productId: number, newQuantity: number) => void;
  calculateTotal: () => number;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  currentOrder,
  onQuantityChange,
  calculateTotal,
}) => {
  return (
    <>
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
                        onQuantityChange(item.id, item.quantity - 1)
                      }
                      className="mr-2 sm"
                    >
                      -
                    </Button>
                    <span>{item.quantity}</span>
                    <Button
                      variant="default"
                      onClick={() =>
                        onQuantityChange(item.id, item.quantity + 1)
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
      </div>
    </>
  );
};
