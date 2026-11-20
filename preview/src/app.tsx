import { useState } from "react"
import {
  ArrowSquareOutIcon,
  DownloadSimpleIcon,
  FolderIcon,
  MoonIcon,
  PencilSimpleIcon,
  PlusIcon,
  SquaresFourIcon,
  SunIcon,
  TrashIcon,
  ListIcon,
} from "@phosphor-icons/react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { DataRows, RowAction, RowGroupHeader } from "@/components/data-rows"
import { DetailAction, DetailPanel } from "@/components/detail-panel"
import { InfoGroup, InfoPanel, PropertyList } from "@/components/info-blocks"
import { PageFooter } from "@/components/page-footer"
import { PageHeader, PageSearch } from "@/components/page-header"
import { StateMessage } from "@/components/state-message"

type File = { id: string; name: string; kind: string; size: string; updated: string }

const FILES: File[] = [
  { id: "1", name: "Brand guidelines", kind: "PDF", size: "4.2 MB", updated: "12 Nov" },
  { id: "2", name: "Homepage hero", kind: "PNG", size: "1.1 MB", updated: "9 Nov" },
  { id: "3", name: "Pitch deck", kind: "Slides", size: "12 MB", updated: "2 Nov" },
  { id: "4", name: "Icon set", kind: "SVG", size: "380 KB", updated: "28 Oct" },
]

function ThemeToggle() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"))
  const flip = () => {
    const next = !dark
    document.documentElement.classList.toggle("dark", next)
    try {
      localStorage.setItem("bricks-theme", next ? "dark" : "light")
    } catch {}
    setDark(next)
  }
  return (
    <Button variant="ghost" size="icon" aria-label={dark ? "Use light theme" : "Use dark theme"} onClick={flip}>
      {dark ? <SunIcon aria-hidden /> : <MoonIcon aria-hidden />}
    </Button>
  )
}

export function App() {
  const params = new URLSearchParams(location.search)
  const [query, setQuery] = useState("")
  const [view, setView] = useState("list")
  const [selectedId, setSelectedId] = useState<string | undefined>("2")
  const [page, setPage] = useState(0)
  const rows = FILES.filter((f) => f.name.toLowerCase().includes(query.toLowerCase()))
  const selected = FILES.find((f) => f.id === selectedId)

  return (
    <TooltipProvider>
      <div className="flex h-screen flex-col bg-ground p-2">
        <main className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border border-surface-edge bg-background shadow-sm">
          <PageHeader
            crumbs={[
              { label: "Bricks", href: "#" },
              { label: "Preview", href: "#preview" },
            ]}
            title="Preview"
            controls={
              <>
                <PageSearch value={query} onChange={setQuery} placeholder="Search files" />
                <ThemeToggle />
                <Button variant="ghost" onClick={() => setQuery("")}>
                  Clear
                </Button>
                <Button variant="outline" onClick={() => toast("Files added", { action: { label: "Undo", onClick: () => {} } })}>
                  <PlusIcon aria-hidden />
                  Add files
                </Button>
                <Button>
                  <DownloadSimpleIcon aria-hidden />
                  Download
                </Button>
              </>
            }
          />
          <div className="flex min-h-0 flex-1">
            <aside className="hidden w-72 shrink-0 flex-col overflow-y-auto border-r md:flex">
              <InfoPanel>
                <InfoGroup>
                  <div className="flex flex-col gap-3">
                    <h3 className="text-section">Controls</h3>
                    <ToggleGroup type="single" value={view} onValueChange={(v) => v && setView(v)} className="w-full">
                      <ToggleGroupItem value="list" className="flex-1">List</ToggleGroupItem>
                      <ToggleGroupItem value="grid" className="flex-1">Grid</ToggleGroupItem>
                    </ToggleGroup>
                    <ToggleGroup type="single" defaultValue="rows">
                      <ToggleGroupItem value="rows" aria-label="Rows"><ListIcon aria-hidden /></ToggleGroupItem>
                      <ToggleGroupItem value="tiles" aria-label="Tiles"><SquaresFourIcon aria-hidden /></ToggleGroupItem>
                    </ToggleGroup>
                    <Input placeholder="A filled field" />
                    <Select defaultValue="png">
                      <SelectTrigger size="sm" className="w-full"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="png">PNG</SelectItem>
                        <SelectItem value="webp">WebP</SelectItem>
                        <SelectItem value="svg">SVG</SelectItem>
                      </SelectContent>
                    </Select>
                    <Slider defaultValue={[60]} />
                  </div>
                </InfoGroup>
                <InfoGroup>
                  <div className="flex flex-col gap-3">
                    <h3 className="text-section">Choices</h3>
                    <label className="flex items-center gap-2"><Checkbox defaultChecked /> Keep transparency</label>
                    <label className="flex items-center gap-2"><Switch defaultChecked /> Optimise</label>
                    <RadioGroup defaultValue="a">
                      <label className="flex items-center gap-2"><RadioGroupItem value="a" /> Original size</label>
                      <label className="flex items-center gap-2"><RadioGroupItem value="b" /> Half size</label>
                    </RadioGroup>
                  </div>
                </InfoGroup>
                <InfoGroup>
                  <div className="flex flex-col gap-3">
                    <h3 className="text-section">Badges</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge>Default</Badge>
                      <Badge variant="secondary">Secondary</Badge>
                      <Badge variant="outline">Outline</Badge>
                      <Badge variant="peach">No conversion</Badge>
                      <Badge variant="destructive">Failed</Badge>
                    </div>
                  </div>
                </InfoGroup>
                <InfoGroup>
                  <div className="flex flex-wrap gap-2">
                    <Dialog defaultOpen={params.has("dialog")}>
                      <DialogTrigger asChild>
                        <Button variant="outline">Open dialog</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete 4 files?</DialogTitle>
                          <DialogDescription>They’ll move to Deleted, where an admin can restore them.</DialogDescription>
                        </DialogHeader>
                        <Input placeholder="Reason (optional)" />
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button variant="destructive">Delete 4</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Sheet defaultOpen={params.has("sheet")}>
                      <SheetTrigger asChild>
                        <Button variant="outline">Open sheet</Button>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Manage labels</SheetTitle>
                          <SheetDescription>Rename or remove labels.</SheetDescription>
                        </SheetHeader>
                        <div className="px-4"><Input placeholder="New label" /></div>
                      </SheetContent>
                    </Sheet>
                  </div>
                </InfoGroup>
              </InfoPanel>
            </aside>

            <div data-listing className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-listing p-4">
              {rows.length ? (
                <div className="flex flex-col gap-6">
                  <DataRows
                    columns={[
                      { id: "name", header: "Name", cell: (r) => r.name },
                      { id: "kind", header: "Type", width: 72, cell: (r) => r.kind },
                      { id: "size", header: "Size", width: 80, hideBelow: "md", cell: (r) => r.size },
                      { id: "updated", header: "Updated", width: 72, hideBelow: "xl", cell: (r) => r.updated },
                    ]}
                    rows={rows}
                    selectedId={selectedId}
                    onSelect={(r) => setSelectedId(r.id)}
                    labelFor={(r) => r.name}
                    action={(r) => (
                      <RowAction label={`Open ${r.name} in a new tab`} href="#">
                        <ArrowSquareOutIcon aria-hidden />
                      </RowAction>
                    )}
                  />
                  <div className="mx-auto w-full max-w-[1200px]">
                    <RowGroupHeader>Empty state</RowGroupHeader>
                    <StateMessage
                      icon={FolderIcon}
                      title="Nothing in this folder"
                      body="Add files to see them here."
                      action={<Button>Add files</Button>}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex min-h-0 flex-1 flex-col">
                  <StateMessage
                    icon={FolderIcon}
                    title="No matches"
                    body="Try another search."
                    action={<Button onClick={() => setQuery("")}>Clear search</Button>}
                  />
                </div>
              )}
            </div>

            <DetailPanel
              title={selected?.name}
              subtitle={selected ? `${selected.kind} · ${selected.size}` : undefined}
              onClose={() => setSelectedId(undefined)}
              className={selected ? undefined : "max-lg:hidden"}
              actions={
                selected ? (
                  <>
                    <DetailAction label="Edit"><PencilSimpleIcon aria-hidden /></DetailAction>
                    <DetailAction label="Delete"><TrashIcon aria-hidden /></DetailAction>
                  </>
                ) : null
              }
            >
              {selected ? (
                <InfoPanel
                  stacked
                  footer={
                    <>
                      <Button variant="outline">Copy link</Button>
                      <Button>Download</Button>
                    </>
                  }
                >
                  <InfoGroup>
                    <div className="aspect-[4/3] rounded-md bg-muted" />
                  </InfoGroup>
                  <InfoGroup>
                    <PropertyList
                      items={[
                        { label: "Type", value: selected.kind },
                        { label: "Size", value: selected.size },
                        { label: "Updated", value: selected.updated },
                      ]}
                    />
                  </InfoGroup>
                </InfoPanel>
              ) : (
                <StateMessage icon={FolderIcon} title="Nothing selected" body="Pick a file to see its details." />
              )}
            </DetailPanel>
          </div>
          <PageFooter page={page} totalPages={3} onPrevious={() => setPage(page - 1)} onNext={() => setPage(page + 1)} />
        </main>
      </div>
      <Toaster position="bottom-right" />
    </TooltipProvider>
  )
}
