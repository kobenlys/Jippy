interface ButtonProps {
  children: React.ReactNode;
  type?: "default" | "primary" | "danger" | "orange" | "orange-border" | "brown";  // 버튼 종류
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const Button = ({ children, type = "default", onClick}: ButtonProps) => {
  return (
    <button className={`button button-${type}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
