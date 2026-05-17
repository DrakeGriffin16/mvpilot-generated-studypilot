const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export async function submitIntake(intake) {
  const payload = {
    user_goal: intake.goal,
    urgency: intake.priority,
    segment: intake.segment,
    owner: intake.owner,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/api/intake`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    return {
      summary: intake.goal,
      priority: intake.priority.toLowerCase(),
      segment: intake.segment,
      owner: intake.owner,
      status: 'Needs review',
      offline: true,
      error: error instanceof Error ? error.message : 'API unavailable',
    };
  }
}