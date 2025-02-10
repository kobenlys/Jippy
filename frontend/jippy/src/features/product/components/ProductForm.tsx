"use client";

import React from "react";
import { useProductForm } from "../hooks/userProductForm";
import { FormField } from "@/features/common/components/ui/form/FormFields";
import { Alert, AlertDescription } from "@/features/common/components/ui/Alert";
import { Button } from "@/features/common/components/ui/button";
import { ProductSize, ProductType } from "../types";
import Image from "next/image";

const CreateProductForm = () => {
  const {
    formData,
    errors,
    isLoading,
    error,
    imagePreview,
    handleChange,
    handleImageChange,
    handleCategoryChange,
    handleSizeChange,
    handleTypeChange,
    handleSubmit,
  } = useProductForm();

  return (
    <div className="flex flex-col items-center justify-center">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
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

        <div className="space-y-2">
          <label className="block text-sm font-medium mb-2">
            카테고리
            <span className="text-red-500">*</span>
          </label>
          <select
            name="productCategoryId"
            value={formData.productCategoryId}
            onChange={(e) => handleCategoryChange(Number(e.target.value))}
            className="w-full p-2 border rounded-md"
          >
            <option value="">카테고리 선택</option>
            {/* 카테고리 옵션들은 API로 받아온 데이터를 매핑 */}
          </select>
          {errors.productCategoryId && (
            <p className="text-red-500 text-sm mt-1">{errors.productCategoryId}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium mb-2">
            상품 이미지
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />
          {imagePreview && (
            <div className="mt-2">
              <Image
                src={imagePreview}
                alt="상품 이미지 미리보기"
                width={200}
                height={200}
                className="rounded-md"
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium mb-2">
            상품 사이즈
            <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
          {(["S", "M", "L"] as ProductSize[]).map((size) => (
            <Button
                key={size}
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

        <div className="space-y-2">
          <label className="block text-sm font-medium mb-2">
            상품 온도
            <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
          {(["HOT", "ICE"] as ProductType[]).map((type) => (
            <Button
                key={type}
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
          variant="brown"
          disabled={isLoading}
          className="w-full mt-4 bg-orange-500 text-white hover:bg-orange-600"
        >
          {isLoading ? "등록 중..." : "상품 등록"}
        </Button>
      </form>
    </div>
  );
};

export default CreateProductForm;