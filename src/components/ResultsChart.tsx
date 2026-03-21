// --- src/components/ResultsChart.tsx ---

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  type TooltipContentProps,
} from 'recharts';
import type { YearlySnapshot } from '../engine/bondCalculator';

interface ResultsChartProps {
  data: YearlySnapshot[];
}

function formatPLN(value: number): string {
  return value.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' PLN';
}

function toNumericValue(value: unknown): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function CustomTooltip({ active, payload, label }: TooltipContentProps) {
  if (!active || !payload || payload.length === 0) return null;

  const invested = toNumericValue(payload.find((p) => p.dataKey === 'zainwestowanyKapital')?.value);
  const profit = toNumericValue(payload.find((p) => p.dataKey === 'zyskNetto')?.value);

  return (
    <div className="rounded-lg bg-slate-800 border border-slate-600 p-3 shadow-xl text-sm">
      <p className="font-semibold text-slate-200 mb-2">Rok {label}</p>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-indigo-500 inline-block" />
          <span className="text-slate-400">Kapitał:</span>
          <span className="ml-auto font-medium text-slate-200">{formatPLN(invested)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500 inline-block" />
          <span className="text-slate-400">Zysk netto:</span>
          <span className="ml-auto font-medium text-emerald-400">{formatPLN(profit)}</span>
        </div>
        <hr className="border-slate-700 my-1" />
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Razem:</span>
          <span className="ml-auto font-bold text-slate-100">{formatPLN(invested + profit)}</span>
        </div>
      </div>
    </div>
  );
}

export function ResultsChart({ data }: ResultsChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px] text-slate-500">
        <p className="text-center">
          Wprowadź dane w panelu po lewej,
          <br />
          aby zobaczyć wyniki symulacji.
        </p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.zainwestowanyKapital + d.zyskNetto));

  return (
    <div className="w-full h-full min-h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis
            dataKey="year"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            label={{ value: 'Rok', position: 'insideBottomRight', offset: -5, fill: '#64748b', fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)}
            domain={[0, Math.ceil(maxValue * 1.1)]}
            width={55}
          />
          <Tooltip content={CustomTooltip} cursor={{ fill: 'rgba(148, 163, 184, 0.08)' }} />
          <Legend
            wrapperStyle={{ paddingTop: '12px' }}
            formatter={(value: string) => (
              <span className="text-sm text-slate-300">{value}</span>
            )}
          />
          <Bar
            dataKey="zainwestowanyKapital"
            name="Zainwestowany Kapitał"
            stackId="portfolio"
            fill="#6366f1"
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="zyskNetto"
            name="Zysk Netto"
            stackId="portfolio"
            fill="#22c55e"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
