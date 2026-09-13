import BoardPageLayout from "@/features/board/components/BoardPageLayout"
import CandidateBoard from "@/features/board/components/CandidateBoard"
import SearchFilterToolbar from "@/features/filters/components/SearchFilterToolbar"
import { useCandidateFilters } from "@/features/filters/hooks/useCandidateFilters"

function App() {
  const {
    searchInput,
    appliedQuery,
    selectedPositions,
    onSearchInputChange,
    onSearchSubmit,
    onTogglePosition,
    onClearPositions,
    onResetFilters,
  } = useCandidateFilters()

  return (
    <BoardPageLayout
      title="채용 파이프라인 보드"
      description="지원자를 전형 단계별로 확인하고 관리합니다."
      toolbar={
        <SearchFilterToolbar
          searchInput={searchInput}
          onSearchInputChange={onSearchInputChange}
          onSearchSubmit={onSearchSubmit}
          selectedPositions={selectedPositions}
          onTogglePosition={onTogglePosition}
          onClearPositions={onClearPositions}
        />
      }
    >
      <CandidateBoard
        nameQuery={appliedQuery}
        positions={selectedPositions}
        onResetFilters={onResetFilters}
      />
    </BoardPageLayout>
  )
}

export default App
