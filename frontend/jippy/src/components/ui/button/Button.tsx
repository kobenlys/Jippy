import { ButtonVariant, buttonVariants } from "./variants";

interface ButtonProps {
  children: React.ReactNode;
  type?: ButtonVariant;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const Button = ({ children, type = "default", onClick }: ButtonProps) => {
  return (
    <button 
      className={`rounded-md px-4 py-2 transition-colors ${buttonVariants[type]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;