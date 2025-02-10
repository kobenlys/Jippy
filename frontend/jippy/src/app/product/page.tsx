import ProductForm from "@/features/product/components/ProductForm";
import styles from "@/app/page.module.css";

export default function CreateProductPage() {
  return (
    <div className="container flex flex-col items-center justify-center mx-auto py-6">
      <h1 className={styles.subtitle}>상품 등록</h1>
      <ProductForm />
    </div>
  );
}