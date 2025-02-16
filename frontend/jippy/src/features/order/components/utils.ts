import { ProductDetailResponse } from "@/redux/types/product";
import { Product } from "../types/pos";
import { OrderItem } from "@/features/order/types/pos";

export const convertToProduct = (
  productDetail: ProductDetailResponse
): Product => {
  return {
    id: productDetail.id,
    name: productDetail.name,
    price: productDetail.price,
    category: productDetail.productCategoryId.toString(),
    image: productDetail.image,
  };
};

export const calculateTotal = (currentOrder: OrderItem[]) => {
  return currentOrder.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
};
