'use client'

import PageTitle from "@/features/common/components/layout/title/PageTitle";
import {
    ApiResponse,
    Feedback
} from "@/features/feedback/types/feedback";
import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

const FeedbackPage = () => {
    // redux 구현 시 변경
    const storeId = 1;
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showScrollTop, setShowScrollTop] = useState(true);

    const fetchFeedbacks = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feedback/${storeId}/select`);

            const responseData : ApiResponse<Feedback[]> = await response.json();

            if (!responseData.success) {
                throw new Error(
                    responseData.message || "피드백을 불러오는데 실패했습니다."
                );
            }

            setFeedbacks(responseData.data);
        } catch (error) {
            setError("피드백을 불러오는데 실패했습니다");
            console.error("피드백 로딩 실패: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedbacks();

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
                    <div className="bg-white rounded-lg shadow p-6 flex flex-col h-[640px]">
                        <h1 className="text-[24px] font-bold text-black pb-3">💬 피드백</h1>
                        <div className="flex justify-center items-center h-full">로딩중...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div id="page-top">
                <PageTitle />
                <div className="p-4 text-center text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <>
            <div id="page-top">
                <PageTitle />
                <div className="p-4">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h1 className="text-[24px] font-bold text-black pb-3">💬 피드백</h1>

                        {isLoading ? (
                            <div className="flex justify-center items-center py-8">로딩중...</div>
                        ) : error ? (
                            <div className="text-center text-red-500">{error}</div>
                        ) : feedbacks.length > 0 ? (
                            <div>
                                {feedbacks.map((feedback) => (
                                    <div key={feedback.id} className="border-b py-3 last:border-b-0">
                                        <div className="hover:bg-gray-50 transition-colors p-2">
                                            <div className="flex justify-between items-center">
                                                <div className="flex-1">
                                                    <p className="font-medium">{feedback.content}</p>
                                                    <p className="text-sm text-gray-500">{feedback.createdAt}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">등록된 피드백이 없습니다.</div>
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
        </>
    );
}

export default FeedbackPage;