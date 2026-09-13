import { POSITIONS, type CandidateDetail, type Stage } from "@/types/candidate"

export const DEFAULT_SEED_COUNT = 1000
const DEFAULT_SEED = 20260913

/** 지원일 범위의 기준일. Date.now()를 쓰지 않아 언제 생성해도 같은 데이터가 나온다. */
const BASE_DATE_UTC = Date.UTC(2026, 8, 1)
const APPLIED_WITHIN_DAYS = 180
const DAY_MS = 24 * 60 * 60 * 1000

const STAGE_WEIGHTS: [Stage, number][] = [
  ["document", 40],
  ["interview", 25],
  ["offer", 10],
  ["hired", 5],
  ["rejected", 20],
]

const EDUCATION_WEIGHTS: [string, number][] = [
  ["고등학교 졸업", 5],
  ["전문학사", 15],
  ["학사", 55],
  ["석사", 20],
  ["박사", 5],
]

const SURNAMES = "김이박최정강조윤장임한오서신권황안송류홍".split("")
const GIVEN_NAME_SYLLABLES = "민서지현준우윤하도연수예은진유태성원영희".split(
  ""
)

type Random = () => number

/** 시드값 기반 의사난수 생성기 (mulberry32). 0 이상 1 미만을 반환한다. */
function createRandom(seed: number): Random {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), state | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pick<T>(random: Random, items: readonly T[]): T {
  return items[Math.floor(random() * items.length)]
}

function pickWeighted<T>(random: Random, weights: [T, number][]): T {
  const total = weights.reduce((sum, [, weight]) => sum + weight, 0)
  let threshold = random() * total
  for (const [value, weight] of weights) {
    threshold -= weight
    if (threshold < 0) return value
  }
  return weights[weights.length - 1][0]
}

function randomInt(random: Random, min: number, max: number): number {
  return min + Math.floor(random() * (max - min + 1))
}

function toDateString(timeMs: number): string {
  return new Date(timeMs).toISOString().slice(0, 10)
}

export function createSeedCandidates(
  count = DEFAULT_SEED_COUNT,
  seed = DEFAULT_SEED
): CandidateDetail[] {
  const random = createRandom(seed)

  return Array.from({ length: count }, (_, index) => {
    const number = String(index + 1).padStart(4, "0")
    const name =
      pick(random, SURNAMES) +
      pick(random, GIVEN_NAME_SYLLABLES) +
      pick(random, GIVEN_NAME_SYLLABLES)
    const daysAgo = randomInt(random, 0, APPLIED_WITHIN_DAYS - 1)

    return {
      id: `c-${number}`,
      name,
      position: pick(random, POSITIONS),
      appliedAt: toDateString(BASE_DATE_UTC - daysAgo * DAY_MS),
      stage: pickWeighted(random, STAGE_WEIGHTS),
      email: `candidate${number}@example.com`,
      phone: `010-${randomInt(random, 1000, 9999)}-${randomInt(random, 1000, 9999)}`,
      experienceYears: randomInt(random, 0, 15),
      education: pickWeighted(random, EDUCATION_WEIGHTS),
    }
  })
}
