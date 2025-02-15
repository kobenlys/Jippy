// components/ScheduleCreateModal.tsx
import { useState } from "react";
import { DAYS_OF_WEEK } from "@/features/calendar/types/calendar";
import { StaffInfo } from "@/features/dashboard/staff/types/staff";
import staffApi from "../hooks/staffApi";

interface ScheduleCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeId: number;
  staffList: StaffInfo[];
  onSuccess: () => void;
}

const ScheduleCreateModal = ({
  isOpen,
  onClose,
  storeId,
  staffList,
  onSuccess,
}: ScheduleCreateModalProps) => {
  const [selectedStaffId, setSelectedStaffId] = useState<number>(0);
  const [dayOfWeek, setDayOfWeek] = useState<string>(DAYS_OF_WEEK[0]);
  const [startTime, setStartTime] = useState<string>("09:00");
  const [endTime, setEndTime] = useState<string>("18:00");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await staffApi.createSchedule(storeId, selectedStaffId, {
        schedules: [
          {
            dayOfWeek,
            startTime,
            endTime,
          },
        ],
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("스케줄 등록 실패:", error);
      alert("스케줄 등록에 실패했습니다.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-[480px]">
        <h2 className="text-lg font-semibold mb-4">근무 스케줄 등록</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 직원 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              직원 선택
            </label>
            <select
              value={selectedStaffId}
              onChange={(e) => setSelectedStaffId(Number(e.target.value))}
              className="w-full border rounded-lg px-3 py-2"
              required
            >
              <option value={0}>직원을 선택하세요</option>
              {staffList.map((staff) => (
                <option
                  key={staff.storeUserStaffId}
                  value={staff.storeUserStaffId}
                >
                  {staff.staffName} ({staff.staffType})
                </option>
              ))}
            </select>
          </div>

          {/* 요일 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              요일 선택
            </label>
            <select
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              required
            >
              {DAYS_OF_WEEK.map((day) => (
                <option key={day} value={day}>
                  {day}요일
                </option>
              ))}
            </select>
          </div>

          {/* 시간 선택 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                시작 시간
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                종료 시간
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              등록
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleCreateModal;
