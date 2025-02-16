"use client";

import useNoticeList from "../hooks/useNotice";
import LoadingSpinner from "@/features/common/components/ui/LoadingSpinner";
import NoticePagination from "@/features/notifications/components/NoticePagination";
import NoticeFormModal from "./NoticeFormModal";
import { useState } from "react";
import { Notice } from "../types/notifications";
import noticeApi from "../hooks/noticeApi";
import NoticeDetailModal from "./NoticeDetailModal";

interface NoticeListProps {
  storeId: number;
  ownerName: string;
}

const NoticeList = ({ storeId, ownerName }: NoticeListProps) => {
  const { notices, isLoading, error, handlePageChange, refreshNotices } =
    useNoticeList({
      storeId,
      ownerName,
      pageSize: 5,
    });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  const handleNoticeClick = (notice: Notice) => {
    setSelectedNotice(notice);
  };

  const handleDelete = async (noticeId: number) => {
    try {
      await noticeApi.deleteNotice(storeId, noticeId);
      setSelectedNotice(null);
      refreshNotices();
    } catch (error) {
      console.error("공지사항 삭제 실패:", error);
      alert("공지사항 삭제에 실패했습니다.");
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return null;

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">공지사항</h2>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-[#ff5c00] text-white rounded-lg hover:bg-[#ff5c00]/90"
          >
            + 공지사항 등록
          </button>
        </div>
      </div>

      <div className="p-4">
        {notices?.content && notices.content.length > 0 ? (
          <>
            <div className="space-y-2">
              {notices.content.map((notice) => (
                <div
                  key={notice.noticeId}
                  className="p-3 rounded-lg border hover:border-[#ff5c00] transition-colors cursor-pointer"
                  onClick={() => handleNoticeClick(notice)}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium line-clamp-1">
                      {notice.title}
                    </span>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span>{notice.createdAt.split(" ")[0]}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {notices && (
              <NoticePagination
                currentPage={notices.page}
                totalPages={notices.totalPages}
                isFirst={notices.isFirst}
                isLast={notices.isLast}
                onPageChange={handlePageChange}
              />
            )}
          </>
        ) : (
          <div className="text-center text-gray-500 py-4">
            등록된 공지사항이 없습니다.
          </div>
        )}
      </div>

      <NoticeFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        storeId={storeId}
        ownerName={ownerName}
        onSuccess={() => {
          refreshNotices();
          setIsCreateModalOpen(false);
        }}
      />

      {selectedNotice && (
        <NoticeDetailModal
          notice={selectedNotice}
          isOpen={!!selectedNotice}
          onClose={() => setSelectedNotice(null)}
          onEdit={(notice) => {
            setEditingNotice(notice);
            setSelectedNotice(null);
          }}
          onDelete={handleDelete}
        />
      )}

      {editingNotice && (
        <NoticeFormModal
          isOpen={!!editingNotice}
          onClose={() => setEditingNotice(null)}
          storeId={storeId}
          ownerName={ownerName}
          initialData={editingNotice}
          onSuccess={() => {
            refreshNotices();
            setEditingNotice(null);
          }}
        />
      )}
    </div>
  );
};

export default NoticeList;
