# Privacy Notice

Last updated: November 2, 2026

## What this version stores

TaskFlow's current browser app stores task and project data in local storage on the device and browser you use. The static GitHub Pages version does not create an account or sync this data to a TaskFlow server.

## Free planning helper

The planner uses the open-source Llama 3.2 1B Instruct model through WebLLM. Model inference and your prompt/task context are processed on your device using WebGPU; they are not sent to an AI inference API or TaskFlow backend. On first use, the browser downloads model files and supporting runtime code from their hosting providers and may cache them for later use. No account, API key, or AI subscription is required. A compatible browser and capable device are required.

The repository may retain optional server-side integration files for future experiments, but the public GitHub Pages app uses the local model.

## Backups and deletion

Exported JSON backups are downloaded to your device and are not uploaded by TaskFlow. You can remove local TaskFlow data by clearing this site's browser storage. Deleting local data does not delete files you exported.

## Contact

This repository does not currently provide a dedicated support address. For security reports, follow the process in SECURITY.md.
