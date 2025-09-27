"use client";

import CostChart from "@/components/CostChart";
import EfficiencyScatter from "@/components/EfficiencyScatter";
import ModelFilter from "@/components/ModelFilter";
import ScoreChart from "@/components/ScoreChart";
import TokenEfficiencyScatter from "@/components/TokenEfficiencyScatter";
import type { IntegrityInfo, ModelResult, RawModelResult } from "@/lib/types";
import { clsx } from "clsx";
import { useEffect, useMemo, useState } from "react";

type ViewKey = "score" | "cost" | "efficiency" | "token";

function normalizeResults(rows: RawModelResult[]): ModelResult[] {
  return rows.map((r) => {
    const hasNominalCost =
      typeof r.nominal_cost === "number" && Number.isFinite(r.nominal_cost);
    const hasNominalPrice =
      typeof r.nominal_price === "number" && Number.isFinite(r.nominal_price);

    const nominalCost = hasNominalCost
      ? Number(r.nominal_cost)
      : hasNominalPrice
      ? Number(r.nominal_price) * 100
      : null;

    return {
      ...r,
      nominalCost
    };
  });
}

function parseIntegrity(text: string): IntegrityInfo {
  const lines = text.split(/\r?\n/);
  const files: Record<string, string> = {};
  let generatedAt: string | undefined;

  for (const line of lines) {
    if (line.startsWith("index.html:")) {
      const value = line.split(":")[1];
      if (value !== undefined) {
        files["index.html"] = value.trim();
      }
    } else if (line.startsWith("results.json:")) {
      const value = line.split(":")[1];
      if (value !== undefined) {
        files["results.json"] = value.trim();
      }
    } else if (line.startsWith("Generated:")) {
      generatedAt = line.replace("Generated:", "").trim();
    }
  }
  return { files, generatedAt };
}

export default function Page() {
  const [view, setView] = useState<ViewKey>("score");
  const [raw, setRaw] = useState<ModelResult[] | null>(null);
  const [integrity, setIntegrity] = useState<IntegrityInfo | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    const load = async () => {
      const [resData, resIntegrity] = await Promise.all([
        fetch("/data/results.json", { cache: "no-store" }),
        fetch("/data/integrity.txt", { cache: "no-store" })
      ]);
      const json = (await resData.json()) as RawModelResult[];
      const text = await resIntegrity.text();

      const normalized = normalizeResults(json);
      setRaw(normalized);
      setSelected(new Set(normalized.map((r) => r.name)));

      setIntegrity(parseIntegrity(text));
    };
    void load();
  }, []);

  const allNames = useMemo(
    () => (raw ? raw.map((r) => r.name) : []),
    [raw]
  );

  const filtered = useMemo(() => {
    if (!raw) return [];
    const set = selected;
    return raw.filter((r) => set.has(r.name));
  }, [raw, selected]);

  const modelCount = raw?.length ?? 0;
  const lastUpdated = integrity?.generatedAt ?? "—";

  const nav = [
    {
      key: "score" as const,
      label: "Score",
      emoji: "🧠",
      title: "Score by Model",
      blurb:
        "Accuracy with uncertainty. Sorted by score, higher is better."
    },
    {
      key: "cost" as const,
      label: "Cost",
      emoji: "💰",
      title: "Cost by Model",
      blurb:
        "Average cost per test in cents (lower is better). Sorted by cost."
    },
    {
      key: "efficiency" as const,
      label: "Efficiency",
      emoji: "⚖️",
      title: "Score vs Cost",
      blurb: "Higher score and lower cost is better."
    },
    {
      key: "token" as const,
      label: "Token Efficiency",
      emoji: "🧮",
      title: "Score vs Output Tokens",
      blurb:
        "Per-token compute capability may be a useful metric for estimating closed-lab internal costs and doubles as an approximation of latency."
    }
  ];

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <header className="mb-8 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white">
            LateralBench
          </h1>
          <p className="mt-2 max-w-2xl text-inkSoft">
            Multi-turn lateral thinking questions
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="badge">
              <span>Models:</span>
              <span className="font-medium text-ink">{modelCount}</span>
            </span>
            <span className="badge">
              <span>Last updated:</span>
              <span className="font-medium text-ink">{lastUpdated}</span>
            </span>
          </div>
        </div>

        <div className="flex-shrink-0">
          <ModelFilter
            allNames={allNames}
            selected={selected}
            onChange={setSelected}
          />
        </div>
      </header>

      <section className="card p-4 md:p-6">
        <nav className="mb-4 flex flex-wrap gap-2">
          {nav.map((n) => (
            <button
              key={n.key}
              onClick={() => setView(n.key)}
              className={clsx(
                "button",
                view === n.key && "button-active",
                "rounded-2xl"
              )}
              aria-pressed={view === n.key}
            >
              <span aria-hidden>{n.emoji}</span>
              <span>{n.label}</span>
            </button>
          ))}
        </nav>

        <div className="mb-2 flex items-baseline justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">
              {
                nav.find((n) => n.key === view)?.title ??
                (view === "score"
                  ? "Score by Model"
                  : view === "cost"
                  ? "Cost by Model"
                  : view === "efficiency"
                  ? "Score vs Cost"
                  : "Score vs Output Tokens")
              }
            </h2>
            <p className="mt-1 max-w-3xl text-sm text-inkSoft">
              {nav.find((n) => n.key === view)?.blurb}
            </p>
          </div>
        </div>

        {!raw ? (
          <div className="flex h-[560px] items-center justify-center">
            <div className="text-inkSoft">Loading...</div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex h-[560px] items-center justify-center">
            <div className="text-inkSoft">
              No models selected. Use the filter above.
            </div>
          </div>
        ) : view === "score" ? (
          <ScoreChart data={filtered} />
        ) : view === "cost" ? (
          <CostChart data={filtered} />
        ) : view === "efficiency" ? (
          <EfficiencyScatter data={filtered} />
        ) : (
          <TokenEfficiencyScatter data={filtered} />
        )}
      </section>

      <footer className="mt-10 text-center text-xs text-inkSoft">
        Built with Next.js and Tailwind.
      </footer>
    </main>
  );
}