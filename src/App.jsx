import { useMemo, useState } from 'react';

import { submitIntake } from './api.js';

const idea = "build a medium level studyplan";
const userStory = "As a user, I want build a medium level studyplan so I can make progress faster.";
const cards = [
  "Capture study plan request requests with priority, owner, and due date.",
  "Turn each intake into a learning sprint workflow with next actions.",
  "Expose progress metrics, queue, and intake summaries through FastAPI."
];
const planSteps = [
  "Initialize monorepo with apps/web (React+TS+Tailwind) and apps/api (FastAPI).",
  "Add Supabase client and Nemotron helper libraries to frontend and backend.",
  "Create backend endpoint /generate-plan that receives study goals, calls Nemotron embedding/rerank/reasoning, stores plan in Supabase.",
  "Create frontend form for user input and display area for returned plan.",
  "Wire frontend to call backend endpoint and show loading/spinner states.",
  "Add GitHub Agent script that, after plan generation, commits a summary markdown to repo via Octokit.",
  "Add .env.example with placeholders for NVIDIA_API_KEY, SUPABASE_URL, SUPABASE_ANON_KEY.",
  "Create README with problem statement, setup instructions, and NVIDIA/Nemotron usage explanation."
];

const demo = {
  "project": "Studyplan",
  "idea": "build a medium level studyplan",
  "audience": "students and advisors",
  "record_label": "Study Plan Request",
  "workflow_label": "Learning Sprint",
  "metric_label": "Progress Metrics",
  "workflow": [
    "Needs assessment",
    "Plan drafted",
    "Session booked",
    "Progress reviewed"
  ],
  "features": [
    "Capture study plan request requests with priority, owner, and due date.",
    "Turn each intake into a learning sprint workflow with next actions.",
    "Expose progress metrics, queue, and intake summaries through FastAPI."
  ],
  "metrics": [
    {
      "label": "Open items",
      "value": "3",
      "delta": "2 need attention"
    },
    {
      "label": "Response time",
      "value": "14m",
      "delta": "from intake to owner"
    },
    {
      "label": "On track",
      "value": "82%",
      "delta": "target workflow health"
    },
    {
      "label": "Blocked",
      "value": "1",
      "delta": "waiting on outside input"
    }
  ],
  "intake_template": {
    "goal": "Schedule biology exam review plan",
    "segment": "Exam prep",
    "priority": "High",
    "owner": "Avery Chen"
  },
  "queue": [
    {
      "id": "item-1",
      "title": "Schedule biology exam review plan",
      "segment": "Exam prep",
      "owner": "Avery Chen",
      "priority": "High",
      "status": "Needs assessment",
      "due": "today"
    },
    {
      "id": "item-2",
      "title": "Break capstone project into weekly tasks",
      "segment": "Project work",
      "owner": "Taylor Kim",
      "priority": "Normal",
      "status": "Plan drafted",
      "due": "tomorrow"
    },
    {
      "id": "item-3",
      "title": "Prepare office-hours question queue",
      "segment": "Office hours",
      "owner": "Morgan Diaz",
      "priority": "Low",
      "status": "Session booked",
      "due": "Friday"
    }
  ],
  "agent_team": [
    {
      "name": "Strategist Agent",
      "role": "Scope and success metric",
      "status": "Ready",
      "output": "Narrows learning sprint to one demo path for students and advisors."
    },
    {
      "name": "Research Agent",
      "role": "Context and constraints",
      "status": "Ready",
      "output": "Tracks source warnings, domain rules, and study plan request requirements."
    },
    {
      "name": "Builder Agent",
      "role": "App and API",
      "status": "Ready",
      "output": "Generates the React workspace, FastAPI routes, and database-ready schema."
    },
    {
      "name": "QA Agent",
      "role": "Risk checks",
      "status": "Ready",
      "output": "Checks queue states, blocked work, and smoke-test coverage before demo."
    },
    {
      "name": "Demo Agent",
      "role": "Stakeholder narrative",
      "status": "Ready",
      "output": "Packages the walkthrough, API payload, and next implementation steps."
    }
  ],
  "next_actions": [
    "Assign an owner and deadline to the newest study plan request.",
    "Move one item from needs assessment to plan drafted.",
    "Review the API response with the frontend before adding persistence."
  ],
  "implementation_steps": [
    "Initialize monorepo with apps/web (React+TS+Tailwind) and apps/api (FastAPI).",
    "Add Supabase client and Nemotron helper libraries to frontend and backend.",
    "Create backend endpoint /generate-plan that receives study goals, calls Nemotron embedding/rerank/reasoning, stores plan in Supabase.",
    "Create frontend form for user input and display area for returned plan.",
    "Wire frontend to call backend endpoint and show loading/spinner states.",
    "Add GitHub Agent script that, after plan generation, commits a summary markdown to repo via Octokit.",
    "Add .env.example with placeholders for NVIDIA_API_KEY, SUPABASE_URL, SUPABASE_ANON_KEY.",
    "Create README with problem statement, setup instructions, and NVIDIA/Nemotron usage explanation."
  ]
};

export default function App() {
  const [intake, setIntake] = useState(demo.intake_template);
  const [queue, setQueue] = useState(demo.queue);
  const [submitState, setSubmitState] = useState({ status: 'idle', message: 'Ready to queue a new item.' });
  const preview = useMemo(() => ({
    summary: intake.goal || demo.intake_template.goal,
    owner: intake.owner,
    priority: intake.priority,
    segment: intake.segment,
    recommended_next_step: demo.next_actions[0],
  }), [intake]);

  function updateIntake(event) {
    const { name, value } = event.target;
    setIntake((current) => ({ ...current, [name]: value }));
  }

  async function queueIntake() {
    setSubmitState({ status: 'saving', message: 'Submitting intake...' });
    const result = await submitIntake(intake);
    const queuedItem = {
      id: `item-${Date.now()}`,
      title: result.summary || intake.goal,
      segment: result.segment || intake.segment,
      owner: result.owner || intake.owner,
      priority: result.priority === 'high' ? 'High' : intake.priority,
      status: result.status || demo.workflow[0],
      due: 'new',
    };
    setQueue((current) => [queuedItem, ...current]);
    setSubmitState({
      status: result.offline ? 'offline' : 'saved',
      message: result.offline ? 'Queued locally. Start the FastAPI backend to persist responses.' : 'Queued through the API.',
    });
  }

  return (
    <main className="shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Generated MVP</p>
          <h1>Studyplan</h1>
          <p className="lede">{idea}</p>
          <p className="story">{userStory}</p>
        </div>
        <div className="statusPanel" aria-label="MVP status">
          <span className="statusDot" />
          <strong>Medium Level Studyplan workflow ready</strong>
          <small>{demo.audience} can review live queue state, submit a realistic intake, and inspect matching API payloads.</small>
        </div>
      </section>

      <section className="metrics" aria-label="Demo metrics">
        {demo.metrics.map((metric) => (
          <article className="metric" key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.delta}</small>
          </article>
        ))}
      </section>

      <section className="grid" aria-label="Core MVP features">
        {cards.map((card, index) => (
          <article className="card" key={card}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <p>{card}</p>
          </article>
        ))}
      </section>

      <section className="agentTeam" aria-label="Generated agent team">
        <div className="sectionHeader">
          <p className="eyebrow">Agent team</p>
          <h2>Specialized subagents</h2>
        </div>
        <div className="agentGrid">
          {demo.agent_team.map((agent) => (
            <article className="agentCard" key={agent.name}>
              <div><strong>{agent.name}</strong><small>{agent.role}</small></div>
              <p>{agent.output}</p>
              <span>{agent.status}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="workspace" aria-label="MVP workspace">
        <form className="panel" onSubmit={(event) => { event.preventDefault(); queueIntake(); }}>
          <div className="sectionHeader">
            <p className="eyebrow">Intake</p>
            <h2>{demo.record_label}</h2>
          </div>
          <label>Goal<input name="goal" value={intake.goal} onChange={updateIntake} /></label>
          <label>Segment<input name="segment" value={intake.segment} onChange={updateIntake} /></label>
          <div className="fieldRow">
            <label>Priority<select name="priority" value={intake.priority} onChange={updateIntake}><option>High</option><option>Normal</option><option>Low</option></select></label>
            <label>Owner<input name="owner" value={intake.owner} onChange={updateIntake} /></label>
          </div>
          <button type="submit" disabled={submitState.status === 'saving'}>{submitState.status === 'saving' ? 'Queueing...' : 'Queue intake'}</button>
          <small className={`submitState ${submitState.status}`}>{submitState.message}</small>
        </form>

        <section className="panel">
          <div className="sectionHeader">
            <p className="eyebrow">Workflow</p>
            <h2>{demo.workflow_label}</h2>
          </div>
          <div className="queueList">
            {queue.map((item) => (
              <article className="queueItem" key={item.id}>
                <div><strong>{item.title}</strong><small>{item.segment} - {item.owner}</small></div>
                <span className={`pill ${item.priority.toLowerCase()}`}>{item.priority}</span>
                <small>{item.status} by {item.due}</small>
              </article>
            ))}
          </div>
        </section>
      </section>

      <section className="workspace lower" aria-label="Plan and API preview">
        <section className="panel">
          <div className="sectionHeader">
            <p className="eyebrow">Build plan</p>
            <h2>Actionable next steps</h2>
          </div>
          <ol className="planList">
            {planSteps.map((step) => <li key={step}>{step}</li>)}
          </ol>
        </section>
        <section className="panel apiPanel">
          <div className="sectionHeader">
            <p className="eyebrow">API preview</p>
            <h2>/api/intake</h2>
          </div>
          <pre>{JSON.stringify(preview, null, 2)}</pre>
        </section>
      </section>
    </main>
  );
}