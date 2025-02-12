"use client";

import React, { useEffect, useState } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  ApiResponse,
  StaffScheduleData,
  TimeSlot,
} from "@/features/calendar/types/calendar";
import PageTitle from "@/components/layout/title/PageTitle";
import CalendarGrid from "@/features/calendar/components/GalendarGrid";
import CalendarHeader from "@/features/calendar/components/CalendarHeader";

export default function CalendarPage() {
  const [scheduleData, setScheduleData] = useState<StaffScheduleData | null>(
    null
  );
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const days = ["일", "월", "화", "수", "목", "금", "토"] as const;

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setIsLoading(true);

        // redux 구축 후 교체 필요!!!
        const storeId = 1;
        const staffId = 1;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/calendar/${storeId}/select/${staffId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        const responseData: ApiResponse = await response.json();

        if (!responseData.success) {
          if (responseData.code === "C-006") {
            setError("등록된 스케줄이 없습니다.");
            return;
          }
          throw new Error(
            responseData.message || "스케줄을 불러오는데 실패했습니다."
          );
        }

        setScheduleData(responseData.data);

        // 시간 범위 계산
        const schedules = responseData.data.schedules;
        let minHour = Math.min(
          ...schedules.map((s) => parseInt(s.startTime.split(":")[0]))
        );
        let maxHour = Math.max(
          ...schedules.map((s) => {
            const endHour = parseInt(s.endTime.split(":")[0]);
            return endHour === 0 ? 24 : endHour;
          })
        );

        minHour = Math.max(0, minHour - 1);
        maxHour = Math.min(24, maxHour);

        // 시간 슬롯 생성
        const slots: TimeSlot[] = Array.from(
          { length: maxHour - minHour + 1 },
          (_, i) => {
            const hour = i + minHour;
            return {
              time:
                hour === 0
                  ? "12"
                  : hour === 12
                  ? "12"
                  : hour > 12
                  ? String(hour - 12)
                  : String(hour),
              format: hour >= 12 ? (hour === 24 ? "AM" : "PM") : "AM",
              originalHour: hour,
            };
          }
        );

        setTimeSlots(slots);
      } catch (error) {
        setError("스케줄을 불러오는데 실패했습니다.");

        // 개발 환경에서만 에러 console에 출력
        if (process.env.NODE_ENV === "development") {
          console.error("스케줄 로딩 실패: ", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  // 첫 시간 슬롯 기준 위치 계산
  const calculateEventPosition = (hour: number) => {
    const firstHour = timeSlots[0]?.originalHour ?? 0;
    return (hour - firstHour) * 40;
  };

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="h-full">
        <PageTitle />
        <div className="text-gray-600 text-center p-8">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <PageTitle />
      <CalendarHeader days={days} />
      <CalendarGrid
        days={days}
        timeSlots={timeSlots}
        scheduleData={scheduleData}
        calculateEventPosition={calculateEventPosition}
      />
    </div>
  );
}
