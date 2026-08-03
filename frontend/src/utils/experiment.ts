// Types + write operations for the experiment API.
// All paths are relative — the Vite dev-proxy forwards them to the NestJS
// backend (localhost:3000), which proxies to the experiment API.

export interface Experiment {
  id: string
  patientNumber: string | null
  height: number | null
  age: number | null
  weight: number | null
  createdAt: string
  properties: Record<string, string>
}

export interface ExperimentList {
  items: Experiment[]
  page: number
  pageSize: number
  total: number
}

export interface Exercise {
  id: string
  experimentId: string
  createdAt: string
  recordingStatus: "idle" | "recording" | "stopped"
  hasData: boolean
  recordingStartedAt: string | null
  recordingEndedAt: string | null
  properties: Record<string, string>
}

// Shape returned by GET /exercises/:id/data (real recorded signals).
export interface ExerciseData {
  exerciseId: string
  mouthOpening: { values: [number, number][]; sampleRate: number }
  soundPressure: { values: number[]; unit: string }
  footSpeed: { values: number[]; unit: string }
  aggregates: {
    stepLengths: { values: number[]; unit: string }
    averages: Record<string, number>
    medians: Record<string, number>
  }
}

export interface CreateExperimentPayload {
  age: number
  height: number
  weight?: number
  patientNumber: string
  properties?: Record<string, string>
}

// POST a new experiment (used by the Register form and the quick-create button).
export async function createExperiment(
  payload: CreateExperimentPayload,
): Promise<Experiment> {
  const res = await fetch("/experiments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error("Failed to create experiment")
  return res.json()
}
