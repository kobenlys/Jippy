import React, { useState, ChangeEvent } from "react";
import { StaffScheduleData } from "../types/calendar";

interface Schedule {
  id: string;
  dayOfWeek: string;
  day: string;
  time: string;
  startTime: string;
  endTime: string;
}

interface ScheduleChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheduleData: StaffScheduleData | null;
}

const ScheduleChangeModal: React.FC<ScheduleChangeModalProps> = ({
  isOpen,
  onClose,
  scheduleData,
}) => {
  const [step, setStep] = useState<number>(1);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [newDate, setNewDate] = useState<string>("");
  const [newStartTime, setNewStartTime] = useState<string>("");
  const [newEndTime, setNewEndTime] = useState<string>("");

  const schedules =
    scheduleData?.schedules.map((schedule) => ({
      id: schedule.dayOfWeek.toString(),
      dayOfWeek: schedule.dayOfWeek.toString(),
      day: schedule.dayOfWeek,
      time: `${schedule.startTime}-${schedule.endTime}`,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
    })) || [];

  const handleNext = (): void => {
    if (step === 1 && selectedSchedule) {
      setStep(2);
    } else if (step === 2) {
      console.log({
        originalSchedule: selectedSchedule,
        newDate,
        newStartTime,
        newEndTime,
      });

      alert("근무 변경 요청이 전송되었습니다.");
      handleClose();
    }
  };

  const handleClose = (): void => {
    setStep(1);
    setSelectedSchedule(null);
    setNewDate("");
    setNewStartTime("");
    setNewEndTime("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-medium">근무 시간 변경 요청</h2>
        </div>

        <div className="px-6 py-4">
          {step === 1 ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  변경할 근무 일정
                </label>

                <select
                  className="w-full p-2 pr-8 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23666666\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e')] bg-no-repeat bg-[right_8px_center] bg-[length:1.2em]"
                  value={selectedSchedule?.id || ""}
                  onChange={(e) => {
                    const schedule = schedules.find(
                      (s) => s.id === e.target.value
                    );
                    setSelectedSchedule(schedule || null);
                  }}
                >
                  <option value="">근무 일정을 선택하세요</option>
                  {schedules.map((schedule) => (
                    <option
                      key={schedule.id}
                      value={schedule.id}
                      className="hover:bg-blue-100"
                    >
                      {schedule.day}요일 ({schedule.time})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  변경 희망일
                </label>
                <input
                  type="date"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
                  value={newDate}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setNewDate(e.target.value)
                  }
                  placeholder="연도-월-일"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    시작 시간
                  </label>
                  <input
                    type="time"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
                    value={newStartTime}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setNewStartTime(e.target.value)
                    }
                    placeholder="-- --:--"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    종료 시간
                  </label>
                  <input
                    type="time"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
                    value={newEndTime}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setNewEndTime(e.target.value)
                    }
                    placeholder="-- --:--"
                  />
                </div>
              </div>
              {selectedSchedule && (
                <div className="text-sm text-gray-500">
                  현재 근무 시간: {selectedSchedule.day}요일{" "}
                  {selectedSchedule.time}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t flex justify-end gap-2">
          <button
            onClick={handleClose}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            취소
          </button>
          <button
            onClick={handleNext}
            disabled={step === 1 && !selectedSchedule}
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:hover:bg-orange-500"
          >
            {step === 1 ? "다음" : "요청하기"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleChangeModal;
