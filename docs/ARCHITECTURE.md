# Architecture

## Current prototype

The current implementation is a static browser application with no build step or runtime dependencies.

- `index.html` provides the semantic page structure and dialogs.
- `styles.css` contains responsive layout and visual styling.
- `src/core.js` contains small reusable data and planning helpers.
- `app.js` wires the interface, state, browser storage, and events.
- `tests/core.test.js` validates the reusable helpers with Node's built-in test runner.

## Data flow

1. The app loads sample data or parses a saved browser-local data snapshot.
2. User actions update the in-memory project and task collections.
3. The app writes the updated snapshot to local storage.
4. Rendering functions derive counts, project progress, and filtered task lists from that state.

The current prototype is single-user and browser-local. Data does not sync between devices or browsers.

## Future production architecture (proposal)

A production version should introduce:
- A typed frontend application with reusable components.
- A server-side API for authentication, projects, and tasks.
- A database with user ownership and project membership constraints.
- Server-side authorization on every private resource.
- A dedicated AI service boundary so provider keys never reach the browser.
- Input validation, rate limiting, observability, and automated backups.

## AI integration boundary

The planning assistant uses a server-side Vercel function at api/plan.js. It validates and bounds incoming context, calls the Anthropic Messages API using a server-only ANTHROPIC_API_KEY, requests structured task suggestions, validates the response, and returns a small JSON payload. The browser requires explicit consent before sending the goal and up to 30 task summaries. Suggestions are reviewed individually before they become local tasks. GitHub Pages cannot host the function; the backend must be deployed to Vercel or another compatible Node serverless host.

## Security and privacy considerations

- Never put API secrets in frontend source or committed environment files.
- Treat task titles and descriptions as untrusted user input.
- Escape user-generated content before rendering it as HTML.
- Validate ownership and permissions on the server before reading or changing data.
- Provide a clear data export and deletion process before launch.
- Explain what information is sent to any AI provider before enabling AI features.