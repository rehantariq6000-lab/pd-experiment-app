import type { ButtonHTMLAttributes, FC } from "react"
import "./Button.css"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost"
  fullWidth?: boolean
}

const Button: FC<ButtonProps> = ({
  variant = "primary",
  fullWidth = false,
  className = "",
  children,
  ...props
}) => {
  return (
    <button
      className={`ui-btn ui-btn--${variant} ${fullWidth ? "ui-btn--full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
