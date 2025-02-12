// 파일 이름 변경 때문에 주석 답니다.
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { Modal } from "@/features/common/components/ui/modal/Modal";
import { Button } from "@/features/common/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  id: number;
  categoryName: string;
}

interface CategoryProps {
  selectedCategory: string;
  onCategorySelect: (categoryName: string, categoryId: number) => void;  // categoryId 파라미터 추가
}

interface RootState {
  shop: {
    currentShop: {
      id: number;
    } | null;
  };
}

const CreateCategory = ({
  selectedCategory,
  onCategorySelect,
}: CategoryProps) => {
  const currentShopId = useSelector(
    (state: RootState) => state.shop.currentShop?.id
  );
  const [categories, setCategories] = useState<Category[]>([
    { id: 0, categoryName: "전체" },
  ]);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [updatedCategoryName, setUpdatedCategoryName] = useState("");

  const fetchCategories = useCallback(async () => {
    if (!currentShopId) return;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/category/${currentShopId}/select`
      );
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      const categoryData = data.data || [];
      setCategories([
        { id: 0, categoryName: "전체" },
        ...categoryData
      ]);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([{ id: 0, categoryName: "전체" }]);
    }
  }, [currentShopId]);
  
  useEffect(() => {
    if (currentShopId) fetchCategories();
  }, [currentShopId, fetchCategories]);

  const handleLongPressStart = (category: Category) => {
    if (category.id === 0) return; // "전체" 카테고리는 제외
  
    const timer = setTimeout(() => {
      setIsEditMode(true); // 1초 후 흔들림 모드 활성화
    }, 1000);
    setLongPressTimer(timer);
  };
  
  const handleLongPressEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };
  
// category.tsx
// handleCategoryClick 함수 수정
const handleCategoryClick = (category: Category) => {
  // 편집 모드일 때는 클릭 이벤트 무시
  if (isEditMode) {
    setIsActionModalOpen(true);
    setEditingCategory(category);
    return;
  }

  console.log('=== 선택된 카테고리 정보 ===');
  console.log('category:', category);
  console.log('categoryId type:', typeof category.id);
  
  // 카테고리 선택 처리
  onCategorySelect(category.categoryName, category.id);
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
      await fetchCategories();
      setNewCategoryName("");
      setIsCreateMode(false);
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  // 편집 모드 종료를 위한 함수 추가
  // const exitEditMode = () => {
  //   setIsEditMode(false);
  //   setEditingCategory(null);
  //   setLongPressTimer(null);
  // };

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
      
      await fetchCategories();
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
      await fetchCategories();
      setIsActionModalOpen(false);
      setIsEditMode(false);
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <>
      <div className="w-full overflow-x-auto">
        <div className="w-full min-w-0">
          <div className="flex gap-[12px] no-scrollbar">
            {categories.map((category) => (
              <div
                key={category.id}
                className="relative"
                onMouseDown={() => handleLongPressStart(category)}
                onMouseUp={() => handleLongPressEnd()}
                onMouseLeave={() => {
                  if (longPressTimer) {
                    clearTimeout(longPressTimer);
                    setLongPressTimer(null);
                  }
                }}
                onTouchStart={() => handleLongPressStart(category)}
                onTouchEnd={() => handleLongPressEnd()}
                onClick={() => handleCategoryClick(category)}
              >
                <Button
                  variant={selectedCategory === category.categoryName ? "orange" : "orangeBorder"}
                  className={cn(
                    "w-[85px] h-[50px] rounded-[15px] font-semibold text-xl flex-shrink-0 mt-0",
                    // 편집 모드일 때 전체 카테고리를 제외한 모든 카테고리가 흔들리도록 수정
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

      {/* Category Action Modal */}
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

      {/* Create Category Modal */}
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

      {/* Update Category Modal */}
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