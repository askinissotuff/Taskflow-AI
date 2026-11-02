const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");

test("all app entry points and dialog forms exist in the document", () => {
  [
    "main-content", "overview-view", "tasks-view", "projects-view",
    "task-dialog", "task-form", "project-dialog", "project-form",
    "search-input", "import-file", "plan-button", "plan-status", "plan-output"
  ].forEach((id) => assert.match(html, new RegExp('id="' + id + '"'), id + " should exist"));
});

test("every primary app control has a matching event handler", () => {
  [
    "quick-add-button", "tasks-add-button", "projects-add-button",
    "add-project-button", "add-project-shortcut", "export-button",
    "import-button", "clear-completed-button", "plan-button"
  ].forEach((id) => assert.ok(app.includes("#" + id) || app.includes('("' + id + '")'), id + " should be handled"));
});

test("responsive and keyboard accessibility styles are present", () => {
  assert.match(css, /@media\s*\(max-width:\s*700px\)/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /\.skip-link:focus/);
});

test("task actions are delegated and generated user text is escaped", () => {
  assert.match(app, /data-toggle-task/);
  assert.match(app, /data-delete-task/);
  assert.match(app, /function escapeHtml/);
  assert.match(app, /escapeHtml\(task\.title\)/);
});
