import type { ReactNode } from "react"

interface BoardPageLayoutProps {
  title: string
  description?: string
  /** Topbar 우측 슬롯 (검색·필터 영역) */
  toolbar?: ReactNode
  /** 보드 영역에 가로로 배치될 내용 (컬럼 목록) */
  children?: ReactNode
}

function BoardPageLayout({
  title,
  description,
  toolbar,
  children,
}: BoardPageLayoutProps) {
  return (
    <div className="flex h-svh flex-col bg-background text-foreground">
      <header className="flex h-18 shrink-0 items-center justify-between gap-4 border-b border-border px-8">
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold">{title}</h1>
          {description && (
            <p className="truncate text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {toolbar && (
          <div className="flex shrink-0 items-center gap-2">{toolbar}</div>
        )}
      </header>
      <main className="flex min-h-0 flex-1 items-start overflow-x-auto px-8 py-5.5">
        {children}
      </main>
    </div>
  )
}

export default BoardPageLayout
