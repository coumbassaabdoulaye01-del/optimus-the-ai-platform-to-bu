import { ExternalLink, ServerCog } from "lucide-react"
import { CoderPanel } from "./coder-shell"

const coderUrl = process.env.NEXT_PUBLIC_CODER_URL ?? "http://localhost:3001"

export function CoderEngineFrame() {
  return (
    <CoderPanel className="overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-white/10 bg-white/[.03] p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-black">
            <ServerCog className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-semibold">Coder engine original</h2>
            <p className="text-sm text-white/45">
              L’interface ci-dessous charge directement le serveur Coder installé, sans recréer ses composants.
            </p>
          </div>
        </div>
        <a
          href={coderUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[.04] px-3 py-2 text-sm text-white/70 hover:bg-white/[.08] hover:text-white"
        >
          Ouvrir Coder
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
      <div className="relative h-[680px] bg-black/30">
        <iframe
          title="Coder"
          src={coderUrl}
          className="h-full w-full border-0 bg-white"
          sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-downloads"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#11141b] to-transparent p-5 pt-20">
          <p className="pointer-events-auto max-w-2xl rounded-xl border border-white/10 bg-[#0b0d12]/90 p-3 text-xs leading-5 text-white/55 backdrop-blur">
            Si l’iframe est vide, démarre Coder avec <span className="font-mono text-white">pnpm start:coder</span> puis définis
            <span className="font-mono text-white"> NEXT_PUBLIC_CODER_URL</span> si l’adresse est différente.
          </p>
        </div>
      </div>
    </CoderPanel>
  )
}
