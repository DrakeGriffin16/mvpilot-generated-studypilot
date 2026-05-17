import React, { useState } from 'react';

const StudyForm = () => {
  const [goals, setGoals] = useState('');
  const [constraints, setConstraints] = useState('');
  const [loading, setLoading] = useState(false);
  const [planId, setPlanId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/generate-plan", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goals, constraints }),
      });
      if (!response.ok) {
        throw new Error(`Failed to generate plan: ${response.status}`);
      }
      const data = await response.json();
      setPlanId(data.planId);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Create Your Study Plan</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Study Goals</label>
          <textarea
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            placeholder="Describe what you want to learn, topics, depth, etc."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Constraints (optional)</label>
          <textarea
            value={constraints}
            onChange={(e) => setConstraints(e.target.value)}
            placeholder="Time available per week, deadlines, preferred resources, etc."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {loading ? 'Generating...' : 'Generate Study Plan'}
        </button>
      </form>
      {planId && (
        <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500">
          <p className="text-green-800">
            Study plan generated! ID: <code className="bg-gray-200 px-1 py-0.5 rounded">{planId}</code>
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Check the StudyPlanDisplay component to view the full plan.
          </p>
        </div>
      )}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500">
          <p className="text-red-800">Error: {error}</p>
        </div>
      )}
    </div>
  );
};

export default StudyForm;