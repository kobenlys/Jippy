"use client";

import { useWorkingStaff } from "../hooks/useStaffStatistic";
import LoadingSpinner from "@/features/common/components/ui/LoadingSpinner";
import { Users } from "lucide-react";

interface WorkingStaffCardProps {
  storeId: number;
}

const WorkingStaffCard = ({ storeId }: WorkingStaffCardProps) => {
  const { data, isLoading, error } = useWorkingStaff(storeId);

  if (isLoading) return <LoadingSpinner />;
  if (error) return null;
  if (!data) return null;

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">현재 근무 현황</h2>
        <Users className="w-6 h-6 text-blue-500" />
      </div>

      <div className="mb-4">
        <p className="text-3xl font-bold">{data.totalCount}명</p>
        <p className="text-sm text-gray-600">현재 근무 중</p>
      </div>

      {data.staffList.length > 0 && (
        <div className="space-y-2">
          {data.staffList.map((staff) => (
            <div key={staff.storeUserStaffId} className="text-sm text-gray-700">
              {staff.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkingStaffCard;
