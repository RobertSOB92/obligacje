// --- src/components/ResultsTable.tsx ---

import type { YearlySnapshot } from '../engine/bondCalculator';

interface ResultsTableProps {
  data: YearlySnapshot[];
}

function formatPLN(value: number): string {
  return value.toLocaleString('pl-PL', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + ' zł';
}

export function ResultsTable({ data }: ResultsTableProps) {
  if (data.length === 0) return null;

  return (
    <div>
      <h3 className="text-base font-semibold text-slate-200 mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        Szczegółowe zestawienie roczne
      </h3>

      <div className="overflow-x-auto rounded-xl border border-slate-700/40 bg-slate-900/20 backdrop-blur-sm">
        <table className="w-full text-sm text-slate-400 border-collapse">
          <thead>
            <tr className="bg-indigo-500/10 text-slate-200 border-b border-slate-700/50">
              <th className="px-6 py-4 text-center font-bold uppercase tracking-wider text-xs text-indigo-300/80">Rok</th>
              <th className="px-6 py-4 text-center font-bold uppercase tracking-wider text-xs text-indigo-300/80">Wpłacony Kapitał</th>
              <th className="px-6 py-4 text-center font-bold uppercase tracking-wider text-xs text-emerald-400/80">Zysk Netto</th>
              <th className="px-6 py-4 text-center font-bold uppercase tracking-wider text-xs text-slate-200">Wartość Portfela</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {data.map((row) => (
              <tr
                key={row.year}
                className="group hover:bg-indigo-500/5 transition-colors duration-150"
              >
                <td className="px-6 py-3.5 text-center font-semibold text-indigo-400/90 bg-indigo-500/5">
                  {row.year}
                </td>
                <td className="px-6 py-3.5 text-center tabular-nums text-slate-300 group-hover:text-indigo-200 transition-colors">
                  {formatPLN(row.zainwestowanyKapital)}
                </td>
                <td className="px-6 py-3.5 text-center tabular-nums font-medium text-emerald-400/90 group-hover:text-emerald-400 transition-colors">
                  {formatPLN(row.zyskNetto)}
                </td>
                <td className="px-6 py-3.5 text-center tabular-nums font-bold text-slate-100 bg-white/5">
                  {formatPLN(row.zainwestowanyKapital + row.zyskNetto)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
