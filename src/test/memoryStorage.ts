import type { CandidateStorage } from "@/mocks/db"

export function createMemoryStorage(): CandidateStorage {
  const data = new Map<string, string>()

  return {
    getItem(key) {
      return data.get(key) ?? null
    },
    setItem(key, value) {
      data.set(key, value)
    },
  }
}
