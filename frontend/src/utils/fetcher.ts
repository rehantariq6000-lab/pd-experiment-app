// Generic fetcher used by SWR. Sends the request and returns parsed JSON.
type FetchArgs = [input: RequestInfo | URL, init?: RequestInit | undefined]

export const fetcher = (...args: FetchArgs) =>
  fetch(...args).then((res) => {
    if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    return res.json()
  })
