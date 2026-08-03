# PD Experiment App

This project is a web app for running experiments with Parkinson's disease patients. An experimenter logs in, registers a participant, sets up and runs a recording session made of a few exercises (normal steps, big steps, huge steps), and then reviews the results in a reports page.

The project has three parts that run together:

- **frontend**: React (Vite) and TypeScript. This is the part the experimenter actually uses in the browser.
- **Backend**: NestJS backend. Forwards experiment data requests to the mock API below.
- **experiment-api**: a small Express mock API that stores participants, experiments and exercises. This simulates the real data collection service.

## Login

The login screen accepts any username and password.

## How to run it

You need three terminals open at the same time, one for each part.

### 1. Start the mock API

The mock API is David Linner's project, not part of this repository. Clone it separately:

```bash
git clone https://github.com/davidlinner/experiment-api.git
cd experiment-api
npm install
PORT=8080 npm start
```

This runs on http://localhost:8080. You can see the API docs at http://localhost:8080/docs.

### 2. Start the backend

```bash
cd Backend/backend-project
npm install
npm run start:dev
```

This runs on http://localhost:3000 and talks to the mock API.

### 3. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

This runs on http://localhost:5173. Open that address in your browser and log in with any username and password.

## How the pieces talk to each other

The frontend never calls the backend or the mock API directly by full address. Instead, Vite's dev server proxies a few paths (/experiments, /exercises) to the backend on port 3000, so the frontend can just call something like /experiments and it gets forwarded automatically. The backend then forwards those requests on to the mock API on port 8080.

## What the app does

1. Log in as the experimenter.
2. On the Home page, create a new participant and see the list of participants recorded so far.
3. Click a participant to open their experiment, where you can start a recording session.
4. Choose which exercises to run and in what order, and calibrate the sensors.
5. Step through each exercise: start, pause, resume or restart the recording, then move to the next one.
6. After the last exercise, save the results and view them on the Reports page, filtered by participant, experiment and exercise.
