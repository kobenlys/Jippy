"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StaffAttendanceList from "@/features/dashboard/staff/components/StaffAttendanceList";
import StaffListCard from "@/features/dashboard/staff/components/StaffListCard";
import StaffScheduleCard from "@/features/dashboard/staff/components/StaffScheduleCard";
import StoreSalaryCard from "@/features/dashboard/staff/components/StoreSalaryCard";
import WorkingStaffCard from "@/features/dashboard/staff/components/WorkingStaffCard";

const StaffDashboardPage = () => {
  const [storeId, setStoreId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof document !== "undefined") {
      const cookieValue = document.cookie
        .split("; ")
        .find((cookie) => cookie.startsWith("selectStoreId="))
        ?.split("=")[1];

      const parsedStoreId = cookieValue ? parseInt(cookieValue, 10) : null;

      if (!parsedStoreId || isNaN(parsedStoreId)) {
        router.push("/shop");
      } else {
        setStoreId(parsedStoreId);
      }
    }
  }, [router]);

  if (storeId === null) {
    return null; // 로딩 중일 때 아무것도 표시하지 않음
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">인적 관리</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <WorkingStaffCard storeId={storeId} />
        <StaffAttendanceList storeId={storeId} />
        <StoreSalaryCard storeId={storeId} />
        {/* 여기에 추가 통계 카드들 */}
      </div>
      <div className="mt-8">
        <StaffListCard storeId={storeId} />
      </div>
      <div className="mt-8">
        <StaffScheduleCard storeId={storeId} />
      </div>
    </div>
  );
};

export default StaffDashboardPage;
