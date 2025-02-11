// features/product/hooks/useProductForm.ts
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { createProduct } from "@/redux/slices/productSlice";

type ProductSize = 'S' | 'M' | 'L';
type ProductType = 'HOT' | 'ICE';

interface ProductFormData {
  name: string;
  price: number;
  productCategoryId: number;
  image: File | null;
  productSize: ProductSize;
  productType: ProductType;
  status: boolean;
}

interface ProductFormErrors {
  name?: string;
  price?: string;
  productCategoryId?: string;
  productSize?: string;
  productType?: string;
  submit?: string;
}

export const useProductForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentShop } = useSelector((state: RootState) => state.shop);
  const { loading: isLoading, error } = useSelector((state: RootState) => state.product);

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    price: 0,
    productCategoryId: 0,
    image: null,
    productSize: "M",
    productType: "HOT",
    status: true,
  });

  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [imagePreview, setImagePreview] = useState<string>("");

  const validateForm = () => {
    const newErrors: ProductFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "상품명을 입력해주세요.";
    }

    if (formData.price <= 0) {
      newErrors.price = "올바른 가격을 입력해주세요.";
    }

    if (!formData.productCategoryId && selectedCategory !== "전체") {
      newErrors.productCategoryId = "카테고리를 선택해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategorySelect = (categoryName: string, categoryId: number) => {
    setSelectedCategory(categoryName);
    setFormData((prev) => ({
      ...prev,
      productCategoryId: categoryId,
    }));
  };

  const handleSizeChange = (size: ProductSize) => {
    setFormData((prev) => ({ ...prev, productSize: size }));
  };

  const handleTypeChange = (type: ProductType) => {
    setFormData((prev) => ({ ...prev, productType: type }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!currentShop?.id) {
      setErrors({ ...errors, submit: "매장 정보를 찾을 수 없습니다." });
      return;
    }

    try {
      await dispatch(
        createProduct({
          formData,
          storeId: currentShop.id,
        })
      ).unwrap();

      // 성공 시 폼 초기화
      setFormData({
        name: "",
        price: 0,
        productCategoryId: 0,
        image: null,
        productSize: "M",
        productType: "HOT",
        status: true,
      });
      setImagePreview("");
      setSelectedCategory("전체");
    } catch (error) {
      console.error("Product creation failed:", error);
    }
  };

  return {
    formData,
    errors,
    isLoading,
    error,
    selectedCategory,
    imagePreview,
    handleChange,
    handleSubmit,
    handleCategorySelect,
    handleImageUpload,
    handleSizeChange,
    handleTypeChange,
  };
};