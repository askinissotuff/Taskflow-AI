# Privacy Notice

Last updated: November 2, 2026

## What this version stores

TaskFlow's current browser app stores task and project data in local storage on the device and browser you use. The static GitHub Pages version does not create an account or sync this data to a TaskFlow server.

## AI planning

If you choose the AI planner, the app sends the goal you entered and up to 30 task titles, priorities, and completion states to the TaskFlow server endpoint. The server forwards that context to Anthropic to generate a plan. The provider API key is stored only in the server deployment's environment variables and is never sent to the browser.

Do not submit passwords, contact details, health information, confidential school or work records, or other sensitive information. Anthropic processes API requests under its own terms and policies. Review those terms before enabling the feature.

The AI planner requires a separate Anthropic API account and API billing. A Claude chat subscription does not automatically include API usage.

## Backups and deletion

Exported JSON backups are downloaded to your device and are not uploaded by TaskFlow. You can remove local TaskFlow data by clearing this site's browser storage. Deleting local data does not delete files you exported or data handled by Anthropic under its policies.

## Contact

This repository does not currently provide a dedicated support address. For security reports, follow the process in SECURITY.md.
