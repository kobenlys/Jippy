export interface ApiSuccessResponse<T> {
  code: number;
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  status: string;
  code: string;
  message: string;
  success: false;
  errors: Array<{ reason: string }>;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export type StaffType = "OWNER" | "MANAGER" | "STAFF";
export type UpdateableStaffType = "MANAGER" | "STAFF";
export type SalaryType = "시급" | "월급";

export interface StaffInfo {
  storeUserStaffId: number;
  staffName: string;
  staffType: StaffType;
  staffSalary: number;
  staffSalaryType: SalaryType;
}

export type StaffListResponse = ApiResponse<StaffInfo[]>;

export interface WorkingStaff {
  storeUserStaffId: number;
  name: string;
}

export interface WorkingStaffData {
  totalCount: number;
  staffList: WorkingStaff[];
}

export type WorkingStaffResponse = ApiResponse<WorkingStaffData>;

export interface StaffMonthlyStatus {
  storeUserStaffId: number;
  salary: number;
  lateCount: number;
  earlyLeaveCount: number;
  workMinutes: number;
}

export type StaffMonthlyStatusResponse = ApiResponse<StaffMonthlyStatus>;

export interface UpdateStaffRequest {
  staffType?: UpdateableStaffType;
  staffSalary?: number;
  staffSalaryType?: SalaryType;
}

export type UpdateStaffResponse = ApiResponse<StaffInfo>;

export type DeleteStaffResponse = ApiResponse<void>;

export interface StaffTotalStatus {
  storeUserStaffId: number;
  totalSalary: number;
  totalLateCount: number;
  totalEarlyLeaveCount: number;
  totalWorkMinutes: number;
}

export type StaffTotalStatusResponse = ApiResponse<StaffTotalStatus>;

export interface StoreSalary {
  storeSalary: number;
}

export interface TotalStoreSalary {
  totalStoreSalary: number;
}

export type StoreSalaryResponse = ApiResponse<StoreSalary>;
export type TotalStoreSalaryResponse = ApiResponse<TotalStoreSalary>;

export interface CreateScheduleRequest {
  schedules: Array<{
    dayOfWeek: string;
    startTime: string;
    endTime: string;
  }>;
}

export interface UpdateScheduleRequest {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export const SCHEDULE_COLORS = {
  legend: [
    "bg-blue-200",
    "bg-green-200",
    "bg-pink-200",
    "bg-purple-200",
    "bg-orange-200",
    "bg-teal-200",
  ],
  schedule: [
    "bg-blue-200/50",
    "bg-green-200/50",
    "bg-pink-200/50",
    "bg-purple-200/50",
    "bg-orange-200/50",
    "bg-teal-200/50",
  ],
} as const;
