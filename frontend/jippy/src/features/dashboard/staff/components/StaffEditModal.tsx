import { useState } from "react";
import {
  SalaryType,
  StaffInfo,
  StaffType,
  UpdateableStaffType,
  UpdateStaffRequest,
} from "../types/staff";

interface StaffEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: StaffInfo;
  onUpdate: (staffId: number, data: UpdateStaffRequest) => Promise<void>;
  onDelete: (staffId: number) => Promise<void>;
}

const StaffEditModal = ({
  isOpen,
  onClose,
  staff,
  onUpdate,
  onDelete,
}: StaffEditModalProps) => {
  const [staffType, setStaffType] = useState<UpdateableStaffType>(
    staff.staffType === "OWNER" ? "STAFF" : staff.staffType
  );
  const [salary, setSalary] = useState(staff.staffSalary);
  const [salaryType, setSalaryType] = useState<SalaryType>(
    staff.staffSalaryType
  );
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const updates: UpdateStaffRequest = {};
    if (staffType !== staff.staffType) updates.staffType = staffType;
    if (salary !== staff.staffSalary) updates.staffSalary = salary;
    if (salaryType !== staff.staffSalaryType)
      updates.staffSalaryType = salaryType;

    try {
      await onUpdate(staff.storeUserStaffId, updates);
      onClose();
    } catch (error) {
      console.error("Failed to update staff:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    setIsLoading(true);
    try {
      await onDelete(staff.storeUserStaffId);
      onClose();
    } catch (error) {
      console.error("Failed to delete staff:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">직원 정보 수정</h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* 이름 (수정 불가) */}
            <div>
              <label className="block text-sm font-medium mb-1">이름</label>
              <input
                type="text"
                value={staff.staffName}
                disabled
                className="w-full p-2 border rounded bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                직원 유형
              </label>
              <select
                value={staffType}
                onChange={(e) =>
                  setStaffType(e.target.value as UpdateableStaffType)
                }
                className="w-full p-2 border rounded"
                disabled={staff.staffType === "OWNER"}
              >
                <option value="STAFF">일반 직원</option>
                <option value="MANAGER">매니저</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">급여</label>
              <input
                type="number"
                value={salary}
                onChange={(e) => setSalary(Number(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                급여 유형
              </label>
              <select
                value={salaryType}
                onChange={(e) => setSalaryType(e.target.value as SalaryType)}
                className="w-full p-2 border rounded"
              >
                <option value="시급">시급</option>
                <option value="월급">월급</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 text-red-600 hover:text-red-700"
              disabled={isLoading}
            >
              삭제
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-700"
              disabled={isLoading}
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={isLoading}
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffEditModal;
