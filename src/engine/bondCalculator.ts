// --- src/engine/bondCalculator.ts ---
// Pure calculation engine — no React dependencies. Simulates month-by-month
// investment in Polish treasury bonds with Mark-to-Market yearly valuation.

import type { BondDefinition } from '../config/bonds';

// ─── Public types ────────────────────────────────────────────────────────────

export interface SimulationParams {
  monthlyPayment: number;       // PLN per month
  years: number;                // total years
  bond: BondDefinition;
  inflationRate: number;        // annual, e.g. 0.04 = 4%
  nbpRate: number;              // annual reference rate
  isIKE: boolean;
  reinvest: boolean;
}

export interface YearlySnapshot {
  year: number;
  zainwestowanyKapital: number; // user deposits actually deployed in bonds
  zyskNetto: number;            // mark-to-market net profit (after virtual tax)
}

// ─── Internal helpers ────────────────────────────────────────────────────────

/** A single bond lot purchased in a specific month. */
interface BondLot {
  count: number;
  purchaseMonth: number;
  /** Current value per bond (grows for capitalizing bonds) */
  valuePerBond: number;
  /** Which interest year this lot is in (1-indexed) */
  currentYear: number;
  /** Was this lot bought with user deposits (true) or reinvested interest (false)? */
  fromDeposit: boolean;
}

const PAR = 100;
const TAX_RATE = 0.19;

function getAnnualRate(
  bond: BondDefinition,
  year: number,
  inflationRate: number,
  nbpRate: number,
): number {
  switch (bond.type) {
    case 'fixed':
      return bond.firstYearRate;
    case 'variable_nbp':
      return year === 1 ? bond.firstYearRate : nbpRate + bond.margin;
    case 'indexed_inflation':
      return year === 1 ? bond.firstYearRate : inflationRate + bond.margin;
  }
}

function durationInMonths(bond: BondDefinition): number {
  return Math.round(bond.durationYears * 12);
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

// ─── Public API ──────────────────────────────────────────────────────────────

export function simulateInvestment(params: SimulationParams): YearlySnapshot[] {
  const { monthlyPayment, years, bond, inflationRate, nbpRate, isIKE, reinvest } = params;

  const totalMonths = years * 12;
  const bondDurationMonths = durationInMonths(bond);
  const taxMul = isIKE ? 0 : TAX_RATE;

  // ── Cash pools ──
  // depositCash: unspent money from user deposits (not yet turned into bonds)
  // profitCash:  realised net interest sitting as cash (from payout bonds or matured capitalizing bonds)
  let depositCash = 0;
  let profitCash = 0;

  // Total deposits the user has ever made
  let totalDeposits = 0;
  // Cumulative realised net profit (interest already paid out or matured)
  let realisedNetProfit = 0;

  const activeLots: BondLot[] = [];
  const snapshots: YearlySnapshot[] = [];

  for (let month = 0; month < totalMonths; month++) {
    // 1. Monthly deposit
    depositCash += monthlyPayment;
    totalDeposits += monthlyPayment;

    // 2. Buy bonds — first spend deposit cash, then profit cash (if reinvest)
    let availableCash = depositCash + (reinvest ? profitCash : 0);
    const affordableCount = Math.floor(availableCash / PAR);

    if (affordableCount > 0) {
      const cost = affordableCount * PAR;
      // Deduct from deposit cash first, remainder from profit cash
      const fromDeposit = Math.min(depositCash, cost);
      const fromProfit = cost - fromDeposit;
      depositCash -= fromDeposit;
      if (reinvest) profitCash -= fromProfit;

      // Count how many bonds come from deposit vs profit
      const bondsFromDeposit = Math.floor(fromDeposit / PAR);
      const bondsFromProfit = affordableCount - bondsFromDeposit;

      if (bondsFromDeposit > 0) {
        activeLots.push({
          count: bondsFromDeposit,
          purchaseMonth: month,
          valuePerBond: PAR,
          currentYear: 1,
          fromDeposit: true,
        });
      }
      if (bondsFromProfit > 0) {
        activeLots.push({
          count: bondsFromProfit,
          purchaseMonth: month,
          valuePerBond: PAR,
          currentYear: 1,
          fromDeposit: false,
        });
      }
    }

    // 3. Process existing lots (interest / maturity)
    const lotsToRemove: number[] = [];

    for (let i = 0; i < activeLots.length; i++) {
      const lot = activeLots[i];
      const ageMonths = month - lot.purchaseMonth;

      // Annual interest processing at each 12-month anniversary
      if (ageMonths > 0 && ageMonths % 12 === 0) {
        const rate = getAnnualRate(bond, lot.currentYear, inflationRate, nbpRate);

        if (bond.capitalization === 'annual' && bond.payoutFrequency === 'maturity') {
          // Capitalizing (EDO, DOS-style): value grows internally
          lot.valuePerBond = lot.valuePerBond * (1 + rate);
        } else if (bond.payoutFrequency === 'annual') {
          // Payout (COI, ROR, DOR, TOZ): interest paid out
          const grossInterest = lot.valuePerBond * rate * lot.count;
          const netInterest = grossInterest * (1 - taxMul);
          realisedNetProfit += netInterest;
          profitCash += netInterest;
        }
        lot.currentYear++;
      }

      // Maturity
      if (ageMonths === bondDurationMonths) {
        if (bond.capitalization === 'annual' && bond.payoutFrequency === 'maturity') {
          // EDO-style maturity: tax on total gain
          const totalValue = lot.valuePerBond * lot.count;
          const totalCost = PAR * lot.count;
          const grossGain = totalValue - totalCost;
          const netGain = grossGain * (1 - taxMul);
          realisedNetProfit += netGain;
          // Principal goes back to deposit cash (if from deposit) or profit cash
          if (lot.fromDeposit) {
            depositCash += totalCost;
          } else {
            profitCash += totalCost;
          }
          profitCash += netGain;
        } else if (bond.payoutFrequency === 'maturity') {
          // OTS / DOS maturity-only payout
          const rate = getAnnualRate(bond, lot.currentYear, inflationRate, nbpRate);
          const grossInterest = PAR * rate * bond.durationYears * lot.count;
          const netInterest = grossInterest * (1 - taxMul);
          realisedNetProfit += netInterest;
          // Return principal
          if (lot.fromDeposit) {
            depositCash += PAR * lot.count;
          } else {
            profitCash += PAR * lot.count;
          }
          profitCash += netInterest;
        } else {
          // Annual-payout maturity: return principal only
          if (lot.fromDeposit) {
            depositCash += PAR * lot.count;
          } else {
            profitCash += PAR * lot.count;
          }
        }
        lotsToRemove.push(i);
      }
    }

    // Remove matured lots (reverse order for stable indices)
    for (let r = lotsToRemove.length - 1; r >= 0; r--) {
      activeLots.splice(lotsToRemove[r], 1);
    }

    // 4. End-of-year snapshot with Mark-to-Market valuation
    if ((month + 1) % 12 === 0) {
      let mtmCapitalFromDeposits = 0; // par value of active deposit-funded bonds
      let mtmCapitalFromProfit = 0;   // par value of active profit-funded bonds
      let mtmUnrealisedGrosGain = 0;  // unrealised gross gain on capitalizing bonds

      for (const lot of activeLots) {
        const parValue = PAR * lot.count;
        if (lot.fromDeposit) {
          mtmCapitalFromDeposits += parValue;
        } else {
          mtmCapitalFromProfit += parValue;
        }
        // Unrealised gain for capitalizing bonds (EDO/DOS-style)
        if (bond.capitalization === 'annual' && bond.payoutFrequency === 'maturity') {
          const grossGain = (lot.valuePerBond - PAR) * lot.count;
          mtmUnrealisedGrosGain += grossGain;
        }
      }

      // Virtual tax on unrealised gains
      const mtmUnrealisedNetGain = mtmUnrealisedGrosGain * (1 - taxMul);

      // Zainwestowany Kapitał = deposit money currently in bonds + deposit cash held
      // We subtract idle deposit cash from total deposits to show only "deployed" capital,
      // but it's cleaner to define it as: total deposits minus idle deposit cash.
      const zainwestowanyKapital = totalDeposits - depositCash;

      // zyskNetto = realised profits (monotonically increasing counter) + unrealised net gains
      // realisedNetProfit already includes profit reinvested into bonds (never decremented).

      snapshots.push({
        year: (month + 1) / 12,
        zainwestowanyKapital: round2(zainwestowanyKapital),
        zyskNetto: round2(realisedNetProfit + mtmUnrealisedNetGain),
      });
    }
  }

  return snapshots;
}
