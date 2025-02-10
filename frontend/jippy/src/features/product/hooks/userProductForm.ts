import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { createProduct } from "@/redux/slices/productSlice";
import { ProductFormData } from "../types";

export const useProductForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.product);
  const { currentStore } = useSelector((state: RootState) => state.shop);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    price: 0,
    productSize: "M",
    productType: "HOT",
    status: true,
    storeId: currentStore?.id || 0,
    productCategoryId: 0,
    image: null
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});

  const validateForm = () => {
    const newErrors: Partial<Record<keyof ProductFormData, string>> = {};

    if (!formData.name) {
      newErrors.name = "상품명을 입력해주세요";
    }
    if (!formData.price || formData.price <= 0) {
      newErrors.price = "올바른 가격을 입력해주세요";
    }
    if (!formData.productSize) {
      newErrors.productSize = "상품 사이즈를 선택해주세요";
    }
    if (!formData.productType) {
      newErrors.productType = "상품 온도를 선택해주세요";
    }
    if (!formData.productCategoryId) {
      newErrors.productCategoryId = "카테고리를 선택해주세요";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === "number" ? Number(value) : value,
    });
    if (errors[name as keyof ProductFormData]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      // 이미지 미리보기 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategoryChange = (categoryId: number) => {
    setFormData({ ...formData, productCategoryId: categoryId });
    if (errors.productCategoryId) {
      setErrors({ ...errors, productCategoryId: "" });
    }
  };

  const handleSizeChange = (size: ProductFormData["productSize"]) => {
    setFormData({ ...formData, productSize: size });
    if (errors.productSize) {
      setErrors({ ...errors, productSize: "" });
    }
  };

  const handleTypeChange = (type: ProductFormData["productType"]) => {
    setFormData({ ...formData, productType: type });
    if (errors.productType) {
      setErrors({ ...errors, productType: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          formDataToSend.append(key, value);
        }
      });
      dispatch(createProduct(formDataToSend));
    }
  };

  return {
    formData,
    errors,
    isLoading: loading,
    error,
    imagePreview,
    handleChange,
    handleImageChange,
    handleCategoryChange,
    handleSizeChange,
    handleTypeChange,
    handleSubmit,
  };
};