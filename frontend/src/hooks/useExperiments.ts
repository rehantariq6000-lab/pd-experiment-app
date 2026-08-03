import useSWR from "swr"
import { fetcher } from "../utils/fetcher"
import type {
  Experiment,
  ExperimentList,
  Exercise,
  ExerciseData,
} from "../utils/experiment"

// Paginated list of experiments. `mutate` lets callers refresh after a create.
export function useExperiments(page = 1, pageSize = 20) {
  const { data, error, isLoading, mutate } = useSWR<ExperimentList>(
    `/experiments?page=${page}&pageSize=${pageSize}`,
    fetcher,
    { refreshInterval: 4000, refreshWhenHidden: true }, // keep polling even in a background tab
  )
  return { data, error, isLoading, mutate }
}

// A single experiment by id.
export function useExperiment(id: string) {
  const { data, error, isLoading } = useSWR<Experiment>(
    id ? `/experiments/${id}` : null,
    fetcher,
  )
  return { experiment: data, error, isLoading }
}

// Exercises belonging to one experiment.
export function useExercises(experimentId: string) {
  const { data, error, isLoading } = useSWR<Exercise[]>(
    experimentId ? `/experiments/${experimentId}/exercises` : null,
    fetcher,
  )
  return { exercises: data ?? [], error, isLoading }
}

// Recorded signal data for one exercise (only exists once recording stopped).
export function useExerciseData(exerciseId: string | undefined, hasData: boolean) {
  const { data, error, isLoading } = useSWR<ExerciseData>(
    exerciseId && hasData ? `/exercises/${exerciseId}/data` : null,
    fetcher,
  )
  return { data, error, isLoading }
}
