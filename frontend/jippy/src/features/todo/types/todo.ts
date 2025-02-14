export interface Todo {
    id: number;
    storeId: number;
    title: string;
    createdAt: string;
    complete: boolean;
}

export interface TodoItemProps {
    todo: Todo;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
}