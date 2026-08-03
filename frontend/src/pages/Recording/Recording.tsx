import type { FC } from "react"
import { useState, useEffect } from "react"
import { useLocation } from "wouter"
import Card from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import TextArea from "../../components/ui/TextArea"
import { EXERCISES } from "../../data/exercises"
import { useExperiment } from "../../hooks/useExperiments"
import "./Recording.css"

type Phase = "ready" | "recording" | "paused" | "done"

// Reads the ordered exercise tags from the URL (set on the setup screen)
// and returns the matching exercises in that order. Falls back to all of
// them, in the default order, if none were passed.
function readSelectedExercises() {
  const tags = new URLSearchParams(window.location.search).get("exercises")
  if (!tags) return EXERCISES
  const order = tags.split(",")
  const byTag = new Map(EXERCISES.map((ex) => [ex.tag, ex]))
  const picked = order.map((tag) => byTag.get(tag)).filter((ex): ex is (typeof EXERCISES)[number] => !!ex)
  return picked.length > 0 ? picked : EXERCISES
}

const Recording: FC<{ experimentId: string }> = ({ experimentId }) => {
  const [, navigate] = useLocation()
  const { experiment } = useExperiment(experimentId)

  const [sessionExercises] = useState(readSelectedExercises)
  const [step, setStep] = useState(0)
  const [phase, setPhase] = useState<Phase>("ready")
  const [progress, setProgress] = useState(0)
  const [notes, setNotes] = useState("")

  const exercise = sessionExercises[step]
  const isLast = step === sessionExercises.length - 1

  // While recording, fill the progress bar; stop automatically at 100%.
  useEffect(() => {
    if (phase !== "recording") return
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timer)
          setPhase("done")
          return 100
        }
        return p + 5
      })
    }, 300)
    return () => clearInterval(timer)
  }, [phase])

  function startRecording() {
    setProgress(0)
    setPhase("recording")
  }

  function pauseRecording() {
    setPhase("paused")
  }

  function resumeRecording() {
    setPhase("recording")
  }

  function restartRecording() {
    setProgress(0)
    setPhase("recording")
  }

  function next() {
    if (isLast) {
      navigate("/reports")
      return
    }
    setStep((s) => s + 1)
    setPhase("ready")
    setProgress(0)
    setNotes("")
  }

  return (
    <main className="recording-page">
      <div className="recording-head">
        <div>
          <p className="page-subtitle">Recording Session</p>
          <h1>
            Exercise {step + 1} of {sessionExercises.length}: {exercise.label}
          </h1>
        </div>
        <span className="recording-tag">{exercise.tag}</span>
      </div>

      <div className="recording-meta">
        <div>
          <span className="recording-meta-label">Participant</span>
          <span className="recording-meta-value">{experiment?.patientNumber ?? "—"}</span>
        </div>
        <div>
          <span className="recording-meta-label">Status</span>
          <span className="recording-meta-value">
            {phase === "ready"
              ? "Ready"
              : phase === "recording"
                ? "● Recording…"
                : phase === "paused"
                  ? "Paused"
                  : "Completed"}
          </span>
        </div>
      </div>

      <Card title="Instructions for the participant" className="recording-instructions">
        <p className="instruction-text">{exercise.instruction}</p>
      </Card>

      <Card className="recording-progress-card">
        <div className="progress-row">
          <span className="progress-label">Recording Progress</span>
          <span className="count-note">{progress}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="progress-controls">
          {phase === "ready" && <Button onClick={startRecording}>Start Recording</Button>}
          {phase === "recording" && (
            <>
              <Button variant="ghost" onClick={pauseRecording}>
                Pause Recording
              </Button>
              <Button variant="ghost" onClick={restartRecording}>
                Restart Recording
              </Button>
            </>
          )}
          {phase === "paused" && (
            <>
              <Button onClick={resumeRecording}>Resume Recording</Button>
              <Button variant="ghost" onClick={restartRecording}>
                Restart Recording
              </Button>
            </>
          )}
          {phase === "done" && (
            <Button className="next-btn" onClick={next}>
              {isLast ? "Save Results" : "Next Exercise →"}
            </Button>
          )}
        </div>
      </Card>

      <Card title="Notes / Annotations" className="recording-notes-card">
        <TextArea
          placeholder="Notes for this exercise (participant fatigue, tremor observed, mispronunciation, sensor adjusted)…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </Card>
    </main>
  )
}

export default Recording
