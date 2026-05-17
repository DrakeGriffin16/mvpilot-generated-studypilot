import React, { useState } from 'react';
import StudyForm from './components/StudyForm';
import StudyPlanDisplay from './components/StudyPlanDisplay';

function App() {
  const [plan, setPlan] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (goals: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goals }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setPlan(data.plan);
    } catch (err: any) {
      setError(err.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">Medium Level Study Plan Generator</h1>
      <StudyForm onSubmit={handleSubmit} />
      {loading && <p className="mt-4 text-gray-600">Generating plan...</p>}
      {error && <p className="mt-4 text-red-600">Error: {error}</p>}
      {plan && <StudyPlanDisplay plan={plan} />}
    </div>
  );
}

export default App;