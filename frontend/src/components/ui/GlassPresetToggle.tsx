"use client";

import { useEffect, useMemo, useState } from "react";

type Preset = "soft" | "default" | "vivid";

type PresetOption = typeof OPTIONS[number];

const OPTIONS = ["soft", "default", "vivid"] as const;

function readPreset(): Preset {
  if (typeof window === "undefined") return "vivid";
  const v = window.localStorage.getItem("glassPreset") as Preset | null;
  return v ?? "vivid";
}

function applyPreset(preset: Preset) {
  try {
    localStorage.setItem("glassPreset", preset);
  } catch {
    // ignore
  }
  document.documentElement.setAttribute("data-glass", preset);
}

export function GlassPresetToggle() {
  const [preset, setPreset] = useState<Preset>(() => readPreset());
  const options = useMemo(() => OPTIONS, []);

  // keep DOM in sync once on mount
  useEffect(() => {
    applyPreset(preset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex items-center gap-2">
      <span className="ui-micro">Glass</span>
      <div className="flex items-center rounded-full border border-white/10 bg-black/10 p-1">
        {options.map((opt: PresetOption) => {
          const selected = opt === preset;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => {
                setPreset(opt);
                applyPreset(opt);
              }}
              className={
                "rounded-full px-2.5 py-1 ui-micro transition " +
                (selected
                  ? "bg-white/15 text-white shadow-[0_1px_0_rgba(255,255,255,0.18)]"
                  : "text-white/70 hover:bg-white/10")
              }
              aria-pressed={selected}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
