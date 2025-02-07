export type TimeString = string;

export type AttendanceStatus = "NONE" | "CHECKED_IN" | "CHECKED_OUT";

export interface AttendanceTime {
  checkInTime: TimeString;
  checkOutTime: TimeString;
}

export interface AlertMessage {
  date: string;
  time: string;
  type: string;
}