"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { weeklyViews, type Period } from "@/lib/dashboard-data";

const periodValues: Record<Period, number[]> = {
  "7 days": weeklyViews.map((point) => point.views),
  "30 days": [1420, 2100, 1980, 2650, 2300, 3100, 2840],
  "90 days": [1750, 1620, 2400, 2260, 2940, 3180, 3860],
};

export function ViewsChart() {
  const [period, setPeriod] = useState<Period>("7 days");
  const values = periodValues[period];
  const total = useMemo(
    () => values.reduce((sum, value) => sum + value, 0),
    [values],
  );
  const max = 5000;
  const chartWidth = 640;
  const chartHeight = 178;
  const left = 38;
  const right = 10;
  const top = 14;
  const bottom = 23;
  const innerWidth = chartWidth - left - right;
  const innerHeight = chartHeight - top - bottom;
  const points = values.map((value, index) => ({
    x: left + (innerWidth * index) / (values.length - 1),
    y: top + innerHeight - (value / max) * innerHeight,
  }));
  const line = points.map((point) => `${point.x},${point.y}`).join(" ");
  const area = `${left},${top + innerHeight} ${line} ${left + innerWidth},${top + innerHeight}`;
  const labels =
    period === "7 days"
      ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      : period === "30 days"
        ? ["Oct 1", "Oct 5", "Oct 10", "Oct 15", "Oct 20", "Oct 25", "Oct 29"]
        : ["Aug 1", "Aug 15", "Sep 1", "Sep 15", "Oct 1", "Oct 15", "Oct 29"];

  return (
    <section className="rounded-xl border border-white/[0.07] bg-surface p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-[13px] font-semibold text-slate-100">Views over time</h2>
            <span className="rounded border border-violet-300/15 bg-violet-300/[0.07] px-1.5 py-0.5 text-[8px] font-medium uppercase tracking-wide text-violet-200">
              Demo data
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-[24px] font-semibold tracking-[-0.04em] text-white">
              {total.toLocaleString()}
            </p>
            <span className="text-[10px] text-slate-500">
              estimated views · {period.toLowerCase()}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <label className="sr-only" htmlFor="views-period">
            Chart date range
          </label>
          <div className="relative">
            <select
              id="views-period"
              value={period}
              onChange={(event) => setPeriod(event.target.value as Period)}
              className="appearance-none rounded-lg border border-white/[0.08] bg-[#0d1424] py-2 pl-3 pr-8 text-[10px] text-slate-300 hover:border-white/[0.15]"
            >
              {Object.keys(periodValues).map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <ChevronDown
              size={13}
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500"
            />
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 text-[9px] text-slate-500">
        <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
        Views <span className="text-slate-700">·</span> Sample data for preview only
      </div>
      <div className="mt-2 w-full">
        <svg
          role="img"
          aria-label={`${period} demo views chart, ${total.toLocaleString()} total views`}
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="h-[175px] w-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.24" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3].map((step) => {
            const y = top + (innerHeight * step) / 3;
            const label = `${Math.round((max * (3 - step)) / 3 / 1000)}k`;
            return (
              <g key={step}>
                <line
                  x1={left}
                  x2={chartWidth - right}
                  y1={y}
                  y2={y}
                  stroke="rgba(148,163,184,0.10)"
                  strokeDasharray={step === 3 ? "0" : "3 5"}
                />
                <text
                  x="0"
                  y={y + 3}
                  fill="#68748a"
                  fontSize="9"
                  fontFamily="Arial, sans-serif"
                >
                  {label}
                </text>
              </g>
            );
          })}
          <polygon points={area} fill="url(#chart-fill)" />
          <polyline
            points={line}
            fill="none"
            stroke="#9b7afa"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          {points.map((point, index) => (
            <g key={labels[index]}>
              <circle
                cx={point.x}
                cy={point.y}
                r="3"
                fill="#b4a1ff"
                stroke="#101729"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
              <text
                x={point.x}
                y={chartHeight - 3}
                fill="#68748a"
                fontSize="9"
                textAnchor="middle"
                fontFamily="Arial, sans-serif"
              >
                {labels[index]}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </section>
  );
}
