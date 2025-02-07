export interface AttendanceButtonsProps {
    className?: string;
  }
  
  // 버튼의 공통 Props를 추출할 수도 있습니다
  export interface AttendanceButtonProps {
    onClick: () => void;
    disabled: boolean;
    time: string;
    label: string;
  }