import type { SelectHTMLAttributes, FC } from "react"
import "./Field.css"

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
}

const Select: FC<SelectProps> = ({ label, id, className = "", children, ...props }) => {
  return (
    <div className="ui-field">
      {label && (
        <label className="ui-field-label" htmlFor={id}>
          {label}
        </label>
      )}
      <select id={id} className={`ui-control ${className}`} {...props}>
        {children}
      </select>
    </div>
  )
}

export default Select
