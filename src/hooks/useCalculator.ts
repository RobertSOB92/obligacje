// --- src/hooks/useCalculator.ts ---
// Custom hook managing form state and reactive recalculation.

import { useState, useMemo } from 'react';
import { BONDS } from '../config/bonds';
import { simulateInvestment, type YearlySnapshot, type SimulationParams } from '../engine/bondCalculator';

export interface FormState {
  monthlyPayment: number;
  years: number;
  bondId: string;
  inflationRate: number;
  nbpRate: number;
  isIKE: boolean;
  reinvest: boolean;
}

const DEFAULT_STATE: FormState = {
  monthlyPayment: 500,
  years: 5,
  bondId: 'COI',
  inflationRate: 4.0,
  nbpRate: 5.75,
  isIKE: false,
  reinvest: true,
};

export function useCalculator() {
  const [form, setForm] = useState<FormState>(DEFAULT_STATE);

  const selectedBond = useMemo(
    () => BONDS.find((b) => b.id === form.bondId) ?? BONDS[0],
    [form.bondId],
  );

  const needsInflation = selectedBond.type === 'indexed_inflation';
  const needsNBP = selectedBond.type === 'variable_nbp';

  const results: YearlySnapshot[] = useMemo(() => {
    if (form.monthlyPayment <= 0 || form.years <= 0) return [];

    const params: SimulationParams = {
      monthlyPayment: form.monthlyPayment,
      years: form.years,
      bond: selectedBond,
      inflationRate: form.inflationRate / 100,
      nbpRate: form.nbpRate / 100,
      isIKE: form.isIKE,
      reinvest: form.reinvest,
    };

    return simulateInvestment(params);
  }, [form, selectedBond]);

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return { form, updateField, selectedBond, needsInflation, needsNBP, results };
}
