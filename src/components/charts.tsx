export function Sparkline({ values = [12, 18, 14, 24, 20, 32] }: { values?: number[] }) {
  const max = Math.max(...values, 1)
  const points = values.map((v, i) => `${(i / Math.max(values.length - 1, 1)) * 100},${40 - (v / max) * 36}`).join(' ')
  return (
    <svg viewBox="0 0 100 44" className="h-12 w-full" role="img" aria-label="Trend chart">
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="3" className="text-zinc-900" />
    </svg>
  )
}

export function BarChart({ values = [20, 48, 32, 64, 44, 72] }: { values?: number[] }) {
  const max = Math.max(...values, 1)
  return (
    <div className="flex h-32 items-end gap-2">
      {values.map((value, index) => (
        <div key={index} className="flex-1 rounded-t bg-zinc-900" style={{ height: `${Math.max(8, (value / max) * 100)}%` }} />
      ))}
    </div>
  )
}

export function LineChart({ data = [20, 35, 28, 50, 42, 60, 55], labels = [] as string[], color = '#18181b' }: { data?: number[]; labels?: string[]; color?: string }) {
  const max = Math.max(...data, 1)
  const points = data.map((v, i) => `${(i / Math.max(data.length - 1, 1)) * 100},${56 - (v / max) * 52}`).join(' ')
  return (
    <svg viewBox="0 0 100 60" className="h-32 w-full" role="img" aria-label="Line chart">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
      {data.map((v, i) => (
        <circle key={i} cx={(i / Math.max(data.length - 1, 1)) * 100} cy={56 - (v / max) * 52} r="2" fill={color} />
      ))}
    </svg>
  )
}

export function DonutChart({ value = 72 }: { value?: number }) {
  return (
    <div className="grid h-28 w-28 place-items-center rounded-full border-[14px] border-zinc-900 bg-white text-xl font-bold text-zinc-950">
      {value}%
    </div>
  )
}
