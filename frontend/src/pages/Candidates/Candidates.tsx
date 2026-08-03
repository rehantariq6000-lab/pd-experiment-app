import type { FC } from "react"
import { useState } from "react"
import { useLocation } from "wouter"
import Button from "../../components/ui/Button"
import { useExperiments } from "../../hooks/useExperiments"
import "./Candidates.css"

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const Candidates: FC = () => {
  const [, navigate] = useLocation()
  const [page, setPage] = useState(1)

  const { data, error, isLoading } = useExperiments(page)
  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1
  const items = data ? [...data.items].reverse() : [] // newest first

  return (
    <main className="candidates-page">
      <h1>Experiments</h1>
      <p className="page-subtitle">Click an experiment to view it and start a recording session.</p>

      <div className="table-head-row">
        <h3>Recent Experiments</h3>
        <span className="count-note">{isLoading ? "loading…" : `${data?.total ?? 0} total`}</span>
      </div>

      {error ? (
        <p className="state-msg state-msg--error">
          Could not reach the API. Is the backend running on http://localhost:3000 ?
        </p>
      ) : items.length === 0 && !isLoading ? (
        <div className="empty-box">No experiments returned by the API yet.</div>
      ) : (
        <>
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Experiment ID</th>
                  <th>Participant No.</th>
                  <th>Age</th>
                  <th>Height (cm)</th>
                  <th>Weight (kg)</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {items.map((e) => (
                  <tr key={e.id} className="row-clickable" onClick={() => navigate(`/experiment/${e.id}`)}>
                    <td className="cell-strong" title={e.id}>
                      {e.id.slice(0, 8)}…
                    </td>
                    <td>{e.patientNumber ?? "—"}</td>
                    <td>{e.age || "—"}</td>
                    <td>{e.height || "—"}</td>
                    <td>{e.weight || "—"}</td>
                    <td>{formatDate(e.createdAt)}</td>
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
              Page {page} of {totalPages} — {data?.total ?? 0} total
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

export default Candidates
