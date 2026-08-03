import type { FC } from "react"
import { COLORS } from "../../theme"

// Normalise an arbitrary numeric series into the 0..1 range the charts expect.
export function normalize(values: number[]): number[] {
  if (values.length === 0) return []
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  return values.map((v) => (v - min) / span)
}

interface Series {
  label: string
  color: string
  data: number[] // values 0..1
}

// Multi-line chart used for gait/speech visualisation and reports.
export const GaitChart: FC<{ series: Series[]; height?: number }> = ({ series, height = 220 }) => {
  const width = 640
  const pad = 28
  const maxLen = Math.max(...series.map((s) => s.data.length), 1)
  const x = (i: number) => pad + (i / (maxLen - 1 || 1)) * (width - pad * 2)
  const y = (v: number) => pad + (1 - v) * (height - pad * 2)

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" role="img" aria-label="Recorded data">
      {[0, 0.25, 0.5, 0.75, 1].map((g) => (
        <line key={g} x1={pad} x2={width - pad} y1={y(g)} y2={y(g)} stroke={COLORS.border} />
      ))}
      {series.map((s) => (
        <polyline
          key={s.label}
          fill="none"
          stroke={s.color}
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
          points={s.data.map((v, i) => `${x(i)},${y(v)}`).join(" ")}
        />
      ))}
      {series.map((s, i) => (
        <g key={s.label} transform={`translate(${pad + i * 200}, ${height - 6})`}>
          <rect width={12} height={12} y={-10} rx={2} fill={s.color} />
          <text x={18} y={0} fontSize={12} fill={COLORS.muted}>
            {s.label}
          </text>
        </g>
      ))}
    </svg>
  )
}

// Vertical-bar audio waveform. Data values are 0..1.
export const AudioWaveform: FC<{ bars: number[]; height?: number }> = ({ bars, height = 120 }) => {
  const width = 300
  const gap = 2
  const barW = (width - gap * (bars.length - 1)) / bars.length
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" role="img" aria-label="Audio waveform">
      {bars.map((b, i) => {
        const h = Math.max(2, b * (height - 8))
        return (
          <rect
            key={i}
            x={i * (barW + gap)}
            y={(height - h) / 2}
            width={barW}
            height={h}
            rx={1.5}
            fill={COLORS.accent}
            opacity={0.55 + b * 0.45}
          />
        )
      })}
    </svg>
  )
}
