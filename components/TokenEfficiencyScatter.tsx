"use client";

import { buildLogTicks, humanTokens, pct } from "@/lib/format";
import type { ModelResult } from "@/lib/types";
import {
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

export default function TokenEfficiencyScatter({
  data
}: {
  data: ModelResult[];
}) {
  const points = data
    .filter((d) => (d.output_tokens ?? 0) > 0)
    .map((d) => ({
      name: d.name,
      accuracy: d.accuracy,
      logOut: Math.log10(d.output_tokens as number),
      out: d.output_tokens as number
    }));

  const minExp = Math.min(...points.map((p) => p.logOut));
  const maxExp = Math.max(...points.map((p) => p.logOut));
  const ticks = buildLogTicks(minExp, maxExp);

  return (
    <div className="h-[560px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 24, right: 24, bottom: 24, left: 80 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis
            type="number"
            dataKey="logOut"
            name="Output tokens (log scale)"
            tickFormatter={(v) => {
              const raw = Math.pow(10, v);
              return humanTokens(raw);
            }}
            ticks={ticks}
            tick={{ fill: "#9ca3af" }}
            label={{
              value: "Output tokens (log scale)",
              position: "insideBottom",
              offset: -6,
              fill: "#9ca3af"
            }}
          />
          <YAxis
            type="number"
            dataKey="accuracy"
            name="Score"
            domain={[0, 1]}
            tickFormatter={(v) => pct(v, 0)}
            tick={{ fill: "#9ca3af" }}
            label={{
              value: "Score",
              angle: -90,
              position: "insideLeft",
              fill: "#9ca3af",
              offset: 10
            }}
          />
          <Tooltip
            contentStyle={{
              background: "rgba(15,22,33,0.95)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 12
            }}
            labelStyle={{ color: "#e5e7eb" }}
            formatter={(value: any, name: any) => {
              if (name === "accuracy") return [pct(value), "Score"];
              if (name === "logOut")
                return [humanTokens(Math.pow(10, value)), "Output tokens"];
              return [value, name];
            }}
          />
          <Scatter
            data={points}
            fill="#84cc16"
            shape="circle"
            name="Models"
            stroke="#a3e635"
            strokeWidth={1.5}
          >
            <LabelList
              dataKey="name"
              position="top"
              className="label"
              fill="#e5e7eb"
              fontSize={12}
              offset={8}
            />
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}