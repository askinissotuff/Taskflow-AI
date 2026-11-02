# Enable the Claude AI planner

The repository includes a secure server-side AI endpoint at api/plan.js. GitHub Pages only hosts static files, so it cannot execute this endpoint. Deploy the repository to Vercel to enable live AI planning.

## 1. Create a Vercel deployment

1. Sign in to Vercel and choose **Add New → Project**.
2. Import the public GitHub repository: askinissotuff/Taskflow-AI.
3. Keep the project root at the repository root. No build command is required.
4. Deploy the project.

The included vercel.json configures the serverless API route.

## 2. Add the API key securely

1. Create an Anthropic API key in the Anthropic Console.
2. In Vercel, open the TaskFlow project **Settings → Environment Variables**.
3. Add a variable named ANTHROPIC_API_KEY and paste the key as its value.
4. Apply it to Production (and Preview if desired), save, then redeploy.

Never put the key in app.js, index.html, GitHub Pages, or a committed .env file. Do not send the key in a chat.

## 3. Understand billing

Anthropic API usage is separate from a Claude chat subscription and may incur usage charges. Review the current API pricing and set account spending limits before using it. Do not assume a Claude Pro/Max subscription provides API credits.

## 4. Test the feature

Open the Vercel deployment URL, enter a non-sensitive goal in **Plan your focus**, read and accept the AI data notice, then select **Create AI plan**. The app should show a short plan and let you add each suggestion individually.

## Data sent to Anthropic

The planner sends the goal and up to 30 task titles, priorities, and completion states. It does not send your entire local workspace, project descriptions, or exported backup. Avoid sensitive or confidential information. See [Privacy Notice](PRIVACY.md).

## Current hosting status

The public GitHub Pages site continues to host the static task manager. The live Claude endpoint is not enabled on that host. After Vercel is deployed, use the Vercel URL for the working AI-enabled version. A later step can connect a custom domain or update the public landing page to point to the Vercel deployment.
