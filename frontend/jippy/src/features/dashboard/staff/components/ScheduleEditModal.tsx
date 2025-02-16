"use client";

import { useState } from "react";
import { DAYS_OF_WEEK, Schedule } from "@/features/calendar/types/calendar";
import staffApi from "../hooks/staffApi";

interface ScheduleEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeId: number;
  schedule: Schedule;
  staffName: string;
  onSuccess: () => void;
}

const ScheduleEditModal = ({
  isOpen,
  onClose,
  storeId,
  schedule,
  staffName,
  onSuccess,
}: ScheduleEditModalProps) => {
  const [dayOfWeek, setDayOfWeek] = useState(schedule.dayOfWeek);
  const [startTime, setStartTime] = useState(schedule.startTime);
  const [endTime, setEndTime] = useState(schedule.endTime);

  if (!isOpen) return null;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await staffApi.updateSchedule(storeId, schedule.calendarId, {
        dayOfWeek,
        startTime,
        endTime,
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("스케줄 수정 실패:", error);
      alert("스케줄 수정에 실패했습니다.");
    }
  };

  const handleDelete = async () => {
    if (!confirm("정말 이 스케줄을 삭제하시겠습니까?")) return;

    try {
      await staffApi.deleteSchedule(storeId, schedule.calendarId);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("스케줄 삭제 실패:", error);
      alert("스케줄 삭제에 실패했습니다.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[480px]">
        <h2 className="text-lg font-semibold mb-4">
          {staffName}님의 스케줄 수정
        </h2>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              요일
            </label>
            <select
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(e.target.value)}
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

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
            >
              삭제
            </button>
            <div className="flex gap-2">
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
                수정
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleEditModal;
