# TaskFlow AI

**TaskFlow AI** is an early productivity-platform prototype for organizing tasks, managing projects, and breaking larger goals into practical next steps.

> **Project status:** This repository contains a working, browser-based prototype and planning documentation. It does not yet include user accounts, cloud sync, collaboration, or a real AI model. The planning assistant currently uses simple templates.

## What you can try

- Create, complete, and delete tasks.
- Organize tasks into projects.
- Set task priority and an optional due date.
- Search tasks and filter by active or completed status.
- View overall and per-project completion progress.
- Generate a sample step-by-step plan from a goal.
- Keep demo data in your browser using local storage.

## Run locally

**Requirements:** Node.js 18 or newer for the test command. The app itself is static and has no build step.

1. Clone this repository:
   ```bash
   git clone https://github.com/askinissotuff/Taskflow-AI.git
   cd Taskflow-AI
   ```
2. Open `index.html` in a modern browser, or serve the folder with a local static server.
3. Run the automated tests:
   ```bash
   npm test
   ```

No API key or environment setup is needed for the current prototype.

## Project structure

```text
Taskflow-AI/
├── index.html             # App interface
├── styles.css             # Responsive styling
├── app.js                 # Browser interactions and local state
├── src/
│   └── core.js            # Reusable task and planning helpers
├── tests/
│   └── core.test.js       # Node.js unit tests
├── docs/
│   ├── PRODUCT_SPEC.md    # Product vision and MVP scope
│   ├── ARCHITECTURE.md    # Current and proposed architecture
│   └── ROADMAP.md         # Development stages
├── .env.example
├── .gitignore
├── CONTRIBUTING.md
├── SECURITY.md
└── package.json
```

## Product direction

TaskFlow AI aims to bridge the gap between basic to-do lists and heavyweight project-management software.

Intended audiences include students, small teams, developers, and independent creators. The longer-term product direction includes guided planning, project workspaces, progress tracking, and carefully designed integrations.

Read the [product specification](docs/PRODUCT_SPEC.md), [architecture notes](docs/ARCHITECTURE.md), and [roadmap](docs/ROADMAP.md) for details. Planned features are not represented as completed functionality.

## Data and privacy

The prototype saves its sample tasks and projects in the current browser's local storage. This data does not sync to an account or another device. Avoid entering sensitive or confidential information. Clearing browser storage may remove the saved demo data.

The planning helper is not connected to an AI provider. No API key is required, and secrets should never be placed in frontend code.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for setup and pull-request guidance. For security concerns, see [SECURITY.md](SECURITY.md).

## License

No open-source license has been selected yet. Until one is added, the repository's contents are not automatically granted an open-source license.
