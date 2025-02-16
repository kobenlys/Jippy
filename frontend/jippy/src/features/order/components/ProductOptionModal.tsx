import { Modal } from "@/features/common/components/ui/modal/Modal";
import {
  ProductDetailResponse,
  ProductType,
  ProductSize,
  ProductTypeLabel,
  ProductSizeLabel,
  AVAILABLE_SIZES,
} from "@/redux/types/product";
import { useState } from "react";
import Image from "next/image";

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
  onSelect,
}: ProductOptionModalProps) => {
  const [selectedType, setSelectedType] = useState<ProductType | null>(null);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);

  const handleTypeSelect = (type: ProductType) => {
    setSelectedType(type);
  };

  const handleSizeSelect = (size: ProductSize) => {
    setSelectedSize(size);
  };

  const handleConfirm = () => {
    console.log("🛠 선택 확인: ", { selectedType, selectedSize });
    console.log("🔍 전체 상품 목록: ", product);

    if (!selectedType || !selectedSize) {
      alert("타입과 사이즈를 선택해주세요.");
      return;
    }

    const selectedTypeStr = ProductType[
      selectedType as number
    ] as unknown as string;
    const selectedSizeStr = ProductSize[
      selectedSize as number
    ] as unknown as string;

    const selectedProduct = product.find((p) => {
      console.log(
        `📌 비교 중 -> 상품명: ${p.name}, 타입: ${p.productType}, 사이즈: ${p.productSize}`
      );
      return (
        String(p.productType) === selectedTypeStr &&
        String(p.productSize) === selectedSizeStr
      );
    });

    if (!selectedProduct) {
      console.warn("⚠️ 선택된 옵션에 해당하는 상품이 없습니다.");
      console.log("📌 현재 선택된 타입:", selectedType);
      console.log("📌 현재 선택된 사이즈:", selectedSize);
      console.log("📌 상품 리스트:", product);
      return;
    }

    console.log("✅ 선택된 상품:", selectedProduct);
    onSelect(selectedProduct);
    onClose();
    setSelectedType(null);
    setSelectedSize(null);
  };

  const firstProduct = product[0];
  if (!firstProduct) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-xs w-full !z-50">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* 헤더 */}
        <div className="bg-jippy-brown py-2.5 text-center">
          <h2 className="text-base font-medium text-white">상세 옵션</h2>
        </div>

        <div className="p-4 space-y-4">
          {/* 상품 정보 */}
          <div className="flex items-center gap-3">
            {firstProduct.image && (
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src={firstProduct.image}
                  alt={firstProduct.name}
                  fill
                  sizes="48px"
                  className="object-cover rounded-lg"
                />
              </div>
            )}
            <div>
              <p className="font-medium text-sm">{firstProduct.name}</p>
              <p className="text-jippy-brown text-sm">
                {firstProduct.price.toLocaleString()}원
              </p>
            </div>
          </div>

          {/* 상품 타입 */}
          <div className="space-y-1.5">
            <p className="text-sm text-gray-600">상품 타입</p>
            <div className="grid grid-cols-2 gap-2">
              {[ProductType.HOT, ProductType.ICE].map((type) => (
                <button
                  key={type}
                  onClick={() => handleTypeSelect(type)}
                  className={`py-2 rounded-lg border text-sm transition-colors
                    ${
                      selectedType === type
                        ? "bg-jippy-orange text-white border-orange"
                        : "bg-white text-gray-700 border-gray-300"
                    }`}
                >
                  {ProductTypeLabel[type]}
                </button>
              ))}
            </div>
          </div>

          {/* 상품 사이즈 */}
          <div className="space-y-1.5">
            <p className="text-sm text-gray-600">상품 사이즈</p>
            <div className="grid grid-cols-3 gap-2">
              {[ProductSize.S, ProductSize.M, ProductSize.L].map((size) => (
                <button
                  key={size}
                  onClick={() => handleSizeSelect(size)}
                  className={`py-2 rounded-lg border text-sm transition-colors
                    ${
                      selectedSize === size
                        ? "bg-jippy-orange text-white border-orange"
                        : "bg-white text-gray-700 border-gray-300"
                    }`}
                >
                  {ProductSizeLabel[size]}
                </button>
              ))}
            </div>
          </div>

          {/* 버튼 */}
          <button
            onClick={handleConfirm}
            className="w-full py-2.5 border border-brown text-brown rounded-lg text-sm font-medium"
          >
            확인
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-gray-100 text-gray-800 rounded-lg text-sm font-medium"
          >
            취소
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ProductOptionModal;
