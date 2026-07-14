import type { Metadata } from "next"
import { IdeWorkspace } from "@/components/ide/ide-workspace"

export const metadata: Metadata = {
  title: "Optimus Collab IDE — Build together in the browser",
  description:
    "A collaborative web IDE. Sign in with GitHub, edit the project in your browser, and open pull requests.",
}

export default async function IdePage({
  searchParams,
}: {
  searchParams: Promise<{ auth_error?: string }>
}) {
  const params = await searchParams
  return <IdeWorkspace authError={params.auth_error ?? null} />
}
