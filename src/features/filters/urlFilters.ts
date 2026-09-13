import { positionSchema, type Position } from "@/types/candidate"

import { POSITION_QUERY_PARAM, SEARCH_QUERY_PARAM } from "./constants"

export type ParsedFilters = {
  q: string
  positions: Position[]
}

/** URL search 문자열에서 검색·직무 필터를 읽는다. 유효하지 않은 position은 무시한다. */
export function parseFiltersFromSearch(search: string): ParsedFilters {
  const params = new URLSearchParams(search)
  const q = params.get(SEARCH_QUERY_PARAM) ?? ""

  const positions: Position[] = []
  const seen = new Set<Position>()
  for (const value of params.getAll(POSITION_QUERY_PARAM)) {
    const parsed = positionSchema.safeParse(value)
    if (!parsed.success || seen.has(parsed.data)) {
      continue
    }
    seen.add(parsed.data)
    positions.push(parsed.data)
  }

  return { q, positions }
}

/** 적용된 필터를 URLSearchParams로 직렬화한다. 빈 q는 생략하고 position은 반복한다. */
export function filtersToSearchParams({
  q,
  positions,
}: ParsedFilters): URLSearchParams {
  const params = new URLSearchParams()
  if (q.length > 0) {
    params.set(SEARCH_QUERY_PARAM, q)
  }
  for (const position of positions) {
    params.append(POSITION_QUERY_PARAM, position)
  }
  return params
}
