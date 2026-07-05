import { Boxes, Component, Layers3 } from "lucide-react"
import { CoderPanel } from "./coder-shell"

const coderComponents = [
  "Abbr",
  "ActiveUserChart",
  "Alert",
  "AnimatedIcons",
  "Autocomplete",
  "Avatar",
  "Badge",
  "Badges",
  "Breadcrumb",
  "Button",
  "Calendar",
  "Chart",
  "Checkbox",
  "CodeExample",
  "Collapsible",
  "CollapsibleSummary",
  "Combobox",
  "Command",
  "ContextMenu",
  "CopyButton",
  "CopyableValue",
  "DateRangePicker",
  "Dialog",
  "Dialogs",
  "DropdownMenu",
  "DurationField",
  "EmptyState",
  "ErrorBoundary",
  "Expander",
  "ExternalImage",
  "FeatureStageBadge",
  "FileIcon",
  "FileUpload",
  "Filter",
  "Form",
  "FormField",
  "FullPageForm",
  "FullPageLayout",
  "GitDeviceAuth",
  "HelpPopover",
  "IconField",
  "Icons",
  "InfoTooltip",
  "Input",
  "InputGroup",
  "Kbd",
  "Label",
  "LastSeen",
  "Latency",
  "LinearProgress",
  "Link",
  "Loader",
  "Logs",
  "Margins",
  "Markdown",
  "Menu",
  "MultiSelectCombobox",
  "MultiUserSelect",
  "OrganizationAutocomplete",
  "OverflowY",
  "PageHeader",
  "PaginationWidget",
  "PasswordField",
  "Paywall",
  "Pill",
  "Popover",
  "RadioGroup",
  "RichParameterInput",
  "ScrollArea",
  "Search",
  "SearchField",
  "Select",
  "SelectMenu",
  "Separator",
  "SettingsHeader",
  "Sidebar",
  "SignInLayout",
  "Skeleton",
  "Slider",
  "Spinner",
  "StackLabel",
  "Stats",
  "StatusIndicator",
  "StatusPill",
  "Switch",
  "SyntaxHighlighter",
  "Table",
  "TableEmpty",
  "TableLoader",
  "TableToolbar",
  "Tabs",
  "TagInput",
  "Textarea",
  "Timeline",
  "Toaster",
  "Tooltip",
  "UserAutocomplete",
  "Welcome",
]

export function CoderComponentGallery() {
  return (
    <CoderPanel className="p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.04] px-3 py-1 font-mono text-xs text-white/45">
            <Boxes className="h-3.5 w-3.5" />
            coder/coder · site/src/components
          </div>
          <h2 className="text-2xl font-semibold">Toutes les composantes Coder répertoriées</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/50">
            Cette section met toute la liste des composants UI publics du dossier Coder sur la deuxième page,
            afin que l’architecture Optimus puisse les mapper un par un vers des composants locaux compatibles Next.js.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/25 p-4 text-right">
          <p className="font-mono text-3xl font-semibold">{coderComponents.length}</p>
          <p className="text-xs uppercase tracking-[0.2em] text-white/35">components</p>
        </div>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {coderComponents.map((name, index) => (
          <div key={name} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[.03] px-3 py-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/[.06] text-white/60">
              {index % 3 === 0 ? <Component className="h-4 w-4" /> : <Layers3 className="h-4 w-4" />}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{name}</p>
              <p className="font-mono text-[10px] text-white/35">ready to map</p>
            </div>
          </div>
        ))}
      </div>
    </CoderPanel>
  )
}
