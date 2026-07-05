"use client"

import { CoderAuthCard } from "@/components/coder/coder-auth-card"
import { CoderComponentGallery } from "@/components/coder/coder-component-gallery"
import { CoderDashboardPreview } from "@/components/coder/coder-dashboard-preview"
import { CoderShell } from "@/components/coder/coder-shell"
import { CoderSidebar } from "@/components/coder/coder-sidebar"
import { CoderTopbar } from "@/components/coder/coder-topbar"

export function LoginGate({ error }: { error?: string | null }) {
  return (
    <CoderShell>
      <CoderTopbar />
      <div className="flex min-h-[calc(100vh-3.5rem)]">
        <CoderSidebar />
        <main className="min-w-0 flex-1 px-5 py-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 grid gap-6 xl:grid-cols-[1fr_420px] xl:items-end">
              <div>
                <div className="mb-4 inline-flex rounded-full border border-white/10 bg-white/[.04] px-3 py-1 font-mono text-xs text-white/50">
                  Coder open-source UI · adapté pour Optimus
                </div>
                <h1 className="max-w-4xl text-balance text-4xl font-semibold tracking-tight md:text-6xl">
                  Déploie un workspace cloud, connecte ton identité, puis code dans le navigateur.
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-white/55 md:text-lg">
                  Cette deuxième page reprend une architecture de dashboard façon Coder : topbar,
                  sidebar, templates, activité workspace et carte d’authentification réutilisable.
                </p>
              </div>
              <CoderAuthCard error={error} />
            </div>
            <CoderDashboardPreview />
            <div className="mt-4">
              <CoderComponentGallery />
            </div>
          </div>
        </main>
      </div>
    </CoderShell>
  )
}
