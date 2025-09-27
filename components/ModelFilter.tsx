"use client";

import { clsx } from "clsx";
import { useMemo, useState } from "react";

type Props = {
  allNames: string[];
  selected: Set<string>;
  onChange: (next: Set<string>) => void;
};

export default function ModelFilter({ allNames, selected, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return allNames;
    return allNames.filter((n) => n.toLowerCase().includes(s));
  }, [allNames, q]);

  const toggle = (name: string) => {
    const next = new Set(selected);
    if (next.has(name)) next.delete(name);
    else next.add(name);
    onChange(next);
  };

  const selectAll = () => onChange(new Set(allNames));
  const clearAll = () => onChange(new Set());

  const summary =
    selected.size === allNames.length
      ? "All models"
      : selected.size === 0
      ? "No models"
      : `${selected.size} selected`;

  return (
    <div className="relative">
      <div className="flex items-end justify-end">
        <div className="flex flex-col items-end gap-1">
          <div className="badge">
            <span className="opacity-80">Models:</span>
            <span className="font-medium text-ink">{summary}</span>
          </div>
          <button
            className="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
          >
            <span>Filter</span>
            <span aria-hidden>🔎</span>
          </button>
        </div>
      </div>

      {open && (
        <div
          className="card absolute right-0 z-20 mt-3 w-80 p-3 shadow-xl"
          role="dialog"
          aria-label="Model Filter"
        >
          <div className="mb-2 flex items-center gap-2">
            <input
              className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-ink placeholder:text-inkSoft focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Search models…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div className="mb-2 flex items-center gap-2">
            <button className="button" onClick={selectAll}>
              Select all
            </button>
            <button className="button" onClick={clearAll}>
              Clear
            </button>
          </div>

          <div className="max-h-72 overflow-auto rounded-lg border border-white/10">
            <ul className="divide-y divide-white/5">
              {filtered.map((name) => {
                const checked = selected.has(name);
                return (
                  <li
                    key={name}
                    className={clsx(
                      "flex cursor-pointer items-center gap-2 px-3 py-2 hover:bg-white/5",
                      checked && "bg-white/[0.06]"
                    )}
                    onClick={() => toggle(name)}
                    role="checkbox"
                    aria-checked={checked}
                  >
                    <input
                      type="checkbox"
                      className="accent-brand-500"
                      checked={checked}
                      onChange={() => toggle(name)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span className="text-sm">{name}</span>
                  </li>
                );
              })}
              {filtered.length === 0 && (
                <li className="px-3 py-6 text-center text-sm text-inkSoft">
                  No matches
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}