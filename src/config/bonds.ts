// --- src/config/bonds.ts ---
// Bond definitions – add a new entry here to support a new bond type (OCP).

export interface BondDefinition {
  id: string;
  name: string;
  durationYears: number;
  type: 'fixed' | 'variable_nbp' | 'indexed_inflation';
  /** Interest rate for the first year (or all years for fixed bonds) */
  firstYearRate: number;
  /** Margin added to the base rate (NBP or inflation) from year 2+ */
  margin: number;
  /** Whether interest capitalizes internally or is paid out */
  capitalization: 'annual' | 'none';
  /** When interest/principal is paid out */
  payoutFrequency: 'annual' | 'maturity';
}

/**
 * Current / approximate parameters for Polish treasury bonds (as of early 2025).
 * Editing this array is the ONLY change needed to add new bond types.
 */
export const BONDS: BondDefinition[] = [
  {
    id: 'OTS',
    name: 'OTS (3-miesięczne)',
    durationYears: 0.25, // 3 months
    type: 'fixed',
    firstYearRate: 0.03,     // 3.00%
    margin: 0,
    capitalization: 'none',
    payoutFrequency: 'maturity',
  },
  {
    id: 'ROR',
    name: 'ROR (1-roczne)',
    durationYears: 1,
    type: 'variable_nbp',
    firstYearRate: 0.0335,   // 3.35% first month
    margin: 0.01,            // NBP + 1.00pp
    capitalization: 'none',
    payoutFrequency: 'annual',
  },
  {
    id: 'DOR',
    name: 'DOR (2-letnie)',
    durationYears: 2,
    type: 'variable_nbp',
    firstYearRate: 0.034,    // 3.40%
    margin: 0.015,           // NBP + 1.50pp
    capitalization: 'none',
    payoutFrequency: 'annual',
  },
  {
    id: 'DOS',
    name: 'DOS (2-letnie stałe)',
    durationYears: 2,
    type: 'fixed',
    firstYearRate: 0.034,    // 3.40%
    margin: 0,
    capitalization: 'none',
    payoutFrequency: 'maturity',
  },
  {
    id: 'TOZ',
    name: 'TOZ (3-letnie)',
    durationYears: 3,
    type: 'variable_nbp',
    firstYearRate: 0.0355,   // 3.55%
    margin: 0.02,            // NBP + 2.00pp
    capitalization: 'none',
    payoutFrequency: 'annual',
  },
  {
    id: 'COI',
    name: 'COI (4-letnie)',
    durationYears: 4,
    type: 'indexed_inflation',
    firstYearRate: 0.0365,   // 3.65%
    margin: 0.015,           // inflation + 1.50pp
    capitalization: 'none',
    payoutFrequency: 'annual',
  },
  {
    id: 'EDO',
    name: 'EDO (10-letnie)',
    durationYears: 10,
    type: 'indexed_inflation',
    firstYearRate: 0.038,    // 3.80%
    margin: 0.02,            // inflation + 2.00pp
    capitalization: 'annual',
    payoutFrequency: 'maturity',
  },
];
