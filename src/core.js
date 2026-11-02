(function (root) {
  "use strict";

  function completionRate(tasks) {
    if (!tasks.length) return 0;
    return Math.round((tasks.filter(function (task) { return task.completed; }).length / tasks.length) * 100);
  }

  function filterTasks(tasks, filter, query) {
    var normalizedQuery = (query || "").trim().toLowerCase();
    return tasks.filter(function (task) {
      var matchesStatus = filter === "all" || (filter === "active" && !task.completed) || (filter === "completed" && task.completed);
      var matchesQuery = !normalizedQuery || task.title.toLowerCase().includes(normalizedQuery) || (task.projectName || "").toLowerCase().includes(normalizedQuery);
      return matchesStatus && matchesQuery;
    });
  }

  function projectProgress(projectId, tasks) {
    var projectTasks = tasks.filter(function (task) { return task.projectId === projectId; });
    return completionRate(projectTasks);
  }

  function createTask(input, id) {
    var title = String(input.title || "").trim();
    if (!title) throw new Error("A task title is required.");\n    if (!isValidDueDate(input.dueDate || "")) throw new Error("Enter a valid due date.");
    return {
      id: id,
      title: title.slice(0, 100),
      projectId: input.projectId || "inbox",
      priority: ["low", "normal", "high"].includes(input.priority) ? input.priority : "normal",
      dueDate: input.dueDate || "",
      completed: false,
      createdAt: new Date().toISOString()
    };
  }

  function isValidDueDate(value) {\n    if (!value) return true;\n    if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(value)) return false;\n    var date = new Date(value + "T00:00:00");\n    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;\n  }\n\n  function makePlan(goal) {
    var cleanGoal = String(goal || "").trim();
    if (!cleanGoal) return [];
    return [
      "Define what a finished result looks like for: " + cleanGoal,
      "Break the work into 2–4 smaller tasks.",
      "Choose the most important first step and give it a realistic deadline.",
      "Review your progress and adjust the next step."
    ];
  }

  var api = { completionRate: completionRate, filterTasks: filterTasks, projectProgress: projectProgress, createTask: createTask, makePlan: makePlan, isValidDueDate: isValidDueDate };
  root.TaskFlowCore = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : this);