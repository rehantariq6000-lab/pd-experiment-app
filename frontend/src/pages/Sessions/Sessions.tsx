import type { FC } from "react"
import { useState } from "react"
import { useLocation } from "wouter"
import Button from "../../components/ui/Button"
import { useExperiments } from "../../hooks/useExperiments"
import { createExperiment } from "../../utils/experiment"
import "./Sessions.css"

const PAGE_SIZE = 5

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" })
}

const Sessions: FC = () => {
  const [, navigate] = useLocation()
  const [page, setPage] = useState(1)
  const [creating, setCreating] = useState(false)

  // Pull a wide window so we can page through all participants.
  const { data, error, isLoading, mutate } = useExperiments(1, 100)
  const participants = data ? [...data.items].reverse() : [] // newest first

  const totalPages = Math.max(1, Math.ceil(participants.length / PAGE_SIZE))
  const start = (page - 1) * PAGE_SIZE
  const visible = participants.slice(start, start + PAGE_SIZE)

  // Creates a new participant using the exact example values shown in
  // David's API documentation (GET /docs → Create a new experiment).
  async function handleCreate() {
    setCreating(true)
    try {
      await createExperiment({
        patientNumber: "P-0042",
        height: 176,
        age: 63,
        weight: 78.5,
      })
      await mutate()
      setPage(1) // jump to the newest
    } catch {
      // the error banner below covers fetch failures
    } finally {
      setCreating(false)
    }
  }

  return (
    <main className="sessions-page">
      <div className="page-head">
        <h1>Welcome, Dr.</h1>
        <Button onClick={handleCreate} disabled={creating}>
          {creating ? "Creating…" : "Create New Participant"}
        </Button>
      </div>

      <div className="table-head-row">
        <h3>Recent Participants</h3>
      </div>

      {error ? (
        <p className="state-msg state-msg--error">
          Could not reach the API. Is the backend running on http://localhost:3000 ?
        </p>
      ) : participants.length === 0 && !isLoading ? (
        <div className="empty-box">No participants yet. Click “Create New Participant”.</div>
      ) : (
        <>
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Participant No.</th>
                  <th>Age</th>
                  <th>Height (cm)</th>
                  <th>Weight (kg)</th>
                  <th>Registered</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((p) => (
                  <tr key={p.id} className="row-clickable" onClick={() => navigate(`/experiment/${p.id}`)}>
                    <td className="cell-strong">{p.patientNumber ?? "—"}</td>
                    <td>{p.age || "—"}</td>
                    <td>{p.height || "—"}</td>
                    <td>{p.weight || "—"}</td>
                    <td>{formatDate(p.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <Button variant="ghost" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              Previous
            </Button>
            <span className="pagination-info">
              Page {page} of {totalPages} — {participants.length} total
            </span>
            <Button
              variant="ghost"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </main>
  )
}

export default Sessions
