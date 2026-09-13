import type { FormEvent } from "react"
import { SearchIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { POSITIONS, POSITION_LABEL, type Position } from "@/types/candidate"

interface SearchFilterToolbarProps {
  searchInput: string
  onSearchInputChange: (value: string) => void
  onSearchSubmit: () => void
  selectedPositions: ReadonlyArray<Position>
  onTogglePosition: (position: Position) => void
  onClearPositions: () => void
}

function SearchFilterToolbar({
  searchInput,
  onSearchInputChange,
  onSearchSubmit,
  selectedPositions,
  onTogglePosition,
  onClearPositions,
}: SearchFilterToolbarProps) {
  const selectedCount = selectedPositions.length

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSearchSubmit()
  }

  return (
    <div className="flex items-center gap-2">
      <form className="flex items-center gap-1.5" onSubmit={handleSearchSubmit}>
        <Input
          type="text"
          value={searchInput}
          onChange={(event) => onSearchInputChange(event.target.value)}
          placeholder="이름 검색"
          aria-label="이름 검색"
          className="h-9 w-48"
        />
        <Button
          type="submit"
          variant="outline"
          size="icon-lg"
          aria-label="검색"
        >
          <SearchIcon />
        </Button>
      </form>

      <Popover>
        <PopoverTrigger asChild>
          <Button type="button" variant="outline">
            직무 필터
            {selectedCount > 0 ? (
              <Badge variant="secondary">{selectedCount}</Badge>
            ) : null}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-56 p-2">
          <ul className="flex flex-col gap-0.5">
            {POSITIONS.map((position) => {
              const checkboxId = `position-filter-${position}`
              const isChecked = selectedPositions.includes(position)

              return (
                <li
                  key={position}
                  className="flex items-center gap-2 rounded-md px-1.5 py-1.5"
                >
                  <Checkbox
                    id={checkboxId}
                    checked={isChecked}
                    onCheckedChange={() => {
                      onTogglePosition(position)
                    }}
                  />
                  <label
                    htmlFor={checkboxId}
                    className="cursor-pointer text-sm leading-none"
                  >
                    {POSITION_LABEL[position]}
                  </label>
                </li>
              )
            })}
          </ul>
          <Button
            type="button"
            variant="link"
            className="h-auto self-start px-1.5 py-1"
            onClick={onClearPositions}
          >
            선택 해제
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default SearchFilterToolbar
