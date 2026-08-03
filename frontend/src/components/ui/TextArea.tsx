import type { TextareaHTMLAttributes, FC } from "react"
import "./Field.css"

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
}

const TextArea: FC<TextAreaProps> = ({ label, id, className = "", ...props }) => {
  return (
    <div className="ui-field">
      {label && (
        <label className="ui-field-label" htmlFor={id}>
          {label}
        </label>
      )}
      <textarea id={id} className={`ui-control ui-control--textarea ${className}`} {...props} />
    </div>
  )
}

export default TextArea
