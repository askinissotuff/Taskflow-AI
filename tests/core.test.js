const test = require("node:test");
const assert = require("node:assert/strict");
const Core = require("../src/core.js");

test("completionRate returns zero for an empty list", () => {
  assert.equal(Core.completionRate([]), 0);
});

test("completionRate calculates the rounded completed percentage", () => {
  assert.equal(Core.completionRate([{ completed: true }, { completed: false }, { completed: true }]), 67);
});

test("filterTasks filters by status and case-insensitive search", () => {
  const tasks = [
    { title: "Write report", projectName: "School", completed: false },
    { title: "Read chapter", projectName: "School", completed: true },
    { title: "Build prototype", projectName: "Personal", completed: false }
  ];
  assert.deepEqual(Core.filterTasks(tasks, "active", "REPORT"), [tasks[0]]);
  assert.deepEqual(Core.filterTasks(tasks, "completed", ""), [tasks[1]]);
});

test("projectProgress only counts tasks in the selected project", () => {
  const tasks = [
    { projectId: "a", completed: true },
    { projectId: "a", completed: false },
    { projectId: "b", completed: true }
  ];
  assert.equal(Core.projectProgress("a", tasks), 50);
});

test("createTask trims titles and applies safe defaults", () => {
  const task = Core.createTask({ title: "  Plan project  " }, "task-1");
  assert.equal(task.title, "Plan project");
  assert.equal(task.priority, "normal");
  assert.equal(task.completed, false);
  assert.equal(task.id, "task-1");
});

test("createTask rejects an empty title", () => {
  assert.throws(() => Core.createTask({ title: "  " }, "task-2"), /title is required/);
});

test("makePlan returns no steps for an empty goal", () => {
  assert.deepEqual(Core.makePlan(" "), []);
});

test("makePlan creates practical sample steps", () => {
  assert.equal(Core.makePlan("Finish a presentation").length, 4);
});