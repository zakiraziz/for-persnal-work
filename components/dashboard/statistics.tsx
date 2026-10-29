import {
  ArrowDownRight,
  ArrowUpRight,
  Eye,
  Heart,
  PlaySquare,
  Users,
} from "lucide-react";

const stats = [
  {
    label: "Total views",
    value: "24.6K",
    change: "+12.8%",
    trend: "up",
    description: "vs. previous period",
    icon: Eye,
    iconStyle: "bg-violet-400/10 text-violet-300",
    barStyle: "from-violet-500/70 to-violet-400/10",
    bars: [30, 43, 36, 61, 48, 74, 59, 91, 72, 100],
  },
  {
    label: "Subscribers",
    value: "1,284",
    change: "+8.2%",
    trend: "up",
    description: "vs. previous period",
    icon: Users,
    iconStyle: "bg-blue-400/10 text-blue-300",
    barStyle: "from-blue-500/70 to-blue-400/10",
    bars: [34, 41, 38, 55, 50, 67, 60, 82, 73, 100],
  },
  {
    label: "Videos published",
    value: "18",
    change: "+3 this month",
    trend: "up",
    description: "across your channel",
    icon: PlaySquare,
    iconStyle: "bg-emerald-400/10 text-emerald-300",
    barStyle: "from-emerald-500/70 to-emerald-400/10",
    bars: [22, 38, 31, 52, 45, 70, 60, 79, 69, 100],
  },
  {
    label: "Engagement rate",
    value: "6.4%",
    change: "+0.6%",
    trend: "up",
    description: "vs. previous period",
    icon: Heart,
    iconStyle: "bg-pink-400/10 text-pink-300",
    barStyle: "from-pink-500/70 to-pink-400/10",
    bars: [41, 35, 57, 48, 62, 54, 80, 68, 86, 100],
  },
];

export function Statistics() {
  return (
    <section aria-label="Channel statistics" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <article
            key={stat.label}
            className="group relative overflow-hidden rounded-xl border border-white/[0.07] bg-surface p-4 transition duration-200 hover:-translate-y-0.5 hover:border-white/[0.13] hover:bg-[#121b2f] sm:p-[18px]"
            style={{ animationDelay: `${index * 45}ms` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-medium text-slate-400">
                  {stat.label}
                </p>
                <p className="mt-2 text-[25px] font-semibold leading-none tracking-[-0.04em] text-white">
                  {stat.value}
                </p>
              </div>
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.iconStyle}`}>
                <Icon size={16} />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="flex items-center gap-0.5 rounded bg-emerald-400/[0.08] px-1.5 py-0.5 text-[9px] font-medium text-emerald-300">
                  {stat.trend === "up" ? (
                    <ArrowUpRight size={11} />
                  ) : (
                    <ArrowDownRight size={11} />
                  )}
                  {stat.change}
                </span>
                <span className="text-[9px] text-slate-600">{stat.description}</span>
              </div>
              <div className="flex h-6 items-end gap-[3px]" aria-hidden="true">
                {stat.bars.map((height, barIndex) => (
                  <span
                    key={`${stat.label}-${barIndex}`}
                    className={`w-[3px] rounded-t-sm bg-gradient-to-t ${stat.barStyle} opacity-80`}
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>
            <span className="absolute right-3 top-1.5 text-[8px] uppercase tracking-[0.11em] text-slate-600">
              Demo
            </span>
          </article>
        );
      })}
    </section>
  );
}
