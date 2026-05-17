import React from 'react';

interface StudyPlan {
  title: string;
  description: string;
  weeks: {
    week: number;
    goals: string[];
    activities: string[];
  }[];
}

interface StudyPlanDisplayProps {
  plan: StudyPlan | null;
  loading: boolean;
  error: string | null;
}

const StudyPlanDisplay: React.FC<StudyPlanDisplayProps> = ({ plan, loading, error }) => {
  if (loading) return <p className="text-gray-500">Generating study plan...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!plan) return <p className="text-gray-500">No study plan available.</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{plan.title}</h2>
      <p className="text-gray-600">{plan.description}</p>
      {plan.weeks.map((w) => (
        <div key={w.week} className="border rounded-lg p-4">
          <h3 className="text-xl font-semibold">Week {w.week}</h3>
          <div className="mt-2 space-y-1">
            <h4 className="font-medium">Goals:</h4>
            <ul className="list-disc list-inside space-y-0.5">
              {w.goals.map((g, i) => (
                <li key={i}>{g}</li>
              ))}
            </ul>
            <h4 className="font-medium mt-2">Activities:</h4>
            <ul className="list-disc list-inside space-y-0.5">
              {w.activities.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudyPlanDisplay;