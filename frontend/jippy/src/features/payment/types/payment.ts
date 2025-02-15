export interface PaymentState {
  loading: boolean;
  error: string | null;
  orderData: OrderData | null;
}

export interface OrderData {
  totalAmount: number;
  orderName: string;
  customerName: string;
  storeId: number;
  products: Array<{
    id: number;
    quantity: number;
  }>;
}

export interface PaymentConfirmRequest {
  storeId: number;
  totalCost: number;
  paymentType: "QRCODE";
  productList: Array<{
    productId: number;
    quantity: number;
  }>;
  orderId: string;
  paymentKey: string;
  amount: number;
}

export interface Product {
  id: string | number;
  quantity: number;
}

export interface ConfirmQrCodePaymentRequest {
  // ConfirmPaymentRequest 상속 필드
  storeId: number;
  totalCost: number;
  paymentType: "QRCODE";
  productList: Product[];
  
  // ConfirmQrCodePaymentRequest 추가 필드
  orderId: string;
  paymentKey: string;
  amount: number;
}
