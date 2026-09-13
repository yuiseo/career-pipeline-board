import { setupServer } from "msw/node"
import type { RequestHandler } from "msw"
import { afterAll, afterEach, beforeAll } from "vitest"

export const FAIL_RATE_NEVER = 0
export const FAIL_RATE_ALWAYS = 1
export const DELAY_NONE = 0

export function createMswServer(...handlers: RequestHandler[]) {
  const server = setupServer(...handlers)

  beforeAll(() => {
    server.listen({ onUnhandledRequest: "error" })
  })
  afterEach(() => {
    server.resetHandlers()
  })
  afterAll(() => {
    server.close()
  })

  return server
}
