"use client";

import { Notice } from "../types/notifications";

interface NoticeDetailModalProps {
  notice: Notice;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (notice: Notice) => void;
  onDelete: (noticeId: number) => void;
}

const NoticeDetailModal = ({
  notice,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: NoticeDetailModalProps) => {
  if (!isOpen) return null;

  const handleDelete = () => {
    if (confirm("정말 삭제하시겠습니까?")) {
      onDelete(notice.noticeId);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[600px] max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-start p-6 pb-0">
          <h2 className="text-xl font-bold">{notice.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl ml-4"
          >
            ×
          </button>
        </div>
        <div className="p-6 pt-2">
          <div className="text-sm text-gray-500 pb-4 border-b mb-4">
            {notice.author} · {notice.createdAt}
          </div>
          <div className="whitespace-pre-wrap mb-6">{notice.content}</div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button
              onClick={() => onEdit(notice)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              수정하기
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              삭제하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeDetailModal;
