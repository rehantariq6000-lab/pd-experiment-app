import type { FC } from "react"
import { useState } from "react"
import Select from "../../components/ui/Select"
import GraphCard from "../../components/ui/GraphCard"
import StatsRow from "../../components/ui/StatsRow"
import { SoundChart, MouthChart, StepChart, SpeedChart } from "../../components/charts/SignalCharts"
import { useExperiments } from "../../hooks/useExperiments"
import { getSelectedExercises } from "../../data/exercises"
import "./Reports.css"

// Sample summary metrics per exercise (one row each).
const SUMMARY = [
  { peak: "78 dB", mean: "61 dB", mouth: "12.4 mm" },
  { peak: "82 dB", mean: "65 dB", mouth: "15.1 mm" },
  { peak: "86 dB", mean: "70 dB", mouth: "18.7 mm" },
]

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" })
}

const Reports: FC = () => {
  const { data, isLoading } = useExperiments(1, 100)
  const experiments = data?.items ?? []

  const participants = [...new Set(experiments.map((e) => e.patientNumber).filter(Boolean))] as string[]

  const [participant, setParticipant] = useState<string | null>(null)
  const [experimentId, setExperimentId] = useState<string | null>(null)
  const [view, setView] = useState<number | "summary">(0)

  const activeParticipant = participant ?? participants[0] ?? null
  const participantExperiments = experiments.filter((e) => e.patientNumber === activeParticipant)
  const activeExperimentId = experimentId ?? participantExperiments[0]?.id ?? null

  // Only show exercises that were actually selected for this experiment's
  // recording session.
  const exercises = activeExperimentId ? getSelectedExercises(activeExperimentId) : []
  const activeView = typeof view === "number" && view < exercises.length ? view : "summary"

  if (participants.length === 0 && !isLoading) {
    return (
      <main className="reports-page">
        <h1>Reports</h1>
        <p className="page-subtitle">Review recorded data per participant, experiment, and exercise.</p>
        <div className="empty-box">No participants yet. Create one on the Home page first.</div>
      </main>
    )
  }

  return (
    <main className="reports-page">
      <h1>Reports</h1>
      <p className="page-subtitle">Review recorded data per participant, experiment, and exercise.</p>

      <div className="reports-filters">
        <Select
          label="Participant"
          value={activeParticipant ?? ""}
          onChange={(e) => {
            setParticipant(e.target.value)
            setExperimentId(null)
            setView(0)
          }}
        >
          {participants.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </Select>

        <Select
          label="Experiment"
          value={activeExperimentId ?? ""}
          onChange={(e) => {
            setExperimentId(e.target.value)
            setView(0)
          }}
        >
          {participantExperiments.map((e) => (
            <option key={e.id} value={e.id}>
              {e.id.slice(0, 8)}… · {formatDate(e.createdAt)}
            </option>
          ))}
        </Select>

        {exercises.length > 0 && (
          <Select
            label="Exercise"
            value={activeView === "summary" ? "summary" : String(activeView)}
            onChange={(e) => setView(e.target.value === "summary" ? "summary" : Number(e.target.value))}
          >
            {exercises.map((ex, i) => (
              <option key={ex.tag} value={i}>
                {ex.label}
              </option>
            ))}
            <option value="summary">Summary — all exercises</option>
          </Select>
        )}
      </div>

      {exercises.length === 0 ? (
        <div className="empty-box">No exercises were recorded for this experiment yet.</div>
      ) : activeView === "summary" ? (
        <div className="reports-detail">
          <div className="reports-section-label">Session Summary</div>
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Exercise</th>
                  <th>Peak (dB)</th>
                  <th>Mean (dB)</th>
                  <th>Mouth (mm)</th>
                </tr>
              </thead>
              <tbody>
                {exercises.map((ex, i) => (
                  <tr key={ex.tag}>
                    <td className="cell-strong">{ex.label}</td>
                    <td>{SUMMARY[i].peak}</td>
                    <td>{SUMMARY[i].mean}</td>
                    <td>{SUMMARY[i].mouth}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="reports-detail">
          <div className="reports-section-label">Key Metrics — {exercises[activeView].label}</div>
          <StatsRow peak={SUMMARY[activeView].peak} median="63 dB" mean={SUMMARY[activeView].mean} />

          <div className="reports-section-label">Recorded Signals</div>
          <div className="reports-graphs">
            <GraphCard label="Sound Pressure Level (dB)">
              <SoundChart />
            </GraphCard>
            <GraphCard label="Mouth Opening (mm)">
              <MouthChart />
            </GraphCard>
            <GraphCard label="Step Length (cm)">
              <StepChart />
            </GraphCard>
            <GraphCard label="Speed &amp; Acceleration (m/s, m/s²)">
              <SpeedChart />
            </GraphCard>
          </div>
        </div>
      )}
    </main>
  )
}

export default Reports
