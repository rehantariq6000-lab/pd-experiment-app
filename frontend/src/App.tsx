import type { ReactNode } from "react"
import { Route, Switch, Redirect } from "wouter"
import Sidebar from "./components/layout/Sidebar"
import Login from "./pages/Login/Login"
import Sessions from "./pages/Sessions/Sessions"
import Candidates from "./pages/Candidates/Candidates"
import ExperimentDetail from "./pages/ExperimentDetail/ExperimentDetail"
import RecordingSetup from "./pages/RecordingSetup/RecordingSetup"
import Recording from "./pages/Recording/Recording"
import Reports from "./pages/Reports/Reports"
import "./App.css"

// Wraps a page in the sidebar + main-content shell. Sends the user back to
// the login page if they are not signed in yet.
function Shell({ children }: { children: ReactNode }) {
  if (!localStorage.getItem("token")) {
    return <Redirect to="/" />
  }
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main">{children}</main>
    </div>
  )
}

export default function App() {
  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/login" component={Login} />

      <Route path="/home">
        <Shell>
          <Sessions />
        </Shell>
      </Route>
      <Route path="/experiments">
        <Shell>
          <Candidates />
        </Shell>
      </Route>

      <Route path="/experiment/:id">
        {(params) => (
          <Shell>
            <ExperimentDetail id={params.id} />
          </Shell>
        )}
      </Route>
      <Route path="/experiment/:id/exercise/:exerciseId">
        {(params) => (
          <Shell>
            <ExperimentDetail id={params.id} exerciseId={params.exerciseId} />
          </Shell>
        )}
      </Route>

      <Route path="/recording-setup/:experimentId">
        {(params) => (
          <Shell>
            <RecordingSetup experimentId={params.experimentId} />
          </Shell>
        )}
      </Route>
      <Route path="/recording/:experimentId">
        {(params) => (
          <Shell>
            <Recording experimentId={params.experimentId} />
          </Shell>
        )}
      </Route>
      <Route path="/reports">
        <Shell>
          <Reports />
        </Shell>
      </Route>

      <Route>
        <Redirect to="/" />
      </Route>
    </Switch>
  )
}
