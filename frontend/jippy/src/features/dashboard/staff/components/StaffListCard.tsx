"use client";

import useStaffList from "@/features/dashboard/staff/hooks/useStaffManagement";
import LoadingSpinner from "@/features/common/components/ui/LoadingSpinner";
import { Users } from "lucide-react";
import { StaffInfo, UpdateStaffRequest } from "../types/staff";
import { useState } from "react";
import staffApi from "../hooks/staffApi";
import StaffEditModal from "./StaffEditModal";

interface StaffListCardProps {
  storeId: number;
}

const StaffListCard = ({ storeId }: StaffListCardProps) => {
  const {
    data: staffList,
    isLoading,
    error,
    refreshList,
  } = useStaffList(storeId);
  const [selectedStaff, setSelectedStaff] = useState<StaffInfo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>에러 발생: {error.message}</div>;
  if (!staffList) return <div>데이터가 없습니다.</div>;

  const handleStaffClick = (staff: StaffInfo) => {
    console.log("Selectd staff:", staff);
    setSelectedStaff(staff);
    setIsModalOpen(true);
  };

  const handleUpdateStaff = async (
    staffId: number,
    updates: UpdateStaffRequest
  ) => {
    try {
      await staffApi.updateStaff(storeId, staffId, updates);
      refreshList();
    } catch (error) {
      console.error("Failed to update staff:", error);
      throw error;
    }
  };

  const handleDeleteStaff = async (staffId: number) => {
    try {
      await staffApi.deleteStaff(storeId, staffId);
      refreshList();
    } catch (error) {
      console.error("Failed to delete staff:", error);
      throw error;
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">직원 목록</h2>
            <Users className="w-5 h-5 text-gray-500" />
          </div>
        </div>

        <div className="p-4 space-y-4">
          {staffList.map((staff) => (
            <div
              key={staff.staffId}
              className="p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleStaffClick(staff)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{staff.staffName}</h3>
                  <p className="text-sm text-gray-600">{staff.staffType}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {staff.staffSalary.toLocaleString()}원
                  </p>
                  <p className="text-sm text-gray-600">
                    {staff.staffSalaryType}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedStaff && (
        <StaffEditModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          staff={selectedStaff}
          onUpdate={handleUpdateStaff}
          onDelete={handleDeleteStaff}
        />
      )}
    </>
  );
};

export default StaffListCard;
