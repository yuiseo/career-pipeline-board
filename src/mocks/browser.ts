import { setupWorker } from "msw/browser"
import { applyDataCommands, randomDelayMs, resolveFailRate } from "./config"
import { createCandidateDb } from "./db"
import { createHandlers } from "./handlers"

/** 실제 백엔드가 없으므로 개발·배포 환경 모두에서 mock API를 켠다. */
export async function startMockApi() {
  const db = createCandidateDb(window.localStorage)
  applyDataCommands(db, window.location)

  const worker = setupWorker(
    ...createHandlers({
      db,
      failRate: () => resolveFailRate(window.location.search),
      delay: randomDelayMs,
    })
  )

  await worker.start({
    onUnhandledRequest: "bypass",
    quiet: import.meta.env.PROD,
  })
}
