"use client";

import { useState } from "react";
import TodoItem from "./TodoItem";
import LoadingSpinner from "@/features/common/components/ui/LoadingSpinner";
import { ChevronUp } from "lucide-react";
import useTodoList from "../hooks/useTodo";

interface TodoListProps {
  storeId: number;
}

const TodoList = ({ storeId }: TodoListProps) => {
  const [showInput, setShowInput] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);

  const { todos, isLoading, error, handleToggle, handleDelete, handleAddTodo } =
    useTodoList({
      storeId,
      onScrollChange: (scrolled) => setShowScrollTop(scrolled),
    });

  const onAddTodo = async () => {
    if (!newTodoTitle.trim()) return;

    const success = await handleAddTodo(newTodoTitle);
    if (success) {
      setNewTodoTitle("");
      setShowInput(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">할 일 목록</h2>
        <button
          onClick={() => setShowInput(!showInput)}
          className="w-8 h-8 flex items-center justify-center text-2xl text-[#ff5c00] font-bold rounded hover:bg-orange-50"
        >
          +
        </button>
      </div>

      {showInput && (
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            placeholder="할 일을 입력하세요"
            className="flex-1 p-2 border rounded focus:outline-none focus:border-[#ff5c00]"
            onKeyPress={(e) => e.key === "Enter" && onAddTodo()}
          />
          <button
            onClick={onAddTodo}
            className="px-4 py-2 bg-[#ff5c00] text-white rounded hover:bg-[#ff4400]"
          >
            추가
          </button>
        </div>
      )}

      <div className="space-y-2">
        {todos.length > 0 ? (
          todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="text-center text-gray-500 py-4">
            등록된 할 일이 없습니다.
          </div>
        )}
      </div>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-10 h-10 bg-[#ff5c00] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#ff7c33] transition-all"
          aria-label="맨 위로 스크롤"
        >
          <ChevronUp size={20} />
        </button>
      )}
    </div>
  );
};

export default TodoList;
