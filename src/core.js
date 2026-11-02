(function (root) {
  "use strict";
  function completionRate(tasks) { if (!tasks.length) return 0; return Math.round((tasks.filter(function (task) { return task.completed; }).length / tasks.length) * 100); }
  function filterTasks(tasks, filter, query) {
    var q = (query || "").trim().toLowerCase();
    return tasks.filter(function (task) {
      var status = filter === "all" || (filter === "active" && !task.completed) || (filter === "completed" && task.completed);
      var match = !q || task.title.toLowerCase().includes(q) || (task.projectName || "").toLowerCase().includes(q);
      return status && match;
    });
  }
  function projectProgress(id, tasks) { return completionRate(tasks.filter(function (task) { return task.projectId === id; })); }
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
    return { id: id, title: title.slice(0, 100), projectId: input.projectId || "inbox",
      priority: ["low", "normal", "high"].includes(input.priority) ? input.priority : "normal",
      dueDate: input.dueDate || "", completed: false, createdAt: new Date().toISOString() };
  }
  // Free local planner: it never sends goals or tasks over the network.
  function makePlan(goal, existingTasks) {
    var clean = String(goal || "").trim().replace(/\s+/g, " ").slice(0, 180);
    if (!clean) return [];
    var words = clean.toLowerCase();
    var school = /school|homework|study|exam|test|class|assignment|essay|presentation|project/.test(words);
    var creative = /design|draw|write|create|build|make|launch|website|game|video|art/.test(words);
    var steps = school ? [
      ["Gather the instructions, materials, and deadline", "high", "Get everything you need in one place before starting."],
      ["Break " + clean + " into the smallest required sections", "high", "A clear checklist makes the workload easier to manage."],
      ["Complete the first section, then review what remains", "normal", "Start with one focused work session rather than the whole goal."]
    ] : creative ? [
      ["Define what a finished first version of " + clean + " should include", "high", "Decide what done looks like before adding extra details."],
      ["Collect references and list the main pieces you need", "normal", "Gather what you need before committing to every detail."],
      ["Create a small first version and test or review it", "high", "A small working draft gives you something concrete to improve."]
    ] : [
      ["Define the result you want from " + clean, "high", "Make the goal specific enough to know when it is complete."],
      ["List the resources and information you may need", "normal", "Prepare the essentials so you can make steady progress."],
      ["Complete the smallest useful first step", "high", "A quick first action helps turn the goal into progress."]
    ];
    steps.push(["Review your progress and choose the next step", "low", "Adjust the plan based on what is actually left to do."]);
    var existing = (Array.isArray(existingTasks) ? existingTasks : []).filter(function (t) { return t && !t.completed; }).map(function (t) { return String(t.title || "").toLowerCase(); });
    var suggestions = steps.filter(function (s) { return !existing.some(function (title) { return title && (title.includes(s[0].toLowerCase()) || s[0].toLowerCase().includes(title)); }); });
    if (!suggestions.length) suggestions = steps;
    return suggestions.map(function (s) { return { title: s[0], priority: s[1], rationale: s[2] }; });
  }
  var api = { completionRate: completionRate, filterTasks: filterTasks, projectProgress: projectProgress, isValidDueDate: isValidDueDate, createTask: createTask, makePlan: makePlan };
  root.TaskFlowCore = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
