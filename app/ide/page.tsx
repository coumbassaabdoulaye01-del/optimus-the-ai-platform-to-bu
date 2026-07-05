import type { Metadata } from "next"
import { IdeWorkspace } from "@/components/ide/ide-workspace"

export const metadata: Metadata = {
  title: "Optimus IDE — Build in the browser",
  description: "A web-based IDE with a file explorer, code editor, and interactive terminal.",
}

export default function IdePage() {
  return <IdeWorkspace />
}
