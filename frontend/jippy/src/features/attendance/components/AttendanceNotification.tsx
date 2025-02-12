import React from "react";
import { Check } from "lucide-react";
import { AttendanceStatus } from "@/features/attendance/types/status";
import styles from "../styles/AttendanceNotification.module.css";

const formatKoreanDate = (date: Date): string => {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "long"
  }).format(date);
};

const formatTime = (time: string): string => {
  return time;
};

interface AttendanceNotificationProps {
  status: Exclude<AttendanceStatus, "NONE">;  // "NONE"을 제외한 타입만 허용
  time: string;
  onConfirm?: () => void;
}

const AttendanceNotification: React.FC<AttendanceNotificationProps> = ({
  status = "CHECKED_IN",
  time = "09:00",
  onConfirm = () => {}
}) => {
  const today = new Date();
  const formattedDate = formatKoreanDate(today);
  const formattedTime = formatTime(time);
  
  const getMessage = () => {
    switch (status) {
      case "CHECKED_IN":
        return "정상 출근 되었습니다!";
      case "CHECKED_OUT":
        return "정상 퇴근 되었습니다!";
      default:
        return "";
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.notificationBox}>
        <div className={styles.notificationContent}>
          <div className={styles.dateTimeContainer}>
            <h2 className={styles.dateText}>
              {formattedDate}
            </h2>
            <h3 className={styles.timeText}>
              {formattedTime}
            </h3>
            <h3 className={styles.messageText}>
              {getMessage()}
            </h3>
          </div>

          <div className={styles.checkIconWrapper}>
            <div className={styles.checkIconCircle}>
              <div className={styles.checkIconInner}>
                <Check 
                  size={30} 
                  className="text-[#F27B39]" 
                  strokeWidth={3}
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>

          <button
            onClick={onConfirm}
            className={styles.confirmButton}
          >
            <span className={styles.confirmButtonText}>확인</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceNotification;