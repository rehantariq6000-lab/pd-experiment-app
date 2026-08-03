import type { FC, HTMLAttributes } from "react"
import "./Card.css"

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: string
}

// White panel with an optional header. Wraps most page content.
const Card: FC<CardProps> = ({ title, subtitle, className = "", children, ...props }) => {
  return (
    <div className={`ui-card ${className}`} {...props}>
      {(title || subtitle) && (
        <div className="ui-card-header">
          {title && <h3 className="ui-card-title">{title}</h3>}
          {subtitle && <p className="ui-card-subtitle">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  )
}

export default Card
