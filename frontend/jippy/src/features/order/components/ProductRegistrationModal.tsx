"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import { Modal } from "@/features/common/components/ui/modal/Modal";
import { Button } from "@/features/common/components/ui/button";
import { AppDispatch, RootState } from "@/redux/store";
import { createProduct } from "@/redux/slices/productSlice";
import { X, ImagePlus } from 'lucide-react';
import { fetchCategories } from "@/redux/slices/categorySlice";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Category {
    id: number;
    categoryName: string;
    description?: string;
  }

interface ProductRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProductRegistrationModal: React.FC<ProductRegistrationModalProps> = ({ 
    isOpen, 
    onClose 
  }) => {
    const dispatch = useDispatch<AppDispatch>();
    const currentShop = useSelector((state: RootState) => state.shop.currentShop);
    const categories = useSelector((state: RootState) => {
        const categoriesState = state.category.categories;
        
        // 배열인지 확인
        if (Array.isArray(categoriesState)) {
            return categoriesState;
        }
        
        // 객체이고 data 프로퍼티가 있는지 확인
        if (categoriesState && 'data' in categoriesState) {
            return (categoriesState as { data: Category[] }).data;
        }
        
        // 둘 다 아니면 빈 배열 반환
        return [];
    });
    const loading = useSelector((state: RootState) => state.category.loading);

    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isAvailable, setIsAvailable] = useState(true);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen && currentShop?.id) {
            dispatch(fetchCategories(currentShop.id));
        }
    }, [isOpen, currentShop?.id, dispatch]);

    if (!isOpen) return null;

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        try {
            // 입력값 검증
            if (!productName.trim()) {
                alert('상품명을 입력해주세요.');
                return;
            }
    
            const price = parseFloat(productPrice.replace(/,/g, ''));
            if (isNaN(price) || price < 0) {
                alert('올바른 가격을 입력해주세요.');
                return;
            }
    
            if (!currentShop?.id) {
                alert('매장을 선택해주세요.');
                return;
            }
    
            if (!selectedCategory) {
                alert('카테고리를 선택해주세요.');
                return;
            }
    
            // 상품 데이터 구성
            const productData = {
                name: productName.trim(),
                price: price,
                storeId: currentShop.id,
                status: isAvailable,
                productCategoryId: parseInt(selectedCategory),
                productType: "ICE",  // 기본값 설정
                productSize: "M"     // 기본값 설정
            };
    
            // FormData 구성
            const formData = new FormData();
            formData.append('data', JSON.stringify(productData));
            
            if (imageFile) {
                formData.append('image', imageFile);
            }
    
            // 상품 등록 요청
            const result = await dispatch(createProduct({ 
                formData, 
                storeId: currentShop.id 
            })).unwrap();
    
            if (result.success) {
                alert('상품이 성공적으로 등록되었습니다.');
                onClose();
            } else {
                throw new Error(result.message || '상품 등록에 실패했습니다.');
            }
            
        } catch (error) {
            // console.error('상품 등록 중 오류 발생:', error);
            
            let errorMessage = '상품 등록에 실패했습니다.';
            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (typeof error === 'string') {
                errorMessage = error;
            }
            
            alert(errorMessage);
        }
    };

    const renderCategoryOptions = () => {
        if (loading) {
          return <option disabled>카테고리 로딩 중...</option>;
        }
      
        if (!categories || categories.length === 0) {
          return <option disabled>등록된 카테고리가 없습니다</option>;
        }
      
        return categories.map((category) => (
          <option key={category.id} value={category.id.toString()}>
            {category.categoryName}
          </option>
        ));
      };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose}
            className="max-w-md w-full"
        >
            <div className="max-w-4xl w-full mx-auto p-6">
                <h2 className="text-xl font-bold mb-4">새 상품 등록</h2>
                
                <form onSubmit={handleSubmit}>
                    {/* Image Upload Section */}
                    <div className="mb-4">
                        <input 
                            type="file" 
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                        <div 
                            className="relative w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                        >
                        {imagePreview ? (
                            <>
                                <Image 
                                    src={imagePreview} 
                                    alt="상품 이미지" 
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-cover rounded-lg"
                                    priority  // 이미지를 빠르게 로드하기 위해 추가
                                    onError={() => {
                                        // console.error('이미지 로드 실패');
                                        handleRemoveImage();
                                    }}
                                />
                                <button 
                                    type="button"
                                    onClick={(e) => handleRemoveImage(e)}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 z-10"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </>
                        ) : (
                            <div className="flex flex-col items-center text-gray-500">
                                <ImagePlus className="w-12 h-12 mb-2" />
                                <p>이미지 업로드</p>
                            </div>
                        )}
                        </div>
                    </div>

                    {/* Product Name Input */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            상품명
                        </label>
                        <input 
                            type="text" 
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="상품명을 입력하세요"
                            required
                        />
                    </div>

                    {/* Price Input */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            가격
                        </label>
                        <input 
                            type="text" 
                            value={productPrice}
                            onChange={(e) => {
                                const value = e.target.value.replace(/[^\d]/g, '');
                                setProductPrice(value ? Number(value).toLocaleString() : '');
                            }}
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="가격을 입력하세요"
                            required
                        />
                    </div>

                    {/* Category Selection */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            카테고리
                        </label>
                        <select 
                            value={selectedCategory} 
                            onChange={(e) => setSelectedCategory(e.target.value)} 
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        >
                            <option value="">카테고리 선택</option>
                            {renderCategoryOptions()}
                        </select>
                    </div>

                    {/* Product Status */}
                    <div className="mb-4 flex items-center">
                        <input 
                            type="checkbox" 
                            id="isAvailable"
                            checked={isAvailable}
                            onChange={(e) => setIsAvailable(e.target.checked)}
                            className="mr-2"
                        />
                        <label htmlFor="isAvailable" className="text-sm">
                            판매 중
                        </label>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex justify-end space-x-2">
                        <Button 
                            variant="orangeBorder"
                            onClick={onClose}
                        >
                            취소
                        </Button>
                        <Button
                            variant="orange"
                        >
                            등록
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default ProductRegistrationModal;