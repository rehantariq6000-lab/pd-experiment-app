import type { FC } from "react"
import StatCard from "./StatCard"
import "./StatsRow.css"

interface StatsRowProps {
  peak: string | number
  median: string | number
  mean: string | number
}

// Row of three summary stats (peak / median / mean).
const StatsRow: FC<StatsRowProps> = ({ peak, median, mean }) => {
  return (
    <div className="stats-row">
      <StatCard label="Peak Value" value={peak} />
      <StatCard label="Median Value" value={median} />
      <StatCard label="Mean Value" value={mean} />
    </div>
  )
}

export default StatsRow
