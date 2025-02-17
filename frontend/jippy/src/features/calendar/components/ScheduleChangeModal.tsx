import React, { useState } from "react";
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

  const days = ["일", "월", "화", "수", "목", "금", "토"] as const;

  const handleDateChange = (date: string) => {
    setNewDate(date);
    const dayIndex = new Date(date).getDay();
    const dayName = days[dayIndex];
    const schedule = schedules.find((s) => s.dayOfWeek === dayName);

    if (schedule) {
      setSelectedSchedule(schedule);
      setNewStartTime(schedule.startTime);
      setNewEndTime(schedule.endTime);
    } else {
      setSelectedSchedule(null);
    }
  };

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
                  변경할 날짜
                </label>

                <input
                  type="date"
                  className="w-full"
                  value={newDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                />
              </div>
              {newDate && !selectedSchedule && (
                <div className="text-sm text-red-500">
                  선택한 날짜에 근무 일정이 없습니다.
                </div>
              )}
              {selectedSchedule && (
                <div className="text-sm text-gray-500">
                  현재 근무 시간: {selectedSchedule.day}요일{" "}
                  {selectedSchedule.time}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  변경 희망일
                </label>
                <input
                  type="date"
                  className="w-full"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    시작 시간
                  </label>
                  <input
                    type="time"
                    className="w-full"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    종료 시간
                  </label>
                  <input
                    type="time"
                    className="w-full"
                    value={newEndTime}
                    onChange={(e) => setNewDate(e.target.value)}
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
