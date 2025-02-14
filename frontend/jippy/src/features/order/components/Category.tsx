"use client";

import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchCategories } from "@/redux/slices/categorySlice";
import { Modal } from "@/features/common/components/ui/modal/Modal";
import { Button } from "@/features/common/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryProps {
  selectedCategory: string;
  onCategorySelect: (categoryName: string, categoryId: number | -1) => void;
}

const CreateCategory = ({
  selectedCategory,
  onCategorySelect,
}: CategoryProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const currentShopId = useSelector(
    (state: RootState) => state.shop.currentShop?.id
  );
  const { categories } = useSelector((state: RootState) => state.category);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{ id: number; categoryName: string } | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [updatedCategoryName, setUpdatedCategoryName] = useState("");
  const [touchStartTime, setTouchStartTime] = useState(0);

  // 터치 시작 시간 기록
  const handleTouchStart = (category: { id: number; categoryName: string }) => {
    if (category.id === 0) return;
    setTouchStartTime(Date.now());
    handleLongPressStart(category);
  };

  // 터치 종료 시 시간 체크
  const handleTouchEnd = () => {
    const touchDuration = Date.now() - touchStartTime;
    handleLongPressEnd();
    
    // 1초 미만의 터치는 일반 클릭으로 처리
    if (touchDuration < 1000) {
      setIsEditMode(false);
      setIsActionModalOpen(false);
      setEditingCategory(null);
    }
  };

  const fetchCategoriesData = useCallback(async () => {
    if (currentShopId) {
      await dispatch(fetchCategories(currentShopId));
    }
  }, [dispatch, currentShopId]);

  useEffect(() => {
    fetchCategoriesData();
  }, [fetchCategoriesData]);

  const handleLongPressStart = (category: { id: number; categoryName: string }) => {
    if (category.id === 0) return; // 전체 카테고리는 편집 불가
  
    const timer = setTimeout(() => {
      setIsEditMode(true);
      setEditingCategory(category); // 편집할 카테고리 설정
      setIsActionModalOpen(true); // 모달 열기
    }, 1000);
    setLongPressTimer(timer);
  };

  const handleLongPressEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleCategoryClick = (category: { id: number; categoryName: string }) => {
    if (isEditMode) {
      setIsEditMode(false);
      setIsActionModalOpen(false);
      setEditingCategory(null);
    }
    // 전체 카테고리 선택 시 -1을 전달
    if (category.id === 0) {
      onCategorySelect(category.categoryName, -1);
    } else {
      onCategorySelect(category.categoryName, category.id);
    }
  };
  
  const handleCreateCategory = async () => {
    if (!currentShopId || !newCategoryName.trim()) return;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/category/${currentShopId}/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ categoryName: newCategoryName.trim() }),
        }
      );
      if (!response.ok) throw new Error("Failed to create category");
      await fetchCategoriesData();
      setNewCategoryName("");
      setIsCreateMode(false);
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const handleUpdateCategory = async () => {
    if (!currentShopId || !editingCategory || !updatedCategoryName.trim()) return;
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/category/${currentShopId}/update/${editingCategory.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ categoryName: updatedCategoryName.trim() }),
        }
      );
      
      if (!response.ok) throw new Error("Failed to update category");
      
      await fetchCategoriesData();
      setIsUpdateMode(false);
      setIsActionModalOpen(false);
      setIsEditMode(false);
      setUpdatedCategoryName("");
      setEditingCategory(null);
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (!currentShopId || categoryId === 0) return;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/category/${currentShopId}/delete/${categoryId}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Failed to delete category");
      await fetchCategoriesData();
      setIsActionModalOpen(false);
      setIsEditMode(false);
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const allCategories = [
    { id: 0, categoryName: "전체" },
    ...categories
  ];

  return (
    <>
      <div className="w-full overflow-x-auto">
        <div className="w-full min-w-0">
          <div className="flex gap-[12px] no-scrollbar">
            {allCategories.map((category) => (
              <div
                key={category.id}
                className="relative"
                onMouseDown={() => handleLongPressStart(category)}
                onMouseUp={handleLongPressEnd}
                onMouseLeave={handleLongPressEnd}
                onTouchStart={() => handleTouchStart(category)}
                onTouchEnd={handleTouchEnd}
                onClick={() => handleCategoryClick(category)}
              >
                <Button
                  variant={selectedCategory === category.categoryName ? "orange" : "orangeBorder"}
                  className={cn(
                    "w-[85px] h-[50px] rounded-[15px] font-semibold text-xl flex-shrink-0 mt-0",
                    isEditMode && category.id !== 0 && "animate-shake"
                  )}
                >
                  {category.categoryName}
                </Button>
              </div>
            ))}
            <Button
              onClick={() => setIsCreateMode(true)}
              variant="orangeBorder"
              className="w-[85px] h-[50px] rounded-[15px] font-semibold text-xl flex-shrink-0 mt-0"
            >
              +
            </Button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={isActionModalOpen}
        onClose={() => {
          setIsActionModalOpen(false);
          setIsEditMode(false);
          setEditingCategory(null);
        }}
      >
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-bold">카테고리 관리</h2>
          <p className="mt-2">
            {editingCategory?.categoryName} 카테고리를 수정하거나 삭제할 수
            있습니다.
          </p>
          <div className="flex gap-4 justify-center mt-4">
            <Button
              onClick={() => {
                setIsUpdateMode(true);
                setUpdatedCategoryName(editingCategory?.categoryName || "");
                setIsActionModalOpen(false);
              }}
              variant="orangeBorder"
            >
              <Edit className="w-4 h-4" /> 수정
            </Button>
            <Button
              onClick={() =>
                editingCategory && handleDeleteCategory(editingCategory.id)
              }
              variant="danger"
            >
              <Trash className="w-4 h-4" /> 삭제
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isCreateMode}
        onClose={() => {
          setIsCreateMode(false);
          setNewCategoryName("");
        }}
      >
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-bold mb-4">새 카테고리 추가</h2>
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
            placeholder="카테고리 이름 입력"
          />
          <div className="flex gap-4 justify-end">
            <Button
              onClick={() => {
                setIsCreateMode(false);
                setNewCategoryName("");
              }}
              variant="orangeBorder"
            >
              취소
            </Button>
            <Button onClick={handleCreateCategory} variant="orange">
              추가
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isUpdateMode}
        onClose={() => {
          setIsUpdateMode(false);
          setUpdatedCategoryName("");
          setEditingCategory(null);
        }}
      >
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-bold mb-4">카테고리 수정</h2>
          <input
            type="text"
            value={updatedCategoryName}
            onChange={(e) => setUpdatedCategoryName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
            placeholder="새로운 카테고리 이름 입력"
          />
          <div className="flex gap-4 justify-end">
            <Button
              onClick={() => {
                setIsUpdateMode(false);
                setUpdatedCategoryName("");
                setEditingCategory(null);
              }}
              variant="orangeBorder"
            >
              취소
            </Button>
            <Button onClick={handleUpdateCategory} variant="orange">
              수정
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CreateCategory;