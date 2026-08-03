import type { FC } from "react"
import { useLocation } from "wouter"
import NavList, { type NavListItem } from "../../components/ui/NavList"
import GraphCard from "../../components/ui/GraphCard"
import Button from "../../components/ui/Button"
import Badge from "../../components/ui/Badge"
import StatsRow from "../../components/ui/StatsRow"
import { SoundChart, MouthChart, StepChart, SpeedChart } from "../../components/charts/SignalCharts"
import { useExperiment, useExercises } from "../../hooks/useExperiments"
import "./ExperimentDetail.css"

interface ExperimentDetailProps {
  id: string
  exerciseId?: string
}

const ExperimentDetail: FC<ExperimentDetailProps> = ({ id, exerciseId }) => {
  const [, navigate] = useLocation()

  const { experiment, error: expError, isLoading: expLoading } = useExperiment(id)
  const { exercises, isLoading: exLoading } = useExercises(id)

  const activeExercise = exercises.find((e) => e.id === exerciseId) ?? exercises[0]

  const navItems: NavListItem[] = exercises.map((ex, index) => {
    const label = ex.properties?.label?.toLowerCase() ?? ""
    const normalizedLabel = label.includes("shoulder")
      ? "Shoulder Exercises"
      : ex.properties?.label
        ? `Exercise ${index + 1}: ${ex.properties.label}`
        : `Exercise ${index + 1}`
    return { id: ex.id, label: normalizedLabel }
  })

  if (expLoading || exLoading)
    return (
      <main className="exp-page">
        <p className="state-msg">Loading…</p>
      </main>
    )

  if (expError || !experiment)
    return (
      <main className="exp-page">
        <p className="state-msg state-msg--error">Failed to load experiment.</p>
      </main>
    )

  return (
    <main className="exp-page">
      <div className="exp-layout">
        <aside className="exp-sidebar">
          <div className="exp-sidebar-header">
            <p className="exp-id">Experiment {experiment.patientNumber ?? experiment.id.slice(0, 8)}</p>
            <p className="exp-meta">Participant: {experiment.patientNumber ?? "—"}</p>
          </div>

          <Button fullWidth onClick={() => navigate(`/recording-setup/${id}`)}>
            Start Recording
          </Button>

          {/* Participant data pulled from the API, stacked vertically. */}
          <div className="patient-data">
            <div className="patient-data-row">
              <span className="patient-data-label">Participant</span>
              <span className="patient-data-value">{experiment.patientNumber ?? "—"}</span>
            </div>
            <div className="patient-data-row">
              <span className="patient-data-label">Age</span>
              <span className="patient-data-value">{experiment.age ?? "—"} years</span>
            </div>
            <div className="patient-data-row">
              <span className="patient-data-label">Height</span>
              <span className="patient-data-value">{experiment.height ?? "—"} cm</span>
            </div>
            <div className="patient-data-row">
              <span className="patient-data-label">Weight</span>
              <span className="patient-data-value">{experiment.weight ?? "—"} kg</span>
            </div>
            <div className="patient-data-row">
              <span className="patient-data-label">Created</span>
              <span className="patient-data-value">{new Date(experiment.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="exp-exercises">
            <p className="exp-exercises-title">Exercises</p>
            {navItems.length > 0 ? (
              <NavList
                items={navItems}
                activeId={activeExercise?.id}
                onSelect={(exId) => navigate(`/experiment/${id}/exercise/${exId}`)}
              />
            ) : (
              <p className="state-msg">No exercises for this experiment.</p>
            )}
          </div>
        </aside>

        <section className="exp-content">
          {activeExercise ? (
            <>
              <div className="exp-content-header">
                <div>
                  <h1 className="exp-content-title">
                    {activeExercise.properties?.label ?? `Exercise ${activeExercise.id.slice(0, 8)}`}
                  </h1>
                  <p className="page-subtitle">Recorded data streams</p>
                </div>
                <Badge label={activeExercise.recordingStatus} />
              </div>

              <div className="exp-charts-grid">
                <GraphCard label="Sound Pressure Level (dB)">
                  <SoundChart />
                </GraphCard>
                <GraphCard label="Mouth Opening during Speech (mm)">
                  <MouthChart />
                </GraphCard>
                <GraphCard label="Step Length while Walking (cm)">
                  <StepChart />
                </GraphCard>
                <GraphCard label="Speed &amp; Acceleration (m/s, m/s²)">
                  <SpeedChart />
                </GraphCard>
              </div>

              <StatsRow peak="84 dB" median="63 dB" mean="65 dB" />
            </>
          ) : (
            <p className="state-msg">No exercises found for this experiment.</p>
          )}
        </section>
      </div>
    </main>
  )
}

export default ExperimentDetail
