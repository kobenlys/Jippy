import { ButtonVariant, buttonVariants } from "./variants";

interface ButtonProps {
  children: React.ReactNode;
  type?: ButtonVariant;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  disabled?: boolean;
}

const Button = ({ 
  children, 
  type = "default", 
  onClick,
  className = "",
  disabled = false 
}: ButtonProps) => {
  // 기본 rounded-full 스타일을 제거하고 className으로 유연하게 처리
  const baseStyles = type.includes("Square") ? "rounded-sm w-[256px] transition-colors" : "rounded-full w-[256px] mt-3 p-3 transition-colors";
  
  return (
    <button 
      className={`${baseStyles} ${buttonVariants[type]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;