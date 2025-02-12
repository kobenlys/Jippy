"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchProducts } from "@/redux/slices/productSlice";
import { ProductDetailResponse, ProductType } from "@/features/product/types";
import ProductRegistrationModal from "./ProductRegistrationModal";
import { Plus } from "lucide-react";

interface ProductGridProps {
 onProductSelect?: (product: ProductDetailResponse) => void;
 showAddButton?: boolean;
}

const ProductGrid = ({ 
 onProductSelect, 
 showAddButton = true
}: ProductGridProps) => {
 const dispatch = useDispatch<AppDispatch>();
 const { loading, error } = useSelector((state: RootState) => state.product);
 const products = useSelector((state: RootState) => {
  const productsState = state.product.products;
  return Array.isArray(productsState) 
    ? productsState 
    : (productsState as { data: ProductDetailResponse[] }).data || [];
});
 const currentShop = useSelector((state: RootState) => state.shop.currentShop);
 
 const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
 const DEFAULT_IMAGE_PATH = "/images/PlaceHolder.png";

 useEffect(() => {
   if (currentShop?.id) {
     dispatch(fetchProducts(currentShop.id));
   }
 }, [dispatch, currentShop?.id]);

 if (!currentShop) {
   return (
     <div className="flex justify-center items-center h-full">
       <p className="text-gray-500">매장을 선택해주세요.</p>
     </div>
   );
 }

 if (loading) {
   return (
     <div className="flex justify-center items-center h-full">
       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
     </div>
   );
 }

 if (error) {
   return (
     <div className="flex justify-center items-center h-full text-red-500">
       {error}
     </div>
   );
 }

 const productsWithStore = (products || []).map(product => ({
  ...product,
  storeId: currentShop?.id || 0,
  productType: Number(product.productType) as ProductType,
}));

 const filteredProducts = productsWithStore.filter(
   product => product.storeId === currentShop.id
 );

 return (
   <>
     <div className="grid grid-cols-4 gap-4 p-4 mb-8">
       {filteredProducts.length === 0 ? (
         <div className="col-span-4 text-center py-8 text-gray-500">
           등록된 상품이 없습니다.
         </div>
       ) : (
         filteredProducts.map((product) => (
           <div
             key={product.id}
             onClick={() => onProductSelect?.(product)}
             className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
           >
             <div className="relative w-full h-32 bg-gray-200 rounded-lg mb-2">
               <Image
                 src={product.image ? `data:image/jpeg;base64,${product.image}` : DEFAULT_IMAGE_PATH}
                 alt={product.name}
                 fill
                 className="object-cover rounded-lg"
                 onError={(e) => {
                   const target = e.target as HTMLImageElement;
                   target.src = DEFAULT_IMAGE_PATH;
                 }}
               />
             </div>
             <h3 className="font-semibold">{product.name}</h3>
             <p className="text-gray-600">{product.price.toLocaleString()}원</p>
             {!product.status && (
               <span className="inline-block mt-2 px-2 py-1 text-sm bg-red-100 text-red-800 rounded">
                 품절
               </span>
             )}
           </div>
         ))
       )}

       {showAddButton && (
         <div 
           onClick={() => setIsRegistrationModalOpen(true)}
           className="bg-white rounded-lg shadow-md p-4 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
         >
           <Plus className="w-12 h-12 text-gray-500" />
         </div>
       )}
     </div>

     <ProductRegistrationModal 
       isOpen={isRegistrationModalOpen}
       onClose={() => setIsRegistrationModalOpen(false)}
     />
   </>
 );
};

export default ProductGrid;