import type { FC } from "react"
import { useState } from "react"
import { useLocation } from "wouter"
import Card from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import Badge from "../../components/ui/Badge"
import { EXERCISES, type ExerciseStep, saveSelectedExercises } from "../../data/exercises"
import { useExperiment } from "../../hooks/useExperiments"
import "./RecordingSetup.css"

const SENSORS = [
  { key: "sound", label: "Microphone (Sound Pressure)" },
  { key: "mouth", label: "Camera (Mouth Opening)" },
  { key: "step", label: "Motion Sensor (Step Length)" },
  { key: "speed", label: "Motion Sensor (Speed & Acceleration)" },
] as const

type SensorKey = (typeof SENSORS)[number]["key"]
type SensorStatus = "pending" | "checking" | "ok"

const RecordingSetup: FC<{ experimentId: string }> = ({ experimentId }) => {
  const [, navigate] = useLocation()
  const { experiment } = useExperiment(experimentId)

  const [status, setStatus] = useState<Record<SensorKey, SensorStatus>>({
    sound: "pending",
    mouth: "pending",
    step: "pending",
    speed: "pending",
  })
  const [selected, setSelected] = useState<ExerciseStep[]>(EXERCISES)

  const allCalibrated = SENSORS.every((s) => status[s.key] === "ok")

  function calibrate(key: SensorKey) {
    setStatus((s) => ({ ...s, [key]: "checking" }))
    setTimeout(() => {
      setStatus((s) => ({ ...s, [key]: "ok" }))
    }, 900)
  }

  function calibrateAll() {
    SENSORS.forEach((s) => calibrate(s.key))
  }

  function toggle(ex: ExerciseStep) {
    setSelected((list) =>
      list.includes(ex) ? list.filter((e) => e !== ex) : [...list, ex],
    )
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= selected.length) return
    const next = [...selected]
    ;[next[index], next[target]] = [next[target], next[index]]
    setSelected(next)
  }

  function startRecording() {
    const tags = selected.map((e) => e.tag)
    saveSelectedExercises(experimentId, tags)
    navigate(`/recording/${experimentId}?exercises=${encodeURIComponent(tags.join(","))}`)
  }

  return (
    <main className="setup-page">
      <h1>Set Up Recording Session</h1>
      <p className="page-subtitle">Participant: {experiment?.patientNumber ?? "—"}</p>

      <Card title="Calibrate sensors" className="setup-card">
        <p className="setup-hint">
          Attach the sensors to the participant and verify each one before recording. This
          establishes a baseline for the measurements.
        </p>
        <div className="setup-list">
          {SENSORS.map((s) => (
            <div key={s.key} className="setup-row">
              <span className="setup-row-label">{s.label}</span>
              <div className="setup-sensor-action">
                {status[s.key] === "ok" && <Badge label="Completed" />}
                {status[s.key] === "checking" && <Badge label="Recording" />}
                {status[s.key] === "pending" && <Badge label="Idle" />}
                <Button
                  variant="ghost"
                  onClick={() => calibrate(s.key)}
                  disabled={status[s.key] !== "pending"}
                >
                  {status[s.key] === "ok" ? "Recalibrate" : "Calibrate"}
                </Button>
              </div>
            </div>
          ))}
        </div>
        {!allCalibrated && (
          <Button variant="ghost" className="setup-calibrate-all" onClick={calibrateAll}>
            Calibrate All
          </Button>
        )}
      </Card>

      <Card title="Choose exercises" className="setup-card">
        <p className="setup-hint">Select which exercises to run, and set their order.</p>
        <div className="setup-list">
          {EXERCISES.map((ex) => {
            const on = selected.includes(ex)
            const orderIndex = selected.indexOf(ex)
            return (
              <div key={ex.tag} className={`setup-row ${on ? "" : "setup-row--off"}`}>
                <label className="setup-checkbox">
                  <input type="checkbox" checked={on} onChange={() => toggle(ex)} />
                  <span className="setup-row-label">{ex.label}</span>
                  <span className="setup-row-tag">{ex.tag}</span>
                </label>
                {on && (
                  <div className="setup-order-controls">
                    <span className="setup-order-num">{orderIndex + 1}</span>
                    <button
                      type="button"
                      className="setup-order-btn"
                      onClick={() => move(orderIndex, -1)}
                      disabled={orderIndex === 0}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="setup-order-btn"
                      onClick={() => move(orderIndex, 1)}
                      disabled={orderIndex === selected.length - 1}
                    >
                      ↓
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </Card>

      {!allCalibrated && (
        <p className="setup-warning">Calibrate all sensors before starting the recording.</p>
      )}

      <Button
        onClick={startRecording}
        disabled={selected.length === 0 || !allCalibrated}
        className="setup-start"
      >
        Start Recording →
      </Button>
    </main>
  )
}

export default RecordingSetup
