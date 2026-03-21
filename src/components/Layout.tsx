// --- src/components/Layout.tsx ---

import type { ReactNode } from 'react';

interface LayoutProps {
  formPanel: ReactNode;
  chartPanel: ReactNode;
  tablePanel: ReactNode;
}

export function Layout({ formPanel, chartPanel, tablePanel }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-700/50 backdrop-blur-sm bg-slate-900/40 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Kalkulator Obligacji Skarbowych
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">
              Symulacja cyklicznego oszczędzania w polskich obligacjach
            </p>
          </div>
        </div>
      </header>

      <div className="h-16 sm:h-24" aria-hidden="true" />

      {/* Main content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 flex flex-col gap-6">
        {/* Form + Chart row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Form panel */}
          <section className="lg:col-span-4 xl:col-span-3 flex">
            <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 backdrop-blur-sm p-5 sm:p-6 shadow-xl flex-1 flex flex-col">
              <h2 className="text-base font-semibold text-slate-200 mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Parametry inwestycji
              </h2>
              <div className="flex-1 min-h-0">
                {formPanel}
              </div>
            </div>
          </section>

          {/* Chart panel */}
          <section className="lg:col-span-8 xl:col-span-9 flex">
            <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 backdrop-blur-sm p-5 sm:p-6 shadow-xl flex-1">
              <h2 className="text-base font-semibold text-slate-200 mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Wyniki symulacji
              </h2>
              {chartPanel}
            </div>
          </section>
        </div>

        {/* Table panel — full width */}
        <section>
          <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 backdrop-blur-sm p-5 sm:p-6 shadow-xl">
            {tablePanel}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 py-4 text-center text-xs text-slate-500">
        Kalkulator Obligacji Skarbowych &copy; {new Date().getFullYear()} &mdash; Symulacja ma charakter poglądowy
      </footer>
    </div>
  );
}
