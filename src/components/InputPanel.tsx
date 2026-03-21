// --- src/components/InputPanel.tsx ---

import { useState, useEffect } from 'react';
import { BONDS } from '../config/bonds';
import type { FormState } from '../hooks/useCalculator';

interface InputPanelProps {
  form: FormState;
  needsInflation: boolean;
  needsNBP: boolean;
  onUpdate: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}

/** 
 * Local component to handle numeric inputs with string state.
 * Prevents the "persistent 0" issue by allowing the input to be empty while typing.
 */
function NumericalInput({ 
  id, 
  label, 
  value, 
  onChange, 
  min = 0, 
  max = Infinity, 
  suffix = ""
}: { 
  id: string, 
  label: string, 
  value: number, 
  onChange: (val: number) => void,
  min?: number,
  max?: number,
  suffix?: string
}) {
  const [localValue, setLocalValue] = useState<string>(value === 0 ? "" : value.toString());

  // Sync from props when form state changes externally (e.g. initial load)
  useEffect(() => {
    const valString = value === 0 ? "" : value.toString();
    if (parseFloat(localValue) !== value && localValue !== "" && localValue !== valString) {
      setLocalValue(valString);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setLocalValue(raw);

    if (raw === "") {
      onChange(0);
      return;
    }

    const parsed = parseFloat(raw.replace(',', '.'));
    if (!isNaN(parsed)) {
      const clamped = Math.max(min, Math.min(max, parsed));
      onChange(clamped);
    }
  };

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1.5 focus:text-indigo-400 transition-colors">
        {label} {suffix && <span className="text-slate-500 font-normal">({suffix})</span>}
      </label>
      <input
        id={id}
        type="text"
        inputMode="decimal"
        value={localValue}
        onChange={handleChange}
        onFocus={(e) => e.target.select()}
        placeholder="0"
        className="w-full rounded-lg border border-slate-600 bg-slate-800/60 px-4 py-2.5 text-slate-100
                   placeholder-slate-500 outline-none transition-all
                   focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
      />
    </div>
  );
}

export function InputPanel({ form, needsInflation, needsNBP, onUpdate }: InputPanelProps) {
  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex-1 min-h-0 flex flex-col justify-between gap-4">
        {/* Monthly payment */}
        <NumericalInput
          id="monthlyPayment"
          label="Miesięczna wpłata"
          suffix="PLN"
          value={form.monthlyPayment}
          onChange={(v) => onUpdate('monthlyPayment', v)}
        />

        {/* Years */}
        <NumericalInput
          id="years"
          label="Okres oszczędzania"
          suffix="lata"
          value={form.years}
          onChange={(v) => onUpdate('years', v)}
          min={1}
          max={50}
        />

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
                       focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
          >
            {BONDS.map((b) => (
              <option key={b.id} value={b.id} className="bg-slate-800 text-slate-100">
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Inflation rate – only for COI / EDO */}
        {needsInflation && (
          <div className="animate-fade-in">
            <NumericalInput
              id="inflationRate"
              label="Przewidywana inflacja roczna"
              suffix="%"
              value={form.inflationRate}
              onChange={(v) => onUpdate('inflationRate', v)}
            />
          </div>
        )}

        {/* NBP rate – only for ROR / DOR / TOZ */}
        {needsNBP && (
          <div className="animate-fade-in">
            <NumericalInput
              id="nbpRate"
              label="Stopa referencyjna NBP"
              suffix="%"
              value={form.nbpRate}
              onChange={(v) => onUpdate('nbpRate', v)}
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
            <span aria-hidden="true" className="custom-checkbox-box h-5 w-5 shrink-0 group-hover:border-indigo-400 transition-colors">
              <span className="custom-checkbox-mark">✓</span>
            </span>
            <span className="text-sm text-slate-300 group-hover:text-indigo-200 transition-colors">
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
            <span aria-hidden="true" className="custom-checkbox-box h-5 w-5 shrink-0 group-hover:border-indigo-400 transition-colors">
              <span className="custom-checkbox-mark">✓</span>
            </span>
            <span className="text-sm text-slate-300 group-hover:text-indigo-200 transition-colors">
              Reinwestuj wypłacane odsetki
            </span>
          </label>
        </div>
      </div>

      {/* Summary box */}
      <div className="rounded-lg bg-indigo-500/5 border border-indigo-500/20 p-4 backdrop-blur-safari">
        <p className="text-xs uppercase tracking-wider text-indigo-400/80 mb-2 font-bold">Podsumowanie wejść</p>
        <div className="grid grid-cols-2 gap-y-1 text-sm">
          <span className="text-slate-400">Wpłata / miesiąc:</span>
          <span className="text-right font-medium text-slate-200">{form.monthlyPayment.toLocaleString('pl-PL')} PLN</span>
          <span className="text-slate-400">Łączna wpłata:</span>
          <span className="text-right font-semibold text-indigo-300">
            {(form.monthlyPayment * form.years * 12).toLocaleString('pl-PL')} PLN
          </span>
        </div>
      </div>
    </div>
  );
}

