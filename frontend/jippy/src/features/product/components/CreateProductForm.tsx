"use client";

import React from "react";
import { useProductForm } from "@/features/product/hooks/userProductForm";
import "@/app/globals.css";
import { FormField } from "@/features/common/components/ui/form/FormFields";
import { Alert, AlertDescription } from "@/features/common/components/ui/Alert";
import { Button } from "@/features/common/components/ui/button";
import CreateCategory from "@/features/order/components/category";
import ProductImageUpload from "@/features/product/components/ProductImageUpload";

const CreateProductForm = () => {
  const {
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
  } = useProductForm();

  return (
    <div className="flex flex-col items-center justify-center">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
        {/* 카테고리 선택 */}
        <div className="mb-4">
          <CreateCategory
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />
        </div>

        {/* 상품 기본 정보 */}
        <FormField
          label="상품명"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
        />

        <FormField
          label="상품 가격"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          error={errors.price}
          required
        />

        {/* 상품 이미지 업로드 */}
        <FormField
          label="상품 이미지"
          name="image"
          customInput={
            <ProductImageUpload
              imagePreview={imagePreview}
              onImageUpload={handleImageUpload}
            />
          }
        />

        {/* 상품 사이즈 선택 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium mb-2">
            상품 사이즈
            <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["S", "M", "L"] as const).map((size) => (
              <Button
                key={size}
                type="button"
                variant={formData.productSize === size ? "orange" : "default"}
                onClick={() => handleSizeChange(size)}
                className="w-full"
              >
                {size}
              </Button>
            ))}
          </div>
          {errors.productSize && (
            <p className="text-red-500 text-sm mt-1">{errors.productSize}</p>
          )}
        </div>

        {/* 상품 온도 선택 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium mb-2">
            상품 온도
            <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(["HOT", "ICE"] as const).map((type) => (
              <Button
                key={type}
                type="button"
                variant={formData.productType === type ? "orange" : "default"}
                onClick={() => handleTypeChange(type)}
                className="w-full"
              >
                {type}
              </Button>
            ))}
          </div>
          {errors.productType && (
            <p className="text-red-500 text-sm mt-1">{errors.productType}</p>
          )}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button
          variant="orange"
          disabled={isLoading}
          type="submit"
          className="w-full mt-4"
        >
          {isLoading ? "등록 중..." : "상품 등록"}
        </Button>
      </form>
    </div>
  );
};

export default CreateProductForm;