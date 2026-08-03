import type { FC, ReactNode } from "react"
import "./GraphCard.css"

interface GraphCardProps {
  label: string
  children?: ReactNode
}

// Titled box that holds a chart. Shows a placeholder when no chart is passed.
const GraphCard: FC<GraphCardProps> = ({ label, children }) => {
  return (
    <div className="graph-card">
      <p className="graph-card-label">{label}</p>
      <div className="graph-card-body">{children}</div>
    </div>
  )
}

export default GraphCard
