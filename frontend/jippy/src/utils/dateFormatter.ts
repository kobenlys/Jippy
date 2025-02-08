export const formatKoreanDate = (date: Date): string => {
  const year = date.getFullYear() - 2000; // 25년 형식으로 표시
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  
  return `${year}년 ${month}월 ${day}일`;
};

export const formatTime = (timeString: TimeString): string => {
  const [hours, minutes] = timeString.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;
  
  return `${String(formattedHour).padStart(2, "0")}:${minutes} ${ampm}`;
};