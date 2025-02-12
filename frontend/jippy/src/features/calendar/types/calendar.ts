// API 응답 타입
export interface Schedule {
  calendarId: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export interface StaffScheduleData {
  storeUserStaffId: number;
  staffName: string;
  schedules: Schedule[];
}

export interface ApiSuccessResponse {
  code: number;
  success: true;
  data: StaffScheduleData;
}

export interface ApiErrorResponse {
  status: string;
  code: string;
  message: string;
  success: false;
  errors: Array<{ reason: string }>;
}

export type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

// 캘린더 그리드용 타입
export interface TimeSlot {
  time: string;
  format: string;
  originalHour: number;
}

// 스케줄 이벤트 타입
export interface ScheduleEvent {
  id: number;
  startTime: string;
  endTime: string;
  dayOfWeek: string;
  height: number;
  top: number;
}
