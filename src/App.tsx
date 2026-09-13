import BoardColumn from "@/features/board/components/BoardColumn"
import BoardPageLayout from "@/features/board/components/BoardPageLayout"
import { STAGES } from "@/types/candidate"

function App() {
  return (
    <BoardPageLayout
      title="채용 파이프라인 보드"
      description="지원자를 전형 단계별로 확인하고 관리합니다."
    >
      {STAGES.map((stage) => (
        <BoardColumn key={stage} stage={stage} count={0} />
      ))}
    </BoardPageLayout>
  )
}

export default App
