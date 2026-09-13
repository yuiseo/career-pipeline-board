import { useState } from "react"

import type { Position } from "@/types/candidate"

import { POSITION_QUERY_PARAM, SEARCH_QUERY_PARAM } from "../constants"
import { filtersToSearchParams, parseFiltersFromSearch } from "../urlFilters"

function replaceFiltersInUrl(q: string, positions: ReadonlyArray<Position>) {
  const url = new URL(window.location.href)
  const params = url.searchParams

  params.delete(SEARCH_QUERY_PARAM)
  params.delete(POSITION_QUERY_PARAM)

  const filterParams = filtersToSearchParams({
    q,
    positions: [...positions],
  })
  for (const [key, value] of filterParams.entries()) {
    params.append(key, value)
  }

  const search = params.toString()
  const nextUrl = `${url.pathname}${search ? `?${search}` : ""}${url.hash}`
  window.history.replaceState(window.history.state, "", nextUrl)
}

export function useCandidateFilters() {
  const initial = parseFiltersFromSearch(window.location.search)
  const [searchInput, setSearchInput] = useState(initial.q)
  const [appliedQuery, setAppliedQuery] = useState(initial.q)
  const [selectedPositions, setSelectedPositions] = useState<Position[]>(
    initial.positions
  )

  function onSearchInputChange(value: string) {
    setSearchInput(value)
  }

  function onSearchSubmit() {
    const trimmed = searchInput.trim()
    setSearchInput(trimmed)
    setAppliedQuery(trimmed)
    replaceFiltersInUrl(trimmed, selectedPositions)
  }

  function onTogglePosition(position: Position) {
    const next = selectedPositions.includes(position)
      ? selectedPositions.filter((item) => item !== position)
      : [...selectedPositions, position]
    setSelectedPositions(next)
    replaceFiltersInUrl(appliedQuery, next)
  }

  function onClearPositions() {
    setSelectedPositions([])
    replaceFiltersInUrl(appliedQuery, [])
  }

  function onResetFilters() {
    setSearchInput("")
    setAppliedQuery("")
    setSelectedPositions([])
    replaceFiltersInUrl("", [])
  }

  return {
    searchInput,
    appliedQuery,
    selectedPositions,
    onSearchInputChange,
    onSearchSubmit,
    onTogglePosition,
    onClearPositions,
    onResetFilters,
  }
}
