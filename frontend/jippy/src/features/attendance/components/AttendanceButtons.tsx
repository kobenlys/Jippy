import React, { useState, useEffect, useRef } from "react";
import AttendanceNotification from "./AttendanceNotification";
import { AttendanceStatus } from "@/features/attendance/types/status";
import styles from "../styles/AttendanceButtons.module.css";

interface AttendanceButtonsProps {
  className?: string;
  onStatusChange?: (status: AttendanceStatus, time: string) => void;
}

const AttendanceButtons: React.FC<AttendanceButtonsProps> = ({ 
  className = "",
  onStatusChange 
}) => {
  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus>("NONE");
  const [checkInTime, setCheckInTime] = useState<string>("");
  const [checkOutTime, setCheckOutTime] = useState<string>("");
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [currentAction, setCurrentAction] = useState<AttendanceStatus>("NONE");

  // 버튼 참조를 위한 ref 추가
  const checkInButton = useRef<HTMLButtonElement>(null);
  const checkOutButton = useRef<HTMLButtonElement>(null);

  // 알림창 표시될 때 body 스크롤 방지
  useEffect(() => {
    if (showNotification) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showNotification]);

  // 버튼 상태에 따라 오버레이 표시하는 로직 추가
  useEffect(() => {
    if (attendanceStatus === "NONE" && checkInButton.current?.disabled) {
      setShowNotification(true);
      setCurrentAction("CHECKED_IN");
    } else if (attendanceStatus === "CHECKED_IN" && checkOutButton.current?.disabled) {
      setShowNotification(true);
      setCurrentAction("CHECKED_OUT");
    }
  }, [attendanceStatus]);

  const getCurrentTime = (): string => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const handleAttendance = (type: "CHECKED_IN" | "CHECKED_OUT") => {
    const currentTime = getCurrentTime();
    
    if (type === "CHECKED_IN") {
      setCheckInTime(currentTime);
      setAttendanceStatus("CHECKED_IN");
    } else {
      setCheckOutTime(currentTime);
      setAttendanceStatus("CHECKED_OUT");
    }

    setCurrentAction(type);
    onStatusChange?.(type, currentTime);
    setShowNotification(true);
  };

  return (
    <>
      {showNotification && (
        <>
          {/* Backdrop Overlay */}
          <div 
            className={styles.overlay}
            onClick={() => setShowNotification(false)}
          />
          {/* Notification */}
          <div className={styles.notificationWrapper}>
            <AttendanceNotification
              status={currentAction === "NONE" ? "CHECKED_IN" : currentAction}
              time={currentAction === "CHECKED_IN" ? checkInTime : checkOutTime}
              onConfirm={() => setShowNotification(false)}
            />
          </div>
        </>
      )}

      <div className={`${styles.container} ${className}`}>
        <button 
          ref={checkInButton}
          onClick={() => handleAttendance("CHECKED_IN")}
          disabled={attendanceStatus !== "NONE"}
          className={`${styles.button} ${styles.checkInButton} 
            ${attendanceStatus !== "NONE" ? styles.checkInButtonDisabled : ""}`}
          type="button"
        >
          {checkInTime ? (
            <>
              <span className={styles.buttonTimeText}>{checkInTime}</span>
              <span className={styles.buttonStatusText}>출근 완료</span>
            </>
          ) : (
            <span className={styles.buttonDefaultText}>출근하기</span>
          )}
        </button>

        <button 
          ref={checkOutButton}
          onClick={() => handleAttendance("CHECKED_OUT")}
          disabled={attendanceStatus !== "CHECKED_IN"}
          className={`${styles.button} ${styles.checkOutButton}
            ${attendanceStatus !== "CHECKED_IN" ? styles.checkOutButtonDisabled : ""}`}
          type="button"
        >
          {checkOutTime ? (
            <>
              <span className={styles.buttonTimeText}>{checkOutTime}</span>
              <span className={styles.buttonStatusText}>퇴근 완료</span>
            </>
          ) : (
            <span className={styles.buttonDefaultText}>퇴근하기</span>
          )}
        </button>
      </div>
    </>
  );
};

export default AttendanceButtons;