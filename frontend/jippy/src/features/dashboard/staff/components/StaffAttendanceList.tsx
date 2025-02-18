"use client";

import React, { useState } from "react";
import StaffAttendanceCard from "./StaffAttendanceCard";
import LoadingSpinner from "@/features/common/components/ui/LoadingSpinner";
import { AlertTriangle, ChevronDown } from "lucide-react";
import useStaffList from "../hooks/useStaffManagement";

interface StaffAttendanceListProps {
  storeId: number;
}

const StaffAttendanceList = ({ storeId }: StaffAttendanceListProps) => {
  const { data: staffList, isLoading, error } = useStaffList(storeId);
  const [openStaffId, setOpenStaffId] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
        <AlertTriangle className="h-4 w-4" />
        <p>직원 목록을 불러오는데 실패했습니다. 다시 시도해주세요.</p>
      </div>
    );
  }

  if (!staffList?.length) {
    return (
      <div className="p-4 bg-gray-50 text-gray-700 rounded-lg">
        <p>등록된 직원이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 w-full">
      {staffList.map((staff) => (
        <div
          key={staff.staffId}
          className="border rounded-lg overflow-hidden bg-white"
        >
          <button
            onClick={() =>
              setOpenStaffId(
                openStaffId === staff.staffId ? null : staff.staffId
              )
            }
            className="w-full px-4 py-3 flex justify-between items-center hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="font-medium">{staff.staffName}</span>
              <span className="text-sm px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                {staff.staffType === "MANAGER" ? "매니저" : "직원"}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {staff.staffSalaryType === "시급"
                  ? `시급 ${staff.staffSalary.toLocaleString()}원`
                  : `월급 ${staff.staffSalary.toLocaleString()}원`}
              </span>
              <ChevronDown
                className={`h-5 w-5 text-gray-500 transition-transform ${
                  openStaffId === staff.staffId ? "transform rotate-180" : ""
                }`}
              />
            </div>
          </button>
          <div
            className={`transition-all duration-200 ease-in-out ${
              openStaffId === staff.staffId
                ? "max-h-[500px] opacity-100"
                : "max-h-0 opacity-0 overflow-hidden"
            }`}
          >
            <div className="p-4 border-t">
              <StaffAttendanceCard storeId={storeId} staffId={staff.staffId} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StaffAttendanceList;
