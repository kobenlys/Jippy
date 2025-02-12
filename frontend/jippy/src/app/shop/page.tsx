"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { Shop } from "@/features/shop/types/shops";
import ShopDetailModal from "@/features/shop/components/ShopDetailModal";
import { fetchShop, updateShop, deleteShop } from "@/redux/slices/shopSlice";

export default function ShopsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { shops, isLoading, error } = useSelector((state: RootState) => state.shop);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  
  const user = useSelector((state: RootState) => state.user.profile);
  const accessToken = useSelector((state: RootState) => state.user.accessToken);

  useEffect(() => {
    const fetchShops = async () => {
      if (user?.id && accessToken) {
        try {
          await dispatch(fetchShop(Number(user.id))).unwrap();
          setLocalError(null);
        } catch (err) {
          setLocalError("매장 정보를 불러오는데 실패했습니다. 다시 시도해주세요.");
          console.error("Error fetching shops:", err);
        }
      }
    };

    fetchShops();
  }, [user?.id, accessToken, dispatch]);

  const fetchShopDetail = async (shopId: number) => {
    try {
      if (!accessToken) {
        setLocalError("로그인이 필요합니다.");
        return;
      }

      const selectedShop = shops?.find(shop => shop.id === shopId);
      if (selectedShop) {
        setSelectedShop(selectedShop);
        setIsModalOpen(true);
        setLocalError(null);
      } else {
        throw new Error("매장을 찾을 수 없습니다.");
      }
    } catch (err) {
      setLocalError("매장 정보를 불러오는데 실패했습니다.");
      console.error("Error fetching shop detail:", err);
    }
  };

  const handleShopDelete = async (shopId: number) => {
    const isConfirmed = window.confirm("정말로 이 매장을 삭제하시겠습니까? 삭제된 매장은 복구할 수 없습니다.");
    
    if (!isConfirmed) return;

    try {
      if (!accessToken) {
        setLocalError("로그인이 필요합니다.");
        return;
      }

      await dispatch(deleteShop(shopId)).unwrap();
      setIsModalOpen(false);
      setSelectedShop(null);
      setLocalError(null);
    } catch (err) {
      setLocalError("매장 삭제에 실패했습니다.");
      console.error("Error deleting shop:", err);
    }
  };

  const handleShopUpdate = async (updatedShop: Shop) => {
    try {
      if (!accessToken) {
        setLocalError("로그인이 필요합니다.");
        return;
      }

      await dispatch(updateShop({ 
        storeId: updatedShop.id, 
        data: updatedShop 
      })).unwrap();
      
      setIsModalOpen(false);
      setSelectedShop(null);
      setLocalError(null);
    } catch (err) {
      setLocalError("매장 정보 수정에 실패했습니다.");
      console.error("Error updating shop:", err);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedShop(null);
    setLocalError(null);
  };

  if (!accessToken) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center text-gray-600">
          로그인이 필요합니다.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">내 매장 목록</h1>
      
      {(error || localError) && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error || localError}
        </div>
      )}

      {(shops?.length === 0 || !shops) && !isLoading ? (
        <div className="text-center text-gray-600">
          등록된 매장이 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops?.map((shop) => (
            <div
              key={shop.id}
              onClick={() => fetchShopDetail(shop.id)}
              className="cursor-pointer block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">{shop.name}</h2>
              <p className="text-gray-600">{shop.address}</p>
            </div>
          ))}
        </div>
      )}

      <ShopDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        shop={selectedShop}
        onUpdate={handleShopUpdate}
        onDelete={handleShopDelete}
        accessToken={accessToken}
      />
    </div>
  );
}