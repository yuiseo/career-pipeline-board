import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import App from "./App"

describe("App", () => {
  it("renders without crashing", () => {
    render(<App />)
    expect(
      screen.getByRole("heading", { level: 1, name: "채용 파이프라인 보드" })
    ).toBeInTheDocument()
  })
})
