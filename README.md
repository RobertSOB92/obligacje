# Kalkulator Obligacji Skarbowych (PL)

A simple web app (React + TypeScript + Vite) that **simulates regular investing in Polish Treasury Bonds** (“Obligacje Skarbowe”) and shows how your portfolio can grow over time.

The calculator is designed for **cyclical saving**: you enter a monthly payment, choose a bond type, and the app simulates purchases, interest, tax (or IKE), and optional reinvestment.

## What this app does

- Simulates investing **every month** (e.g. 500 PLN/month) for a chosen number of years
- Supports multiple Polish bond types (configured in `src/config/bonds.ts`), including:
  - **OTS (3-month)**
  - **ROR (1-year, variable NBP)**
  - **DOR (2-year, variable NBP)**
  - **DOS (2-year fixed)**
  - **TOZ (3-year, variable NBP)**
  - **COI (4-year, inflation-indexed)**
  - **EDO (10-year, inflation-indexed)**
- Lets you input assumptions when needed:
  - **Inflation rate** (for inflation-indexed bonds like COI/EDO)
  - **NBP reference rate** (for variable-rate bonds like ROR/DOR/TOZ)
- Optionally simulates:
  - **IKE mode** (no 19% capital gains tax in the simulation)
  - **Reinvesting profits/interest** into additional bond purchases
- Displays results as:
  - A chart (portfolio value vs net profit)
  - A detailed yearly table (invested capital, net profit, total value)

## How the simulation works (high level)

- You deposit money monthly.
- Whenever enough cash accumulates, the app “buys” bonds in 100 PLN denominations.
- Interest is computed according to the selected bond rules (fixed / NBP-based / inflation-indexed).
- Depending on the bond type, profit may be treated as paid out or realised at maturity.
- Tax is applied as **19%** unless **IKE** is enabled.

Core logic lives in: `src/engine/bondCalculator.ts`

## Development

### Requirements
- Node.js (recommended: LTS)

### Run locally
```bash
npm install
npm run dev
