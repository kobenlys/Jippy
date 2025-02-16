"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
  ApiResponse,
  NoticeResponse,
  NoticeRequest,
} from "@/features/notifications/types/notifications";
import PageTitle from "@/features/common/components/layout/title/PageTitle";
import { useRouter } from "next/navigation";

const NotificationsPage = () => {
  const router = useRouter();
  const [notices, setNotices] = useState<NoticeResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== "undefined") {
      const savedPage = sessionStorage.getItem("noticePage");
      return savedPage ? parseInt(savedPage) : 0;
    }
    return 0;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const fetchNotices = useCallback(async () => {
    const now = new Date();
    // redux 구현 시 변경
    const owner_name = "한승남";
    const store_id = 1;

    const params: NoticeRequest = {
      page: currentPage,
      pageSize: 7,
      sortBy: "createdAt",
      direction: "DESC",
      author: owner_name,
      startDate: "2025-02-01 00:00:00",
      endDate: now.toISOString().split("T")[0] + " 23:59:59",
    };

    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/notice/${store_id}/select`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(params),
        }
      );

      const responseData: ApiResponse<NoticeResponse> = await response.json();

      if (!responseData.success) {
        if (responseData.code === "C-006") {
          setError("등록된 공지사항이 없습니다.");
          return;
        }
        throw new Error(
          responseData.message || "공지사항을 불러오는데 실패했습니다."
        );
      }

      setNotices(responseData.data);
    } catch (error) {
      setError("공지사항을 불러오는데 실패했습니다.");

      if (process.env.NODE_ENV === "development") {
        console.error("공지사항 로딩 실패: ", error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  useEffect(() => {
    if (!isLoading && notices) {
      const returnToScroll = sessionStorage.getItem("returnToScroll");
      if (returnToScroll) {
        setTimeout(() => {
          window.scrollTo({
            top: parseInt(returnToScroll),
            behavior: "instant",
          });
        }, 0);
        sessionStorage.removeItem("returnToScroll");
      }
    }
  }, [isLoading, notices, fetchNotices]);

  const handleNoticeClick = (noticeId: number) => {
    const scrollPosition =
      window.pageYOffset || document.documentElement.scrollTop;
    sessionStorage.setItem("noticeScrollPosition", scrollPosition.toString());
    sessionStorage.setItem("noticePage", currentPage.toString());
    router.push(`/notifications/${noticeId}`);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    sessionStorage.setItem("noticePage", newPage.toString());
  };

  if (isLoading) {
    return (
      <div>
        <PageTitle />
        <div className="p-4">
          <div
            className="bg-white rounded-lg shadow p-6 flex flex-col h-[640px]"
            ref={listRef}
          >
            <h1 className="text-[24px] font-bold text-black pb-3">
              📢 공지사항
            </h1>
            {notices && notices.content.length > 0 ? (
              <>
                <div className="flex justify-center gap-4 mt-auto pt-4">
                  <button
                    className="px-4 py-2 border border-[#ff5c00] text-[#ff5c00] rounded disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-[#ff5c00] hover:bg-[#ff5c00] hover:text-white transition-colors"
                    onClick={() =>
                      handlePageChange(Math.max(0, currentPage - 1))
                    }
                    disabled={notices.isFirst}
                  >
                    이전
                  </button>
                  <p className="py-2">
                    <span className="text-[#ff5c00] font-medium">
                      {currentPage + 1}
                    </span>{" "}
                    / {notices.totalPages}
                  </p>
                  <button
                    className="px-4 py-2 border border-[#ff5c00] text-[#ff5c00] rounded disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-[#ff5c00] hover:bg-[#ff5c00] hover:text-white transition-colors"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={notices.isLast}
                  >
                    다음
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center">공지사항이 없습니다.</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageTitle />
        <div className="p-4 text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <PageTitle />
      <div className="p-4">
        <div
          className="bg-white rounded-lg shadow p-6 flex flex-col h-[640px]"
          ref={listRef}
        >
          <h1 className="text-[24px] font-bold text-black pb-3">📢 공지사항</h1>
          {notices && notices.content.length > 0 ? (
            <>
              <div className="scrollbar-custom overflow-y-auto flex-grow">
                {notices.content.map((notice) => (
                  <div
                    key={notice.noticeId}
                    className="border-b py-3 last:border-b-0"
                  >
                    <div
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleNoticeClick(notice.noticeId)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{notice.title}</p>
                          <p className="text-sm text-gray-300">
                            {notice.createdAt}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600">{notice.author}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-4 mt-auto pt-4">
                <button
                  className="px-4 py-2 border border-[#ff5c00] text-[#ff5c00] rounded disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-[#ff5c00] hover:bg-[#ff5c00] hover:text-white transition-colors"
                  onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
                  disabled={notices.isFirst}
                >
                  이전
                </button>
                <p className="py-2">
                  <span className="text-[#ff5c00] font-medium">
                    {currentPage + 1}
                  </span>{" "}
                  / {notices.totalPages}
                </p>
                <button
                  className="px-4 py-2 border border-[#ff5c00] text-[#ff5c00] rounded disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-[#ff5c00] hover:bg-[#ff5c00] hover:text-white transition-colors"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={notices.isLast}
                >
                  다음
                </button>
              </div>
            </>
          ) : (
            <div className="text-center">공지사항이 없습니다.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
