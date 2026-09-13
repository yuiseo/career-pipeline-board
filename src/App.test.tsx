import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import App from "./App"

function renderApp() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  )
}

describe("App", () => {
  it("renders without crashing", () => {
    renderApp()
    expect(
      screen.getByRole("heading", { level: 1, name: "채용 파이프라인 보드" })
    ).toBeInTheDocument()
  })
})
