# TaskFlow AI

**A calm, focused workspace for turning goals into progress.**

TaskFlow AI is a lightweight task and project organizer that runs in your browser. It is designed for people who want a clear place to capture tasks, set priorities, track due dates, and see progress without a complicated setup.

> **Current status:** Public browser-based MVP. The app supports task and project management, browser-local persistence, search, filters, progress summaries, and JSON backup/restore. It does not currently provide accounts, cloud synchronization, shared workspaces, notifications, or a connected AI model.

## Live website

**[Open TaskFlow AI](https://askinissotuff.github.io/Taskflow-AI/)**

The site is deployed through GitHub Pages from the `main` branch.

## Features

- Create tasks with a project, priority, and optional due date.
- Mark tasks complete, restore them to active, or delete them.
- See overdue tasks and upcoming deadlines.
- Search task titles and project names.
- Filter tasks by all, active, or completed status.
- Create projects and track their completion progress.
- Review workspace totals and completion rate.
- Generate a sample planning checklist from a goal.
- Export your workspace to a JSON backup and import it later.
- Use a responsive layout on desktop and mobile.

## Quick start

No installation, account, or API key is needed to use the hosted website. Open the live link above.

To run the app locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/askinissotuff/Taskflow-AI.git
   cd Taskflow-AI
   ```
2. Open `index.html` in a modern browser, or serve the folder with a local static server.
3. Run the tests with Node.js 18 or newer:
   ```bash
   npm test
   ```

## Data and privacy

Tasks and projects are stored in local storage in the browser on the device you are using. They are not uploaded to a TaskFlow account and do not automatically sync between devices. Export a JSON backup before clearing browser data or changing devices. Imported backups replace the current workspace after confirmation.

Do not enter sensitive, confidential, or highly personal information. The planning helper currently uses a fixed template and does not send your goal to an AI service. The page loads its typography from Google Fonts when an internet connection is available.

## Project structure

```text
Taskflow-AI/
├── .github/              # CI, deployment, and contribution templates
├── assets/               # Brand assets
├── docs/                 # Product, architecture, roadmap, and user guide
├── src/core.js           # Testable task and progress logic
├── tests/                # Automated unit tests
├── app.js                # Browser application
├── index.html            # App structure
├── styles.css            # Responsive visual system
└── package.json          # Test scripts and project metadata
```

## Enable the AI planner

Follow [AI setup](docs/AI_SETUP.md) to deploy the secure Claude API on Vercel. Until that backend is deployed and configured, the GitHub Pages site cannot generate live AI plans.

## Product direction

The Claude-powered planning API is implemented in api/plan.js and is designed for Vercel serverless deployment. The current GitHub Pages site remains a static deployment and cannot run this API. To enable live AI, deploy the repository to Vercel and set ANTHROPIC_API_KEY as a server-side environment variable. Never put the key in app.js or commit it. Anthropic API usage is billed separately from a Claude chat subscription. See docs/AI_SETUP.md for setup and privacy details. Secure accounts, cloud persistence, and collaboration remain future work.

See [Product Spec](docs/PRODUCT_SPEC.md), [Architecture](docs/ARCHITECTURE.md), [Roadmap](docs/ROADMAP.md), and [User Guide](docs/USER_GUIDE.md).

## Contributing and security

- [Contributing guide](CONTRIBUTING.md)
- [Code of conduct](CODE_OF_CONDUCT.md)
- [Security policy](SECURITY.md)

## License

No open-source license has been selected. Until a license is added, normal copyright applies and reuse is not automatically permitted.
