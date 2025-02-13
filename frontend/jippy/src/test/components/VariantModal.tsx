// components/ProductRegistration/VariantModal.tsx
'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { ProductSize } from '@/test/types/product';
import { RootState } from '@/redux/store';

interface VariantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { size: ProductSize; price: number; isActive: boolean }) => void;
}

const VariantModal = ({ isOpen, onClose, onSubmit }: VariantModalProps) => {
  const [selectedSize, setSelectedSize] = useState<ProductSize>('S');
  const [price, setPrice] = useState('');
  const { name, category } = useSelector((state: RootState) => state.product);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      size: selectedSize,
      price: Number(price),
      isActive: true
    });
    setPrice('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-medium mb-4">가격 설정</h3>
        <div className="mb-4">
          <p>상품명: {name}</p>
          <p>카테고리: {category}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">사이즈</label>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value as ProductSize)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              {(['S', 'M', 'L', 'F'] as ProductSize[]).map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">가격</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VariantModal;