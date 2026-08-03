import type { InputHTMLAttributes, FC } from "react"
import "./Field.css"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input: FC<InputProps> = ({ label, error, id, className = "", ...props }) => {
  return (
    <div className="ui-field">
      {label && (
        <label className="ui-field-label" htmlFor={id}>
          {label}
        </label>
      )}
      <input id={id} className={`ui-control ${className}`} {...props} />
      {error && <span className="ui-field-error">{error}</span>}
    </div>
  )
}

export default Input
