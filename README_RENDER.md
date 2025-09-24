Render deployment guide

1. Sign in to Render (https://render.com) and click "New" -> "Web Service".
2. Connect your GitHub repository (mohex-platform).
3. For "Environment", choose "Node".
4. Set the branch to deploy (e.g. `master`).
5. For the build command enter:
   npm run build
6. For the start command enter:
   npm run start
7. Add environment variables (DATABASE_URL, JWT_SECRET, CORS_ORIGIN, OPENAI_API_KEY, etc.) in the Render dashboard.
8. Deploy. After the initial deploy, copy the service URL (e.g. https://mohex-backend-render.onrender.com) and set `NEXT_PUBLIC_API_URL` in Netlify to that value.
9. Redeploy the frontend in Netlify and verify the health endpoint:
   https://<your-render-service>/health
