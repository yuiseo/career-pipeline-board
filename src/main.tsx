import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { QueryClientProvider } from "@tanstack/react-query"
import { createQueryClient } from "@/api/queryClient"
import "./index.css"
import App from "./App.tsx"

const queryClient = createQueryClient()

if (import.meta.env.DEV) {
  void import("react-grab")
}

/** mock API(MSW)는 별도 청크로 분리해 불러온 뒤, 워커가 준비되면 앱을 렌더링한다. */
import("./mocks/browser")
  .then(({ startMockApi }) => startMockApi())
  .then(() => {
    createRoot(document.getElementById("root")!).render(
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </StrictMode>
    )
  })
