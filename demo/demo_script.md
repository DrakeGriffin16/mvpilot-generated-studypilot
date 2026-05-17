# Demo Script: Study Plan Generation

## Overview
This script walks through the end-to-end demo of the medium-level study plan generator.

## Steps
1. **Start the application**
   - Ensure backend is running: `uvicorn apps.api.main:app --reload`
   - Ensure frontend is running: `npm start` inside apps/web
2. **Open the UI**
   - Navigate to http://localhost:3000
3. **Enter study goals**
   - Fill in the form: Subject, Desired depth (medium), Time available per week, Deadline.
4. **Submit**
   - Click "Generate Plan".
5. **Observe backend activity**
   - Backend calls Nemotron embedding, reranking, reasoning APIs.
   - Plan is stored in Supabase.
6. **View generated plan**
   - Frontend displays a structured weekly plan with topics, resources, and milestones.
7. **GitHub commit**
   - After successful generation, the GitHub Agent commits a summary to the repository.
   - Check the Actions tab for the commit.
8. **Verify logs**
   - Check logs/ and docs/BUILD_LOG.md for agent activity.
9. **Reset / Try another**
   - Modify inputs and repeat to see different plans.

## Expected Output
- A balanced medium-level study plan covering core concepts, practice, and review.
- Commit message: "Study plan generated for [Subject] - medium level".
- No errors in console; environment variables loaded correctly.

## Troubleshooting
- Missing API keys: Backend will return 500 with message to set NVIDIA_API_KEY, SUPABASE_URL, SUPABASE_ANON_KEY.
- CORS issues: Ensure frontend proxy or CORS middleware allows localhost.

## Notes
- This demo uses the NVIDIA Nemotron models for embeddings, reranking, and reasoning as specified in the resolved tech stack.