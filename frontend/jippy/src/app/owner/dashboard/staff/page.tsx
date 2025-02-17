"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StaffAttendanceList from "@/features/dashboard/staff/components/StaffAttendanceList";
import StaffListCard from "@/features/dashboard/staff/components/StaffListCard";
import StaffPerformanceCard from "@/features/dashboard/staff/components/StaffPerformanceCard";
import StaffScheduleCard from "@/features/dashboard/staff/components/StaffScheduleCard";
import StoreSalaryCard from "@/features/dashboard/staff/components/StoreSalaryCard";
import WorkingStaffCard from "@/features/dashboard/staff/components/WorkingStaffCard";
import NoticeList from "@/features/notifications/components/NoticeList";
import TodoList from "@/features/todo/components/TodoList";
import LoadingSpinner from "@/features/common/components/ui/LoadingSpinner";
import ScheduleChangeList from "@/features/dashboard/staff/components/ScheduleChangeList";

const getCookieValue = (key: string) => {
  return (
    document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith(`${key}=`))
      ?.split("=")[1] ?? null
  );
};

const StaffDashboardPage = () => {
  const [storeId, setStoreId] = useState<number | null>(null);
  const [ownerName, setOwnerName] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    if (typeof document !== "undefined") {
      const parsedStoreId = Number(getCookieValue("selectStoreId"));
      const ownerName = getCookieValue("userName");
      const decodedName = ownerName ? decodeURIComponent(ownerName) : "";

      if (!parsedStoreId || isNaN(parsedStoreId)) {
        router.push("/owner/dashboard");
      } else {
        setStoreId(parsedStoreId);
        setOwnerName(decodedName);
      }
    }
  }, [router]);

  // useEffect(() => {
  // }, [storeId]);

  // useEffect(() => {
  // }, [ownerName]);

  if (storeId === null) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">인적 관리</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StaffPerformanceCard storeId={storeId} />
        <WorkingStaffCard storeId={storeId} />
        <StaffAttendanceList storeId={storeId} />
        <StoreSalaryCard storeId={storeId} />
      </div>
      <div className="mt-8">
        <StaffListCard storeId={storeId} />
      </div>
      <div className="mt-8">
        <StaffScheduleCard storeId={storeId} />
      </div>
      <div className="mt-8">
        <ScheduleChangeList storeId={storeId} />
      </div>
      <div className="mt-8">
        <NoticeList storeId={storeId} ownerName={ownerName} />
      </div>
      <div className="mt-8">
        <TodoList storeId={storeId} />
      </div>
    </div>
  );
};

export default StaffDashboardPage;
