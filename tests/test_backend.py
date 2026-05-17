from backend.mvp_engine import build_demo_plan, summarize_intake


def test_demo_plan_contains_features():
    plan = build_demo_plan('demo idea', ['capture intake'])
    assert plan['idea'] == 'demo idea'
    assert plan['features'] == ['capture intake']
    assert plan['queue']


def test_intake_marks_urgent_items_high_priority():
    result = summarize_intake({'user_goal': 'ship it', 'urgency': 'urgent'})
    assert result['priority'] == 'high'
    assert 'ship it' in result['summary']
    assert result['recommended_first_step']
    assert "Studyplan"