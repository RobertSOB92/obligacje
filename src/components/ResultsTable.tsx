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

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-indigo-950/60 text-indigo-100 border-b border-indigo-500/30">
              <th className="px-6 py-4 text-center font-bold uppercase tracking-wider text-xs">Rok</th>
              <th className="px-6 py-4 text-center font-bold uppercase tracking-wider text-xs">Wpłacony Kapitał</th>
              <th className="px-6 py-4 text-center font-bold uppercase tracking-wider text-xs text-emerald-400">Zysk Netto</th>
              <th className="px-6 py-4 text-center font-bold uppercase tracking-wider text-xs">Wartość Portfela</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40">
            {data.map((row) => (
              <tr
                key={row.year}
                className="group hover:bg-slate-800/40 transition-colors duration-150"
              >
                <td className="px-6 py-4 text-center font-bold text-indigo-400">
                  {row.year}
                </td>
                <td className="px-6 py-4 text-center tabular-nums text-slate-300 group-hover:text-white transition-colors">
                  {formatPLN(row.zainwestowanyKapital)}
                </td>
                <td className="px-6 py-4 text-center tabular-nums font-semibold text-emerald-400 group-hover:text-emerald-300 transition-colors">
                  {formatPLN(row.zyskNetto)}
                </td>
                <td className="px-6 py-4 text-center tabular-nums font-bold text-slate-100">
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
