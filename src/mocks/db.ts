import type { CandidateDetail, Stage } from "@/types/candidate"
import { DEFAULT_SEED_COUNT, createSeedCandidates } from "./seed"

export const STORAGE_KEY = "career-pipeline-board:candidates"
/** 저장 데이터 구조가 바뀌면 올린다. 저장된 버전과 다르면 시드를 다시 생성한다. */
export const STORAGE_VERSION = 1

type StoredData = {
  version: number
  candidates: CandidateDetail[]
}

export type CandidateStorage = Pick<Storage, "getItem" | "setItem">

export type CandidateDb = {
  getAll(): CandidateDetail[]
  getById(id: string): CandidateDetail | undefined
  updateStage(id: string, stage: Stage): CandidateDetail | undefined
  /** 저장 데이터를 시드로 다시 만든다. count를 0으로 주면 빈 데이터가 된다. */
  reset(count?: number): void
}

function readStoredCandidates(
  storage: CandidateStorage
): CandidateDetail[] | undefined {
  const raw = storage.getItem(STORAGE_KEY)
  if (raw === null) return undefined

  try {
    const data = JSON.parse(raw) as StoredData
    if (data.version !== STORAGE_VERSION || !Array.isArray(data.candidates)) {
      return undefined
    }
    return data.candidates
  } catch {
    return undefined
  }
}

export function createCandidateDb(storage: CandidateStorage): CandidateDb {
  let candidates: CandidateDetail[] | undefined

  function save(next: CandidateDetail[]) {
    candidates = next
    const data: StoredData = { version: STORAGE_VERSION, candidates: next }
    storage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  function load(): CandidateDetail[] {
    if (candidates) return candidates

    const stored = readStoredCandidates(storage)
    if (stored) {
      candidates = stored
      return stored
    }

    const seeded = createSeedCandidates()
    save(seeded)
    return seeded
  }

  return {
    getAll() {
      return load()
    },

    getById(id) {
      return load().find((candidate) => candidate.id === id)
    },

    updateStage(id, stage) {
      const current = load()
      const target = current.find((candidate) => candidate.id === id)
      if (!target) return undefined

      const updated = { ...target, stage }
      save(
        current.map((candidate) => (candidate.id === id ? updated : candidate))
      )
      return updated
    },

    reset(count = DEFAULT_SEED_COUNT) {
      save(createSeedCandidates(count))
    },
  }
}
