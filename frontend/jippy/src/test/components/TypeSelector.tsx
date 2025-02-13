// components/ProductRegistration/TypeSelector.tsx
'use client';

import { useDispatch, useSelector } from 'react-redux';
import { ProductType } from '@/test/types/product';
import { setSelectedType } from '@/redux/slices/testSlice';
import { RootState } from '@/redux/store';

const TypeSelector = ({ onTypeSelect }: { onTypeSelect: () => void }) => {
  const dispatch = useDispatch();
  const selectedType = useSelector((state: RootState) => state.product.selectedType);

  const handleTypeSelect = (type: ProductType) => {
    dispatch(setSelectedType(type));
    onTypeSelect();
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">상품 타입 선택</h3>
      <div className="flex gap-4">
        {(['HOT', 'ICE', 'EXTRA'] as ProductType[]).map((type) => (
          <button
            key={type}
            onClick={() => handleTypeSelect(type)}
            className={`px-4 py-2 rounded-md ${
              selectedType === type
                ? 'bg-indigo-600 text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TypeSelector;