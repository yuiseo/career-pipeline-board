import BoardPageLayout from "@/features/board/components/BoardPageLayout"
import CandidateBoard from "@/features/board/components/CandidateBoard"

function App() {
  return (
    <BoardPageLayout
      title="채용 파이프라인 보드"
      description="지원자를 전형 단계별로 확인하고 관리합니다."
    >
      <CandidateBoard />
    </BoardPageLayout>
  )
}

export default App
