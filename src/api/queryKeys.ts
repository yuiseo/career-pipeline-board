export const candidateKeys = {
  all: ["candidates"] as const,
  lists: () => [...candidateKeys.all, "list"] as const,
  detail: (id: string) => [...candidateKeys.all, "detail", id] as const,
}
