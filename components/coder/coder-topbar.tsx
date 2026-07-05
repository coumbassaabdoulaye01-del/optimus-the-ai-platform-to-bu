import Link from "next/link"
import { ArrowLeft, Boxes, CircleHelp, Command, Search } from "lucide-react"

export function CoderTopbar() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-white/10 bg-[#0b0d12]/75 px-4 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-white/60 hover:bg-white/[.06] hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Accueil
        </Link>
        <span className="h-5 w-px bg-white/10" />
        <div className="flex items-center gap-2 font-semibold">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-white text-black">
            <Boxes className="h-4 w-4" />
          </span>
          Optimus
        </div>
      </div>
      <div className="hidden w-full max-w-md items-center gap-2 rounded-xl border border-white/10 bg-white/[.04] px-3 py-2 text-sm text-white/40 md:flex">
        <Search className="h-4 w-4" />
        Rechercher workspaces, templates, dépôts…
        <span className="ml-auto inline-flex items-center gap-1 rounded-md border border-white/10 px-1.5 py-0.5 font-mono text-[10px]">
          <Command className="h-3 w-3" />K
        </span>
      </div>
      <div className="flex items-center gap-2 text-white/50">
        <CircleHelp className="h-4 w-4" />
        <span className="hidden text-xs md:inline">Docs</span>
      </div>
    </header>
  )
}
