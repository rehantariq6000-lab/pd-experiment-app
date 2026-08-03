// The exercises of a recording session (from the MOVES step-by-step guide).
export type ExerciseStep = {
  label: string
  tag: string
  instruction: string
}

export const EXERCISES: ExerciseStep[] = [
  {
    label: "Normal steps",
    tag: "#normal-steps",
    instruction: "Walk the 14 m distance as you normally would. Say “Ba” with every step.",
  },
  {
    label: "Big steps",
    tag: "#big-steps",
    instruction: "Walk the distance with big steps. Say “Ba” with every step.",
  },
  {
    label: "Huge steps",
    tag: "#huge-steps",
    instruction: "Walk the distance with super big / huge steps. Say “Ba” with every step.",
  },
]

// Remembers which exercises (and order) were chosen for an experiment's
// recording session, so Reports only shows results for the selected ones.
function storageKey(experimentId: string) {
  return `selected-exercises:${experimentId}`
}

export function saveSelectedExercises(experimentId: string, tags: string[]) {
  localStorage.setItem(storageKey(experimentId), JSON.stringify(tags))
}

export function getSelectedExercises(experimentId: string): ExerciseStep[] {
  const raw = localStorage.getItem(storageKey(experimentId))
  if (!raw) return EXERCISES
  const tags: string[] = JSON.parse(raw)
  const byTag = new Map(EXERCISES.map((ex) => [ex.tag, ex]))
  const picked = tags.map((tag) => byTag.get(tag)).filter((ex): ex is ExerciseStep => !!ex)
  return picked.length > 0 ? picked : EXERCISES
}
