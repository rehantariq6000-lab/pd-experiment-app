import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const soundData = [
  { name: "1", value: 61 },
  { name: "2", value: 68 },
  { name: "3", value: 64 },
  { name: "4", value: 72 },
  { name: "5", value: 66 },
  { name: "6", value: 70 },
]

export function SoundChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={soundData}>
        <CartesianGrid />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#2f6fed" />
      </LineChart>
    </ResponsiveContainer>
  )
}

const mouthData = [
  { name: "1", value: 12 },
  { name: "2", value: 15 },
  { name: "3", value: 11 },
  { name: "4", value: 18 },
  { name: "5", value: 14 },
  { name: "6", value: 17 },
]

export function MouthChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={mouthData}>
        <CartesianGrid />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#2f6fed" />
      </LineChart>
    </ResponsiveContainer>
  )
}

const stepData = [
  { name: "1", value: 51 },
  { name: "2", value: 62 },
  { name: "3", value: 48 },
  { name: "4", value: 70 },
  { name: "5", value: 55 },
  { name: "6", value: 66 },
]

export function StepChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={stepData}>
        <CartesianGrid />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#2f6fed" />
      </BarChart>
    </ResponsiveContainer>
  )
}

const speedData = [
  { name: "1", speed: 1.2, acc: 0.4 },
  { name: "2", speed: 1.5, acc: 0.6 },
  { name: "3", speed: 1.1, acc: 0.3 },
  { name: "4", speed: 1.8, acc: 0.7 },
  { name: "5", speed: 1.4, acc: 0.5 },
  { name: "6", speed: 1.6, acc: 0.6 },
]

export function SpeedChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={speedData}>
        <CartesianGrid />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="speed" stroke="#2f6fed" />
        <Line type="monotone" dataKey="acc" stroke="#2e7d32" />
      </LineChart>
    </ResponsiveContainer>
  )
}
