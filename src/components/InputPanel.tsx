// --- src/components/InputPanel.tsx ---

import { BONDS } from '../config/bonds';
import type { FormState } from '../hooks/useCalculator';

interface InputPanelProps {
  form: FormState;
  needsInflation: boolean;
  needsNBP: boolean;
  onUpdate: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}

export function InputPanel({ form, needsInflation, needsNBP, onUpdate }: InputPanelProps) {
  return (
    <div className="space-y-5">
      {/* Monthly payment */}
      <div>
        <label htmlFor="monthlyPayment" className="block text-sm font-medium text-slate-300 mb-1.5">
          Miesięczna wpłata (PLN)
        </label>
        <input
          id="monthlyPayment"
          type="number"
          min={0}
          step={50}
          value={form.monthlyPayment}
          onChange={(e) => onUpdate('monthlyPayment', Math.max(0, Number(e.target.value)))}
          onFocus={(e) => e.target.select()}
          className="w-full rounded-lg border border-slate-600 bg-slate-800/60 px-4 py-2.5 text-slate-100
                     placeholder-slate-500 outline-none transition-all
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
        />
      </div>

      {/* Years */}
      <div>
        <label htmlFor="years" className="block text-sm font-medium text-slate-300 mb-1.5">
          Okres oszczędzania (lata)
        </label>
        <input
          id="years"
          type="number"
          min={1}
          max={50}
          value={form.years}
          onChange={(e) => onUpdate('years', Math.max(1, Math.min(50, Number(e.target.value))))}
          onFocus={(e) => e.target.select()}
          className="w-full rounded-lg border border-slate-600 bg-slate-800/60 px-4 py-2.5 text-slate-100
                     placeholder-slate-500 outline-none transition-all
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
        />
      </div>

      {/* Bond type */}
      <div>
        <label htmlFor="bondType" className="block text-sm font-medium text-slate-300 mb-1.5">
          Rodzaj obligacji
        </label>
        <select
          id="bondType"
          value={form.bondId}
          onChange={(e) => onUpdate('bondId', e.target.value)}
          className="w-full rounded-lg border border-slate-600 bg-slate-800/60 px-4 py-2.5 text-slate-100
                     outline-none transition-all cursor-pointer
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
        >
          {BONDS.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      {/* Inflation rate – only for COI / EDO */}
      {needsInflation && (
        <div className="animate-fade-in">
          <label htmlFor="inflationRate" className="block text-sm font-medium text-slate-300 mb-1.5">
            Przewidywana inflacja roczna (%)
          </label>
          <input
            id="inflationRate"
            type="number"
            min={0}
            step={0.1}
            value={form.inflationRate}
            onChange={(e) => onUpdate('inflationRate', Math.max(0, Number(e.target.value)))}
            onFocus={(e) => e.target.select()}
            className="w-full rounded-lg border border-slate-600 bg-slate-800/60 px-4 py-2.5 text-slate-100
                       placeholder-slate-500 outline-none transition-all
                       focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
      )}

      {/* NBP rate – only for ROR / DOR / TOZ */}
      {needsNBP && (
        <div className="animate-fade-in">
          <label htmlFor="nbpRate" className="block text-sm font-medium text-slate-300 mb-1.5">
            Stopa referencyjna NBP (%)
          </label>
          <input
            id="nbpRate"
            type="number"
            min={0}
            step={0.25}
            value={form.nbpRate}
            onChange={(e) => onUpdate('nbpRate', Math.max(0, Number(e.target.value)))}
            onFocus={(e) => e.target.select()}
            className="w-full rounded-lg border border-slate-600 bg-slate-800/60 px-4 py-2.5 text-slate-100
                       placeholder-slate-500 outline-none transition-all
                       focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
      )}

      {/* Checkboxes */}
      <div className="flex flex-col gap-3 pt-1">
        <label htmlFor="ike" className="flex items-center gap-3 cursor-pointer group select-none">
          <input
            id="ike"
            type="checkbox"
            checked={form.isIKE}
            onChange={(e) => onUpdate('isIKE', e.target.checked)}
            className="custom-checkbox-input sr-only"
          />
          <span aria-hidden="true" className="custom-checkbox-box h-5 w-5 shrink-0">
            <span className="custom-checkbox-mark">✓</span>
          </span>
          <span className="text-sm text-slate-300 group-hover:text-slate-100 transition-colors">
            Konto IKE (bez podatku Belki)
          </span>
        </label>

        <label htmlFor="reinvest" className="flex items-center gap-3 cursor-pointer group select-none">
          <input
            id="reinvest"
            type="checkbox"
            checked={form.reinvest}
            onChange={(e) => onUpdate('reinvest', e.target.checked)}
            className="custom-checkbox-input sr-only"
          />
          <span aria-hidden="true" className="custom-checkbox-box h-5 w-5 shrink-0">
            <span className="custom-checkbox-mark">✓</span>
          </span>
          <span className="text-sm text-slate-300 group-hover:text-slate-100 transition-colors">
            Reinwestuj wypłacane odsetki
          </span>
        </label>
      </div>

      {/* Summary box */}
      <div className="mt-2 rounded-lg bg-slate-800/40 border border-slate-700 p-4">
        <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">Podsumowanie wejść</p>
        <div className="grid grid-cols-2 gap-y-1 text-sm">
          <span className="text-slate-400">Wpłata / miesiąc:</span>
          <span className="text-right font-medium text-slate-200">{form.monthlyPayment.toLocaleString('pl-PL')} PLN</span>
          <span className="text-slate-400">Łączna wpłata:</span>
          <span className="text-right font-medium text-slate-200">
            {(form.monthlyPayment * form.years * 12).toLocaleString('pl-PL')} PLN
          </span>
        </div>
      </div>
    </div>
  );
}
