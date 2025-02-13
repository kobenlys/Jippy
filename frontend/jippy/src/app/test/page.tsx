// app/products/register/page.tsx
'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import ProductBaseForm from '@/test/components/ProductBaseForm';
import TypeSelector from '@/test/components/TypeSelector';
import VariantModal from '@/test/components/VariantModal';
import { RootState } from '@/redux/store';
import { ProductSize, ProductType } from '@/test/types/product';

export default function ProductRegistrationPage() {
  const [step, setStep] = useState<'base' | 'type'>('base');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const productState = useSelector((state: RootState) => state.product);

  const handleBaseFormSubmit = () => {
    setStep('type');
  };

  const handleTypeSelect = () => {
    setIsModalOpen(true);
  };

  const handleVariantSubmit = async (data: { size: ProductSize; price: number; isActive: boolean }) => {
    const { size, price, isActive } = data;
    const payload = {
      name: productState.name,
      category: productState.category,
      type: productState.selectedType as ProductType,
      size,
      price,
      isActive
    };

    try {
      const response = await fetch('/api/products/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('상품 등록에 실패했습니다.');
      }

      // 성공 시 모달 닫기
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error:', error);
      alert('상품 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">상품 등록</h1>
      
      {step === 'base' && (
        <ProductBaseForm onSubmit={handleBaseFormSubmit} />
      )}

      {step === 'type' && (
        <TypeSelector onTypeSelect={handleTypeSelect} />
      )}

      <VariantModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleVariantSubmit}
      />
    </div>
  );
}