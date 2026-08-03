import type { FC } from "react"
import "./Badge.css"

type BadgeVariant = "recording" | "idle" | "stopped" | "completed" | "default"

interface BadgeProps {
  label: string
  variant?: BadgeVariant
}

// Infers a colour from the recording status when no variant is passed.
function inferVariant(label: string): BadgeVariant {
  switch (label.toLowerCase()) {
    case "recording":
      return "recording"
    case "idle":
      return "idle"
    case "stopped":
      return "stopped"
    case "completed":
      return "completed"
    default:
      return "default"
  }
}

const Badge: FC<BadgeProps> = ({ label, variant }) => {
  const v = variant ?? inferVariant(label)
  return <span className={`badge badge--${v}`}>{label}</span>
}

export default Badge
