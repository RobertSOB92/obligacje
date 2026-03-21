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

      <div className="overflow-x-auto rounded-lg border border-slate-700/50">
        <table className="w-full text-sm text-slate-300">
          <thead>
            <tr className="bg-slate-800/80 text-slate-200">
              <th className="px-4 py-3 text-left font-semibold">Rok</th>
              <th className="px-4 py-3 text-right font-semibold">Wpłacony Kapitał</th>
              <th className="px-4 py-3 text-right font-semibold">Zysk Netto</th>
              <th className="px-4 py-3 text-right font-semibold">Wartość Portfela</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={row.year}
                className={
                  index % 2 === 0
                    ? 'bg-slate-900/30'
                    : 'bg-slate-800/20'
                }
              >
                <td className="px-4 py-2.5 font-medium text-slate-200">{row.year}</td>
                <td className="px-4 py-2.5 text-right tabular-nums">{formatPLN(row.zainwestowanyKapital)}</td>
                <td className="px-4 py-2.5 text-right tabular-nums text-emerald-400">{formatPLN(row.zyskNetto)}</td>
                <td className="px-4 py-2.5 text-right tabular-nums font-semibold text-slate-100">
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
