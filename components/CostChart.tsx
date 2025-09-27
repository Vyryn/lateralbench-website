"use client";

import { buildLogTicks, cents } from "@/lib/format";
import type { ModelResult } from "@/lib/types";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

export default function CostChart({ data }: { data: ModelResult[] }) {
  const filtered = data.filter((d) => d.nominalCost != null);
  const chartData = filtered
    .map((d) => {
      const nominalCost = d.nominalCost as number;
      return {
        name: d.name,
        nominalCost,
        logCost: Math.log10(Math.max(nominalCost, 1e-9))
      };
    })
    .sort((a, b) => (b.nominalCost ?? 0) - (a.nominalCost ?? 0));
  if (chartData.length === 0) {
    return (
      <div className="h-[560px] w-full flex items-center justify-center text-inkSoft">
        No cost data
     </div>
    );
  }


  const minLog = Math.floor(Math.min(...chartData.map((d) => d.logCost)));
  const maxLog = Math.ceil(Math.max(...chartData.map((d) => d.logCost)));
  const ticks = buildLogTicks(minLog, maxLog);

  return (
    <div className="h-[560px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 36, right: 24, bottom: 120, left: 24 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis
            dataKey="name"
            type="category"
            interval={0}
            angle={-35}
            textAnchor="end"
            height={80}
            tick={{ fill: "#9ca3af"}}
            tickLine={false}
          />
          <YAxis
            type="number"
            domain={[minLog - 0.1, maxLog + 0.1]}
            ticks={ticks}
            tickFormatter={(v) => {
              const raw = Math.pow(10, v);
              return cents(raw);
            }}
            width={80}
          />
          <Tooltip
            contentStyle={{
              background: "rgba(15,22,33,0.95)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 12
            }}
            labelStyle={{ color: "#e5e7eb" }}
            formatter={(value: any, name: any, props: any) => {
              if (name === "logCost") {
                const centVal = Math.pow(10, value);
                return [cents(centVal), "Cost"];
              }
              return [value, name];
            }}
          />
          <Bar
            dataKey="logCost"
            fill="url(#costGradient)"
            radius={[8, 8, 8, 8]}
            barSize={40}
          >
            <LabelList
              dataKey="nominalCost"
              position="top"
              formatter={(v: number) => cents(v)}
              fill="#e5e7eb"
              className="label"
            />
          </Bar>
          <defs>
            <linearGradient id="costGradient" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}