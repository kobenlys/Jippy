// CheckIcon.tsx
import React from "react";
import { Check } from "lucide-react";

const CheckIcon = ({ isValid }: { isValid: boolean }) => {
  return (
    <div 
      className="flex items-center justify-center flex-shrink-0"
      style={{
        width: "18.84px",
        height: "18.84px",
        background: isValid ? "#F27B39" : "#FFFFFF",  // 비밀번호 유효하면 주황색, 아니면 흰색
        borderRadius: "4.70881px",
        border: isValid ? "none" : "1px solid #EBEBEB"
      }}
    >
      <Check 
        className="text-white"
        style={{
          width: "11.65px",
          height: "9.16px",
          margin: "4.84px 3.59px"
        }}
      />
    </div>
  );
};

export default CheckIcon;
