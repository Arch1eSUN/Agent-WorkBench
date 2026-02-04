import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";


function TopBar() {
  return (
    <header className="sticky top-0 z-20">
      <div className="mx-auto max-w-[1400px] px-4 pt-4">
        <div className="glass glass-highlight glass-grain px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-[rgba(255,255,255,0.16)] ring-1 ring-white/10" />
              <div>
                <div className="ui-title">Agent Workbench</div>
                <div className="ui-micro">Winston · Liquid Glass</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="kbd">⌘K</span>
              <span className="ui-micro">Quick nav</span>
              
              <span className="ml-2"><ThemeToggle /></span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export function WorkbenchShell(props: {
  sidebar: ReactNode;
  main: ReactNode;
  inspector: ReactNode;
  timeline: ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <TopBar />

      <div className="mx-auto grid max-w-[1400px] grid-cols-12 gap-4 px-4 py-4">
        <aside className="col-span-12 md:col-span-3 lg:col-span-2 h-[calc(100vh-6rem)] sticky top-24">
          <div className="glass glass-highlight glass-grain p-5 flex flex-col h-full">{props.sidebar}</div>
        </aside>

        <main className="col-span-12 md:col-span-6 lg:col-span-7 space-y-4">
          <div className="glass glass-highlight glass-grain p-5 flex flex-col h-full">{props.main}</div>
          <div className="glass glass-highlight glass-grain p-5 flex flex-col h-full">{props.timeline}</div>
        </main>

        <section className="col-span-12 md:col-span-3 lg:col-span-3">
          <div className="glass glass-highlight glass-grain p-5 flex flex-col h-full">{props.inspector}</div>
        </section>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 pb-6">
        <div className="glass-subtle glass-grain px-4 py-3 ui-micro">
          Tip: The UI is being styled to match Apple’s “Liquid Glass” guidance (translucency, layered materials,
          restrained shadows, and generous spacing).
        </div>
      </div>
    </div>
  );
}
