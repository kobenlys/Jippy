import { Modal } from "@/features/common/components/ui/modal/Modal";
import { ProductDetailResponse, ProductType, ProductSize } from "@/redux/types/product";
import { useState } from "react";

interface ProductOptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductDetailResponse[];
  onSelect: (product: ProductDetailResponse) => void;
}

const ProductOptionModal = ({ 
  isOpen, 
  onClose, 
  product, 
  onSelect 
}: ProductOptionModalProps) => {
  const [selectedType, setSelectedType] = useState<ProductType | null>(null);

  // 사용 가능한 타입 필터링
  const availableTypes = Array.from(new Set(product.map(p => p.productType)));

  // 선택된 타입에 따른 상품 필터링
  const filteredProducts = selectedType 
    ? product.filter(p => p.productType === selectedType)
    : product;

  const handleTypeSelect = (type: ProductType) => {
    setSelectedType(type);
  };

  const handleProductSelect = (selectedProduct: ProductDetailResponse) => {
    onSelect(selectedProduct);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md w-full">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">{product[0].name}</h2>
        
        {/* 타입 선택 */}
        {!selectedType && (
          <div className="mb-4">
            <h3 className="font-medium mb-2">타입 선택</h3>
            <div className="grid grid-cols-2 gap-2">
            {availableTypes.map(type => {
              const hasType = product.some(p => p.productType === type);
              if (!hasType) return null;
              
              return (
                <button
                  key={type}  // 이미 고유한 key로 사용 가능
                  onClick={() => handleTypeSelect(type)}
                  className="p-2 border rounded hover:bg-gray-100"
                >
                  {ProductType[type]}
                </button>
              );
            })}
            </div>
          </div>
        )}

        {/* 사이즈 선택 */}
        {selectedType && (
          <div>
            <button 
              onClick={() => setSelectedType(null)} 
              className="mb-4 text-sm text-blue-600 hover:underline"
            >
              ← 타입 다시 선택
            </button>
            <h3 className="font-medium mb-2">사이즈 선택</h3>
            <div className="grid grid-cols-3 gap-2">
              {filteredProducts.map(p => (
                <button
                  key={`${p.productType}-${p.productSize}`}
                  onClick={() => handleProductSelect(p)}
                  className="p-2 border rounded hover:bg-gray-100"
                >
                  {`${ProductType[p.productType]} - ${ProductSize[p.productSize]}`}
                  <div className="text-sm text-gray-600">
                    {p.price.toLocaleString()}원
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ProductOptionModal;