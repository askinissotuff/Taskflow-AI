# Roadmap

This roadmap describes possible development stages. Items are plans, not completed functionality unless they are already present in the prototype.

## Stage 1 — Browser prototype
- [x] Task creation, completion, and deletion.
- [x] Projects and task assignment.
- [x] Search and status filters.
- [x] Project completion indicators.
- [x] Basic automated tests for core helpers.
- [x] Product and architecture documentation.

## Stage 2 — Reliable application foundation
- [ ] Choose and document the production frontend and backend stack.
- [ ] Add typed models and input validation.
- [ ] Add a persistent database and migration strategy.
- [ ] Add automated browser-level tests.
- [ ] Add accessible keyboard and screen-reader interaction checks.

## Stage 3 — Accounts and collaboration
- [ ] Add secure account registration and sign-in.
- [ ] Add server-side authorization and project membership.
- [ ] Add collaboration and activity history.
- [ ] Add safe data export and deletion.

## Stage 4 — AI planning
- [x] Select Anthropic Claude and document privacy expectations.
- [x] Build a server-side AI integration with secrets kept off the client.
- [x] Return structured, editable task suggestions.
- [x] Require user review before suggestions become saved tasks.
- [ ] Deploy and configure the serverless API with a real Anthropic API key.
- [ ] Add rate limits, error handling, and usage transparency.

## Stage 5 — Integrations and launch readiness
- [ ] Evaluate calendar and task-tool integrations.
- [ ] Add notifications only with clear user controls.
- [ ] Add monitoring, backups, and incident response procedures.
- [ ] Conduct usability and accessibility testing.
- [ ] Publish support, privacy, and terms information before public launch.