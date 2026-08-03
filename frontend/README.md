# PD Experiment Frontend

React (Vite) and TypeScript frontend for the Parkinson's disease experiment app. It lets an experimenter log in, register a participant, run a recording session made up of exercises, and review the results afterward.

See the main README in the repository root for how to run the whole project (backend and mock API included) and for the login credentials.

## Running just the frontend

```bash
npm install
npm run dev
```

This starts the app on http://localhost:5173. It expects the backend to be running on http://localhost:3000, since API calls to /experiments, /exercises and /auth are proxied there during development (see vite.config.ts).
