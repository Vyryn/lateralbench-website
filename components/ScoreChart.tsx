"use client";

import { pct } from "@/lib/format";
import type { ModelResult } from "@/lib/types";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ErrorBar,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

export default function ScoreChart({ data }: { data: ModelResult[] }) {
  const chartData = data
    .map((d) => ({
      name: d.name,
      accuracy: d.accuracy,
      stderr: d.stderr
    }))
    .sort((a, b) => b.accuracy - a.accuracy);

  return (
    <div className="h-[560px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 24, right: 24, bottom: 24, left: 160 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis
            dataKey="name"
            type="category"
            interval={0}
            angle={-35}
            textAnchor="end"
            height={80}
            tick={{ fill: "#e5e7eb"}}
            tickLine={false}
            />
          <YAxis
            type="number"
            domain={[0, 1]}
            tickFormatter={(v) => pct(v, 0)}
            tick={{ fill: "#9ca3af" }}
            width={64}
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
              if (name === "stderr") return [pct(value), "± stderr"];
              return [value, name];
            }}
          />
          <Bar
            dataKey="accuracy"
            fill="url(#scoreGradient)"
            radius={[8, 8, 8, 8]}
            barSize={40}
          >
            <LabelList
              dataKey="accuracy"
              position="top"
              formatter={(v: number) => pct(v)}
              fill="#e5e7eb"
              className="label"
            />
            <ErrorBar
              dataKey="stderr"
              direction="y"
              stroke="#F59E0B"
              strokeWidth={2}
              width={5}
              strokeOpacity={0.95}
            />
          </Bar>
          <defs>
            <linearGradient id="scoreGradient" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}