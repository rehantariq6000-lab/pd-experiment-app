import type { FC } from "react"
import "./StatCard.css"

interface StatCardProps {
  label: string
  value: string | number
}

// A single key-metric box (label on top, big value below).
const StatCard: FC<StatCardProps> = ({ label, value }) => {
  return (
    <div className="stat-card">
      <span className="stat-card-label">{label}</span>
      <span className="stat-card-value">{value}</span>
    </div>
  )
}

export default StatCard
