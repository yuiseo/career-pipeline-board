import { QueryClient } from "@tanstack/react-query"

/** 조회는 실패 시 1회 재시도, mutation은 재시도하지 않는다 (DECISIONS 2-4). */
const QUERY_RETRY_COUNT = 1
const MUTATION_RETRY_COUNT = 0

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: QUERY_RETRY_COUNT,
      },
      mutations: {
        retry: MUTATION_RETRY_COUNT,
      },
    },
  })
}
