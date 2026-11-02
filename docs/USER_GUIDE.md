# User Guide

## Open TaskFlow AI

Visit [the live website](https://askinissotuff.github.io/Taskflow-AI/). No account, installation, or API key is required.

## Create a task

1. Select **New task**.
2. Enter a task name.
3. Choose a project, priority, and optional due date.
4. Select **Create task**.

## Manage tasks

Open **My tasks** to see your list. Use the tabs to filter all, active, or completed tasks. Search matches task titles and project names. Check a task to complete it; uncheck it to restore it. Use the × control to delete an individual task. **Clear completed** removes all completed tasks after confirmation.

Tasks with past due dates are marked overdue. Upcoming tasks are ordered by due date, with tasks that have no due date shown afterward.

## Create a project

Choose **New project**, enter a name and optional description, then create it. Projects show their task count and completion percentage. Choose **View tasks** to filter the task list to that project.

## Back up or restore your workspace

- Select **Export** to download a JSON backup of your tasks and projects.
- Select **Import** and choose a previous TaskFlow JSON backup to restore it.
- Import replaces the current browser workspace only after you confirm. Keep backups somewhere safe.

## Use the AI planning assistant

The AI planner becomes available after the Vercel API is deployed and configured. Enter a goal, review the data notice, and check the consent box before selecting **Create AI plan**. Claude returns a short summary and 3–5 suggested tasks. Review each suggestion and select **Add task** only for the ones you want. Suggestions are not saved automatically.

The goal and up to 30 existing task titles, priorities, and completion states are sent to Anthropic for the request. Do not submit sensitive information. If the API is not deployed, the planner explains how to enable it. See [AI setup](AI_SETUP.md). A Claude chat subscription does not include Anthropic API usage; API billing is separate.

## Where your data lives

TaskFlow stores data in local storage in the browser you are using. It is not backed by an account and does not sync to another device. Export a backup before clearing browser storage or changing devices. Avoid entering sensitive or confidential information.
