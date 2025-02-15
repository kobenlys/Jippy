// components/ScheduleCreateModal.tsx
import { useEffect, useState } from "react";
import { DAYS_OF_WEEK } from "@/features/calendar/types/calendar";
import { StaffInfo } from "@/features/dashboard/staff/types/staff";
import staffApi from "../hooks/staffApi";
import { X } from "lucide-react";

interface ScheduleInput {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

interface ScheduleCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeId: number;
  staffList: StaffInfo[];
  onSuccess: () => void;
}

const DEFAULT_SCHEDULE: ScheduleInput = {
  dayOfWeek: DAYS_OF_WEEK[0],
  startTime: "09:00",
  endTime: "18:00",
};

const ScheduleCreateModal = ({
  isOpen,
  onClose,
  storeId,
  staffList,
  onSuccess,
}: ScheduleCreateModalProps) => {
  const [selectedStaffId, setSelectedStaffId] = useState<number>(0);
  const [schedules, setSchedules] = useState<ScheduleInput[]>([
    DEFAULT_SCHEDULE,
  ]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedStaffId(0);
      setSchedules([DEFAULT_SCHEDULE]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStaffId === 0) {
      alert("직원을 선택해주세요.");
      return;
    }

    try {
      await staffApi.createSchedule(storeId, selectedStaffId, {
        schedules,
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("스케줄 등록 실패:", error);
      alert("스케줄 등록에 실패했습니다.");
    }
  };

  const addSchedule = () => {
    setSchedules([...schedules, { ...DEFAULT_SCHEDULE }]);
  };

  const removeSchedule = (index: number) => {
    setSchedules(schedules.filter((_, i) => i !== index));
  };

  const updateSchedule = (
    index: number,
    field: keyof ScheduleInput,
    value: string
  ) => {
    const newSchedules = [...schedules];
    newSchedules[index] = { ...newSchedules[index], [field]: value };
    setSchedules(newSchedules);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[600px] max-h-[80vh] overflow-y-auto">
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

          {/* 스케줄 목록 */}
          {schedules.map((schedule, index) => (
            <div key={index} className="p-4 border rounded-lg relative">
              {schedules.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSchedule(index)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                  <X size={16} />
                </button>
              )}

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    요일
                  </label>
                  <select
                    value={schedule.dayOfWeek}
                    onChange={(e) =>
                      updateSchedule(index, "dayOfWeek", e.target.value)
                    }
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  >
                    {DAYS_OF_WEEK.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    시작 시간
                  </label>
                  <input
                    type="time"
                    value={schedule.startTime}
                    onChange={(e) =>
                      updateSchedule(index, "startTime", e.target.value)
                    }
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
                    value={schedule.endTime}
                    onChange={(e) =>
                      updateSchedule(index, "endTime", e.target.value)
                    }
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
              </div>
            </div>
          ))}

          {/* 스케줄 추가 버튼 */}
          <button
            type="button"
            onClick={addSchedule}
            className="w-full px-4 py-2 text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-50"
          >
            + 스케줄 추가
          </button>

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
