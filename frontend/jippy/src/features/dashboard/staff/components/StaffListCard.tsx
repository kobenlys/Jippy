"use client";

import useStaffList from "@/features/dashboard/staff/hooks/useStaffManagement";
import { Users } from "lucide-react";
import { StaffInfo, UpdateStaffRequest } from "../types/staff";
import { useState } from "react";
import staffApi from "../hooks/staffApi";
import StaffEditModal from "./StaffEditModal";
import { Card } from "@/features/common/components/ui/card/Card";

interface StaffListCardProps {
  storeId: number;
}

const StaffListCard = ({ storeId }: StaffListCardProps) => {
  const { data: staffList, isLoading, refreshList } = useStaffList(storeId);
  const [selectedStaff, setSelectedStaff] = useState<StaffInfo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) return null;

  const handleStaffClick = (staff: StaffInfo) => {
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
      throw error;
    }
  };

  const handleDeleteStaff = async (staffId: number) => {
    try {
      await staffApi.deleteStaff(storeId, staffId);
      refreshList();
    } catch (error) {
      throw error;
    }
  };

  const getStaffTypeDisplay = (type: string) => {
    switch (type) {
      case "MANAGER":
        return "매니저";
      case "STAFF":
        return "직원";
      default:
        return type;
    }
  };

  if (!staffList || staffList.length === 0) {
    return (
      <Card className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-[#3D3733] mb-4">
            직원 목록
          </h2>
          <div className="py-12 flex flex-col items-center justify-center text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mb-4 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="text-center mb-1">등록된 직원이 없습니다.</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#3D3733]">직원 목록</h2>
            <div className="flex items-center gap-2">
              <span className="mr-2 px-2 py-1 bg-[#F27B39]/10 text-jippy-orange rounded-full text-[15px]">
                총 {staffList.length}명
              </span>
              <Users className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="max-h-[280px] overflow-y-auto pr-4">
              <table className="w-full">
                <thead className="sticky top-0 bg-white z-10 shadow-[0px_1px_0px_0px_rgba(0,0,0,0.1)]">
                  <th className="py-3 text-left text-[15px] font-medium text-gray-500 pl-2">
                    이름
                  </th>
                  <th className="py-3 text-left text-[15px] font-medium text-gray-500">
                    직원 구분
                  </th>
                  <th className="py-3 text-right text-[15px] font-medium text-gray-500">
                    급여
                  </th>
                  <th className="py-3 text-right text-[15px] font-medium text-gray-500 pr-2">
                    급여 타입
                  </th>
                </thead>
                <tbody>
                  {staffList.map((staff) => (
                    <tr
                      key={staff.staffId}
                      onClick={() => handleStaffClick(staff)}
                      className="border-b border-gray-50 hover:bg-gray-50/80 transition-colors cursor-pointer"
                    >
                      <td className="py-4 font-medium pl-2">
                        {staff.staffName}
                      </td>
                      <td className="py-4">
                        <span
                          className={`px-2 py-1 rounded-full
                        ${
                          staff.staffType === "MANAGER"
                            ? "bg-blue-50 text-blue-500"
                            : "bg-gray-100 text-gray-500"
                        }`}
                        >
                          {getStaffTypeDisplay(staff.staffType)}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        {staff.staffSalary.toLocaleString()}원
                      </td>
                      <td className="py-4 text-right pr-2">
                        {staff.staffSalaryType}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Card>

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
