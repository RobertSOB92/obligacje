// --- src/App.tsx ---

import { Layout } from './components/Layout';
import { InputPanel } from './components/InputPanel';
import { ResultsChart } from './components/ResultsChart';
import { useCalculator } from './hooks/useCalculator';

export default function App() {
  const { form, updateField, needsInflation, needsNBP, results } = useCalculator();

  return (
    <Layout
      formPanel={
        <InputPanel
          form={form}
          needsInflation={needsInflation}
          needsNBP={needsNBP}
          onUpdate={updateField}
        />
      }
      chartPanel={<ResultsChart data={results} />}
    />
  );
}
