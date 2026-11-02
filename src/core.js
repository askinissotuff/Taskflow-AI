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

  function isValidDueDate(value) {
    if (!value) return true;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    var date = new Date(value + "T00:00:00");
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }

  function createTask(input, id) {
    var title = String(input.title || "").trim();
    if (!title) throw new Error("A task title is required.");
    if (!isValidDueDate(input.dueDate || "")) throw new Error("Enter a valid due date.");
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

  function makePlan(goal) {
    var cleanGoal = String(goal || "").trim();
    if (!cleanGoal) return [];
    return [
      "Define what a finished result looks like for: " + cleanGoal,
      "Break the work into 2–4 smaller tasks.",
      "Choose the most important first step and give it a realistic deadline.",
      "Review your progress and adjust the next step."
    ];
  }

  var api = {
    completionRate: completionRate,
    filterTasks: filterTasks,
    projectProgress: projectProgress,
    isValidDueDate: isValidDueDate,
    createTask: createTask,
    makePlan: makePlan
  };
  root.TaskFlowCore = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
