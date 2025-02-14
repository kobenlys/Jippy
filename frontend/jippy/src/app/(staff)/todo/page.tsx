'use client';

import PageTitle from "@/features/common/components/layout/title/PageTitle";
import { useEffect, useState } from "react";
import {
    Todo,
    TodoItemProps
} from "@/features/todo/types/todo";
import { ChevronUp } from "lucide-react";

const TodoItem = ({ todo, onToggle } : TodoItemProps) => {
    return (
        <div className="border-b py-3 last:border-b-0">
            <div className="cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={todo.complete}
                            onChange={() => onToggle(todo.id)}
                            className="h-4 w-4 accent-[#ff5c00]"
                        />
                        <span className={`font-medium ${todo.complete ? 'line-through text-gray-400' : ''}`}>
                            {todo.title}
                        </span>
                    </div>
                    <span className="text-sm text-gray-600">
                        {todo.createdAt.split(' ')[0]}
                    </span>
                </div>
            </div>
        </div>
    );
};


const TodoPage = () => {

    const [todos, setTodos] = useState<Todo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showInput, setShowInput] = useState(false);
    const [newTodoTitle, setNewTodoTitle] = useState('');
    const [showScrollTop, setShowScrollTop] = useState(true);

    const fetchTodos = async () => {
        try {
            setIsLoading(true);
            setError(null);
            // redux 구현 시 변경
            const storeId = 1;

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/todo/${storeId}/select`);

            if (!response.ok) {
                throw new Error('할 일 목록을 불러오는데 실패했습니다');
            }

            const data = await response.json();
            setTodos(data);
        } catch (error: unknown) {
            console.error('할 일 목록 로딩 실패:', error);
            setError('할 일 목록을 불러오는데 실패 했습니다');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTodos();

        const handleScroll = () => {
            if (typeof window !== 'undefined') {
                const scrollY = window.pageYOffset || document.documentElement.scrollTop;
                setShowScrollTop(scrollY > 200);
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', handleScroll, { passive: true });
            return () => window.removeEventListener('scroll', handleScroll);
        }
    }, []);

    const handleToggle = async (todoId: number) => {
        try {
            const storeId = 1;
            const todoToUpdate = todos.find(todo => todo.id === todoId);
            
            if (!todoToUpdate) return;
    
            setTodos(prevTodos => 
                prevTodos.map(todo =>
                    todo.id === todoId ? {...todo, complete: !todo.complete} : todo
                )
            );
    
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/todo/${storeId}/update/${todoId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: todoToUpdate.title,
                    complete: !todoToUpdate.complete
                }),
            });
    
            if (!response.ok) {
                setTodos(prevTodos => 
                    prevTodos.map(todo =>
                        todo.id === todoId ? {...todo, complete: todoToUpdate.complete} : todo
                    )
                );
                throw new Error('상태 업데이트에 실패했습니다');
            }
        } catch (error) {
            console.error('상태 업데이트 실패:', error);
            alert('상태 업데이트에 실패했습니다. 다시 시도해주세요.');
        }
    };

    const handleAddTodo = async () => {
        if (!newTodoTitle.trim()) return;

        try {
            // redux 구현 시 변경
            const storeId = 1;
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/todo/${storeId}/create`, {
                method : 'POST',
                headers : {
                    'Content-Type': 'application/json'
                },
                body : JSON.stringify({
                    title : newTodoTitle.trim(),
                    complete: false
                }),
            });

            if (!response.ok) {
                throw new Error('할 일 추가에 실패했습니다');
            }

            await fetchTodos();
            setNewTodoTitle('');
            setShowInput(false);
        } catch (error) {
            console.error('할 일 추가 실패:', error);
            alert('할 일 추가에 실패했습니다. 다시 시도해주세요.');
        }

    }

    const scrollToTop = () => {
        const element = document.getElementById('page-top');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    if (isLoading) {
        return (
            <div id="page-top">
                <PageTitle />
                <div className="p-4">
                    <div className="bg-white rounded-lg shadow p-6 flex flex-col h-[360px] justify-center items-center">
                        <p>로딩 중...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div id="page-top">
                <PageTitle />
                <div className="p-4">
                    <div className="bg-white rounded-lg shadow p-6 flex flex-col h-[360px] justify-center items-center">
                        <p className="text-red-500">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div id="page-top">
                <PageTitle />
                <div className="p-4">
                    <div className="bg-white rounded-lg shadow p-6 flex flex-col">
                        <div className="flex justify-between items-center pb-3">
                            <h1 className="text-[24px] font-bold text-black">📝 투두리스트</h1>
                            {/* <button 
                                onClick={() => setShowInput(!showInput)}
                                className="w-8 h-8 flex items-center justify-center text-[24px] text-[#ff5c00] font-bold rounded hover:bg-orange-50 transition-colors"
                            >
                                +
                            </button> */}
                        </div>

                        <div>
                            {showInput && (
                                <div className="mb-4 flex gap-2">
                                <input
                                    type="text"
                                    value={newTodoTitle}
                                    onChange={(e) => setNewTodoTitle(e.target.value)}
                                    placeholder="할 일을 입력하세요"
                                    className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-[#ff5c00]"
                                />
                                <button 
                                    onClick={handleAddTodo}
                                    className="px-4 py-2 bg-[#ff5c00] text-white rounded hover:bg-[#ff4400] transition-colors"
                                >
                                    확인
                                </button>
                            </div>
                            )}
                        </div>

                        <div>
                            {todos.length > 0 ? (
                                <>
                                    <div className="scrollbar-custom overflow-y-auto flex-grow">
                                        {todos.map(todo => (
                                            <TodoItem
                                                key={todo.id}
                                                todo={todo}
                                                onToggle={handleToggle}
                                            />
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="text-center">등록된 할 일이 없습니다.</div>
                            )}
                        </div>
                    </div>
                </div>

                <button 
                    onClick={scrollToTop}
                    className={`fixed bottom-32 right-8 w-12 h-12 bg-[#ff5c00] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#ff7c33] transition-all ${showScrollTop ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                    aria-label="맨 위로 스크롤"
                >
                    <ChevronUp size={24} />
                </button>
            </div>
        </>
    );
};

export default TodoPage;