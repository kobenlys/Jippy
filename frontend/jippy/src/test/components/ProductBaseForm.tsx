// components/ProductRegistration/ProductBaseForm.tsx
'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { ProductCategory } from '@/test/types/product';
import { setBaseInfo } from '@/redux/slices/testSlice';

const ProductBaseForm = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('COFFEE');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setBaseInfo({ name, category }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          상품명
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          카테고리
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as ProductCategory)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="COFFEE">커피</option>
          <option value="NON_COFFEE">논커피</option>
          <option value="TEA">차</option>
          <option value="ADE">에이드</option>
          <option value="SMOOTHIE">스무디</option>
        </select>
      </div>

      <button
        type="submit"
        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        다음
      </button>
    </form>
  );
};

export default ProductBaseForm;