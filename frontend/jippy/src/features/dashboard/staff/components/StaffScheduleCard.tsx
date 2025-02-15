"use client";

import {
  DAYS_OF_WEEK,
  Schedule,
  StaffScheduleData,
} from "@/features/calendar/types/calendar";
import LoadingSpinner from "@/features/common/components/ui/LoadingSpinner";
import useStaffSchedule from "../hooks/useStaffSchedule";
import { SCHEDULE_COLORS } from "../types/staff";
import ScheduleCreateModal from "./ScheduleCreateModal";
import { useState } from "react";
import useStaffList from "../hooks/useStaffManagement";
import ScheduleEditModal from "./ScheduleEditModal";

interface WeeklyStaffScheduleProps {
  storeId: number;
}

const WeeklyStaffSchedule = ({ storeId }: WeeklyStaffScheduleProps) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [selectedStaffName, setSelectedStaffName] = useState<string>("");
  const {
    data: staffSchedules,
    isLoading,
    error,
    refreshSchedule,
  } = useStaffSchedule(storeId);
  const { data: staffList } = useStaffList(storeId);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!staffSchedules || staffSchedules.length === 0) {
    return <div className="text-gray-500">등록된 스케줄이 없습니다.</div>;
  }

  const handleScheduleClick = (schedule: Schedule, staffName: string) => {
    setSelectedSchedule(schedule);
    setSelectedStaffName(staffName);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">주간 근무 스케줄</h2>
          <div className="flex items-center gap-6">
            <div className="flex gap-4">
              {staffSchedules.map((staff: StaffScheduleData, index: number) => (
                <div
                  key={staff.storeUserStaffId}
                  className="flex items-center gap-2"
                >
                  <div
                    className={`w-3 h-3 rounded-full ${
                      SCHEDULE_COLORS.legend[
                        index % SCHEDULE_COLORS.legend.length
                      ]
                    }`}
                  />
                  <span>{staff.staffName}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              + 스케줄 등록
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 p-4 gap-4">
        {DAYS_OF_WEEK.map((day: string) => (
          <div
            key={day}
            className="text-center mb-2 font-medium"
            style={{
              color:
                day === "일" ? "#FF0000" : day === "토" ? "#0000FF" : "#000000",
            }}
          >
            {day}
          </div>
        ))}

        {DAYS_OF_WEEK.map((day: string) => (
          <div key={day} className="min-h-[120px] bg-gray-50 rounded-lg p-2">
            {staffSchedules.map(
              (staff: StaffScheduleData, staffIndex: number) =>
                staff.schedules
                  .filter((schedule: Schedule) => schedule.dayOfWeek === day)
                  .map((schedule: Schedule) => (
                    <div
                      key={schedule.calendarId}
                      onClick={() =>
                        handleScheduleClick(schedule, staff.staffName)
                      }
                      className={`${
                        SCHEDULE_COLORS.schedule[
                          staffIndex % SCHEDULE_COLORS.schedule.length
                        ]
                      } rounded-full px-3 py-1 mb-1 text-center text-gray-700 cursor-pointer hover:brightness-95`}
                    >
                      <span className="text-xs">
                        {schedule.startTime} - {schedule.endTime}
                      </span>
                    </div>
                  ))
            )}
          </div>
        ))}
      </div>

      {staffList && (
        <ScheduleCreateModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          storeId={storeId}
          staffList={staffList}
          onSuccess={refreshSchedule}
        />
      )}

      {selectedSchedule && (
        <ScheduleEditModal
          isOpen={!!selectedSchedule}
          onClose={() => setSelectedSchedule(null)}
          storeId={storeId}
          schedule={selectedSchedule}
          staffName={selectedStaffName}
          onSuccess={refreshSchedule}
        />
      )}
    </div>
  );
};

export default WeeklyStaffSchedule;
