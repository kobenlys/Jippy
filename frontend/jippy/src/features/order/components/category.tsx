"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Modal } from "@/features/common/components/ui/modal/Modal";
import { Button } from "@/features/common/components/ui/button";
import { ButtonVariant } from "@/features/common/components/ui/button/variants";
import { X, Edit, Trash } from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  id: number;
  categoryName: string;
}

interface CategoryProps {
  selectedCategory: string;
  onCategorySelect: (categoryName: string) => void;
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
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  useEffect(() => {
    if (currentShopId) fetchCategories();
  }, [currentShopId]);

  const fetchCategories = async () => {
    if (!currentShopId) return;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/category/${currentShopId}/select`
      );
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories([
        { id: 0, categoryName: "전체" },
        ...(Array.isArray(data) ? data : data.data || []),
      ]);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleLongPressStart = (category: Category) => {
    const timer = setTimeout(() => {
      setIsEditMode(true);
      if (category.id !== 0) setEditingCategory(category);
    }, 1000);
    setLongPressTimer(timer);
  };

  const handleLongPressEnd = (category: Category) => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    if (isEditMode && category.id !== 0) {
      setIsActionModalOpen(true);
    } else {
      onCategorySelect(category.categoryName);
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
      <div className="fixed transform -translate-x-1/2 w-[764px] h-[60px] mx-auto mt-[20px]">
        <div className="flex gap-[12px]">
          {categories.map((category) => (
            <div
              key={category.id}
              className="relative"
              onMouseDown={() => handleLongPressStart(category)}
              onMouseUp={() => handleLongPressEnd(category)}
              onMouseLeave={() => handleLongPressEnd(category)}
              onTouchStart={() => handleLongPressStart(category)}
              onTouchEnd={() => handleLongPressEnd(category)}
            >
              <Button
                variant={
                  (selectedCategory === category.categoryName
                    ? "orange"
                    : "orangeBorder") as ButtonVariant
                }
                className={cn(
                  "w-[85px] h-[60px] rounded-[15px] font-bold text-xl",
                  isEditMode && "animate-shake"
                )}
              >
                {category.categoryName}
              </Button>
            </div>
          ))}
          <Button
            onClick={() => setIsActionModalOpen(true)}
            variant="orangeBorder"
            className="w-[85px] h-[60px] font-bold text-xl"
          >
            +
          </Button>
        </div>
      </div>

      <Modal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
      >
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-bold">카테고리 관리</h2>
          <p className="mt-2">
            {editingCategory?.categoryName} 카테고리를 수정하거나 삭제할 수
            있습니다.
          </p>
          <div className="flex gap-4 justify-center mt-4">
            <Button
              onClick={() => console.log("수정 기능 추가 예정")}
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
    </>
  );
};

export default CreateCategory;
