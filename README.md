# TaskFlow AI

**A calm, focused workspace for turning goals into progress.**

TaskFlow AI is a lightweight task and project organizer that runs in your browser. It is designed for people who want a clear place to capture tasks, set priorities, track due dates, and see progress without a complicated setup.

> **Current status:** Public browser-based MVP. The app supports task and project management, browser-local persistence, search, filters, progress summaries, and JSON backup/restore. It does not currently provide accounts, cloud synchronization, shared workspaces, notifications, or a connected AI model. Its free planning helper runs locally in your browser.

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
- Generate a practical, free planning checklist from a goal directly in your browser. No API key, account, or paid AI service is needed.
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

Do not enter sensitive, confidential, or highly personal information. The planning helper runs locally and does not send your goal or task list to an AI provider. The page loads its typography from Google Fonts when an internet connection is available.

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

## Free planning helper

The planning helper creates editable task suggestions locally in your browser. It does not call Claude or any external AI service, so there are no API fees or keys to configure. Secure accounts, cloud persistence, collaboration, and an optional connected AI provider remain future work.

See [Product Spec](docs/PRODUCT_SPEC.md), [Architecture](docs/ARCHITECTURE.md), [Roadmap](docs/ROADMAP.md), and [User Guide](docs/USER_GUIDE.md).

## Contributing and security

- [Contributing guide](CONTRIBUTING.md)
- [Code of conduct](CODE_OF_CONDUCT.md)
- [Security policy](SECURITY.md)

## License

No open-source license has been selected. Until a license is added, normal copyright applies and reuse is not automatically permitted.
