(function () {
  "use strict";
  var Core = window.TaskFlowCore;
  var STORAGE_KEY = "taskflow-ai-demo-v1";
  var defaultData = {
    projects: [
      { id: "p1", name: "Personal goals", description: "Make time for the things that matter." },
      { id: "p2", name: "School work", description: "Assignments, study sessions, and deadlines." },
      { id: "p3", name: "Creative ideas", description: "A home for new things to explore." }
    ],
    tasks: [
      { id: "t1", title: "Write down this week's priorities", projectId: "p1", priority: "high", dueDate: "", completed: false },
      { id: "t2", title: "Review notes from the last lesson", projectId: "p2", priority: "normal", dueDate: "", completed: false },
      { id: "t3", title: "Collect inspiration for the next idea", projectId: "p3", priority: "low", dueDate: "", completed: true }
    ]
  };
  var data = loadData();
  var currentView = "overview";
  var currentFilter = "all";
  var activeProject = null;
  var toastTimer;
  var pendingAiPlan = [];

  function validData(value) {
    return !!value && Array.isArray(value.projects) && Array.isArray(value.tasks) &&
      value.projects.length <= 500 && value.tasks.length <= 5000 &&
      value.projects.every(function (p) { return p && typeof p.id === "string" && typeof p.name === "string"; }) &&
      value.tasks.every(function (t) { return t && typeof t.id === "string" && typeof t.title === "string" && typeof t.completed === "boolean"; });
  }
  function loadData() {
    try {
      var saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (validData(saved)) return {
        projects: saved.projects.map(function (p) { return { id: p.id, name: p.name.slice(0, 60), description: String(p.description || "").slice(0, 180) }; }),
        tasks: saved.tasks.map(function (t) { return {
          id: t.id, title: t.title.slice(0, 100), projectId: String(t.projectId || "inbox"),
          priority: ["low", "normal", "high"].includes(t.priority) ? t.priority : "normal",
          dueDate: Core.isValidDueDate(t.dueDate || "") ? t.dueDate : "",
          completed: t.completed, createdAt: t.createdAt || ""
        }; })
      };
    } catch (error) { /* Use starter data if saved data is invalid or unavailable. */ }
    return JSON.parse(JSON.stringify(defaultData));
  }
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
    catch (error) { showToast("Could not save. Check your browser storage settings."); }
  }
  function el(id) { return document.getElementById(id); }
  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
    });
  }
  function projectName(id) {
    var project = data.projects.find(function (item) { return item.id === id; });
    return project ? project.name : "Inbox";
  }
  function showToast(message) {
    var toast = el("toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 2600);
  }
  function dateValue(value) {
    if (!value) return null;
    var parts = value.split("-").map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }
  function isOverdue(task) {
    if (!task.dueDate || task.completed) return false;
    var due = dateValue(task.dueDate);
    var today = new Date(); today.setHours(0, 0, 0, 0);
    return due < today;
  }
  function renderTask(task) {
    var overdue = isOverdue(task);
    return '<div class="task-row ' + (task.completed ? "done" : "") + '">' +
      '<input class="task-check" type="checkbox" data-toggle-task="' + escapeHtml(task.id) + '" ' + (task.completed ? "checked" : "") + ' aria-label="Mark ' + escapeHtml(task.title) + ' complete">' +
      '<div class="task-main"><div class="task-title">' + escapeHtml(task.title) + '</div><div class="task-meta"><span>' + escapeHtml(projectName(task.projectId)) + '</span>' +
      (task.dueDate ? '<span class="' + (overdue ? "overdue" : "") + '">· ' + (overdue ? "Overdue · " : "Due · ") + escapeHtml(task.dueDate) + '</span>' : "") +
      '<span class="priority ' + escapeHtml(task.priority) + '">' + escapeHtml(task.priority) + '</span></div></div>' +
      '<button class="task-delete" data-delete-task="' + escapeHtml(task.id) + '" aria-label="Delete task">×</button></div>';
  }
  function renderProject(project) {
    var tasks = data.tasks.filter(function (task) { return task.projectId === project.id; });
    var rate = Core.projectProgress(project.id, data.tasks);
    return '<article class="project-card"><div class="project-card-top"><span class="project-icon">◈</span><span class="muted">' + tasks.length + ' tasks</span></div>' +
      '<h3>' + escapeHtml(project.name) + '</h3><p>' + escapeHtml(project.description || "A space for your next goal.") + '</p>' +
      '<div class="project-progress-label"><span>Progress</span><strong>' + rate + '%</strong></div><div class="project-progress"><span style="width:' + rate + '%"></span></div>' +
      '<button class="project-open" data-project-view="' + escapeHtml(project.id) + '">View tasks →</button></article>';
  }
  function render() {
    var completed = data.tasks.filter(function (task) { return task.completed; }).length;
    var rate = Core.completionRate(data.tasks);
    el("stat-total").textContent = data.tasks.length;
    el("stat-completed").textContent = completed;
    el("stat-active").textContent = data.tasks.length - completed;
    el("stat-rate").textContent = rate + "%";
    el("stat-progress").style.width = rate + "%";
    el("nav-task-count").textContent = data.tasks.filter(function (task) { return !task.completed; }).length;
    el("project-nav").innerHTML = data.projects.map(function (project) {
      return '<button data-project-view="' + escapeHtml(project.id) + '">' + escapeHtml(project.name) + '</button>';
    }).join("");
    el("project-cards").innerHTML = data.projects.slice(0, 3).map(renderProject).join("") || '<div class="empty-state">Create a project to get started.</div>';
    el("all-project-cards").innerHTML = data.projects.map(renderProject).join("") || '<div class="empty-state">No projects yet. Create your first one.</div>';
    var upcoming = data.tasks.filter(function (task) { return !task.completed; }).slice().sort(function (a, b) {
      if (!a.dueDate) return b.dueDate ? 1 : 0;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    }).slice(0, 5);
    el("upcoming-list").innerHTML = upcoming.map(renderTask).join("") || '<div class="empty-state">You are all caught up. Nice work!</div>';
    var searchableTasks = data.tasks.map(function (task) { return Object.assign({}, task, { projectName: projectName(task.projectId) }); });
    var filtered = Core.filterTasks(searchableTasks, currentFilter, el("search-input").value);
    if (activeProject) filtered = filtered.filter(function (task) { return task.projectId === activeProject; });
    el("all-task-list").innerHTML = filtered.map(renderTask).join("") || '<div class="empty-state">No tasks match this view. Add a task to get started.</div>';
    el("task-results-label").textContent = filtered.length + " task" + (filtered.length === 1 ? "" : "s");
    el("clear-completed-button").hidden = completed === 0;
    var select = el("task-project");
    var previous = select.value;
    select.innerHTML = '<option value="inbox">Inbox</option>' + data.projects.map(function (project) {
      return '<option value="' + escapeHtml(project.id) + '">' + escapeHtml(project.name) + '</option>';
    }).join("");
    if ([].some.call(select.options, function (option) { return option.value === previous; })) select.value = previous;
  }
  function navigate(view) {
    currentView = view;
    activeProject = null;
    ["overview", "tasks", "projects"].forEach(function (name) {
      el(name + "-view").classList.toggle("hidden", name !== view);
      var button = document.querySelector('[data-view="' + name + '"]');
      if (button) button.classList.toggle("active", name === view);
    });
    el("breadcrumb-current").textContent = view === "overview" ? "Overview" : view === "tasks" ? "My tasks" : "Projects";
    render();
  }
  function openTaskDialog() {
    el("task-form").reset(); render(); el("task-dialog").showModal(); el("task-title").focus();
  }
  function openProjectDialog() {
    el("project-form").reset(); el("project-dialog").showModal(); el("project-name").focus();
  }
  function toggleTask(id) {
    var task = data.tasks.find(function (item) { return item.id === id; });
    if (!task) return;
    task.completed = !task.completed; save(); render();
    showToast(task.completed ? "Task completed." : "Task moved back to active.");
  }
  function exportData() {
    var blob = new Blob([JSON.stringify({ app: "TaskFlow AI", version: 1, exportedAt: new Date().toISOString(), data: data }, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url; link.download = "taskflow-backup-" + new Date().toISOString().slice(0, 10) + ".json";
    document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
    showToast("Your workspace backup was exported.");
  }
  function importData(file) {
    if (!file || file.size > 1024 * 1024) { showToast("Choose a JSON backup smaller than 1 MB."); return; }
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var parsed = JSON.parse(reader.result);
        var imported = parsed && parsed.data ? parsed.data : parsed;
        if (!validData(imported)) throw new Error("Invalid backup");
        if (!window.confirm("Import this backup and replace the tasks and projects in this browser?")) return;
        data = {
          projects: imported.projects.map(function (p) { return { id: p.id, name: p.name.slice(0, 60), description: String(p.description || "").slice(0, 180) }; }),
          tasks: imported.tasks.map(function (t) { return {
            id: t.id, title: t.title.slice(0, 100), projectId: String(t.projectId || "inbox"),
            priority: ["low", "normal", "high"].includes(t.priority) ? t.priority : "normal",
            dueDate: Core.isValidDueDate(t.dueDate || "") ? t.dueDate : "",
            completed: t.completed, createdAt: t.createdAt || ""
          }; })
        };
        save(); render(); showToast("Workspace backup imported.");
      } catch (error) { showToast("That file is not a valid TaskFlow backup."); }
    };
    reader.onerror = function () { showToast("Could not read that file."); };
    reader.readAsText(file);
  }
  document.addEventListener("click", function (event) {
    var addAiTask = event.target.closest("[data-add-ai-task]");
    if (addAiTask) {
      var suggested = pendingAiPlan[Number(addAiTask.dataset.addAiTask)];
      if (suggested) {
        var created = Core.createTask({ title: suggested.title, priority: suggested.priority }, "ai-" + Date.now().toString(36));
        data.tasks.unshift(created);
        pendingAiPlan.splice(Number(addAiTask.dataset.addAiTask), 1);
        save();
        render();
        addAiTask.closest(".ai-task-suggestion").remove();
        showToast("AI suggestion added to your tasks.");
        if (!pendingAiPlan.length) el("plan-status").textContent = "All selected suggestions have been added.";
      }
    }
    var nav = event.target.closest("[data-view]");
    if (nav) navigate(nav.dataset.view);
    var openView = event.target.closest("[data-open-view]");
    if (openView) navigate(openView.dataset.openView);
    if (event.target.closest("#quick-add-button") || event.target.closest("#tasks-add-button")) openTaskDialog();
    if (event.target.closest("#add-project-button") || event.target.closest("#projects-add-button") || event.target.closest("#add-project-shortcut")) openProjectDialog();
    if (event.target.closest("#export-button")) exportData();
    if (event.target.closest("#import-button")) el("import-file").click();
    if (event.target.closest("#clear-completed-button")) {
      var count = data.tasks.filter(function (task) { return task.completed; }).length;
      if (count && window.confirm("Permanently delete " + count + " completed task" + (count === 1 ? "" : "s") + "?")) {
        data.tasks = data.tasks.filter(function (task) { return !task.completed; }); save(); render(); showToast("Completed tasks cleared.");
      }
    }
    var close = event.target.closest("[data-close]");
    if (close) el(close.dataset.close).close();
    var toggle = event.target.closest("[data-toggle-task]");
    if (toggle) toggleTask(toggle.dataset.toggleTask);
    var del = event.target.closest("[data-delete-task]");
    if (del) {
      data.tasks = data.tasks.filter(function (task) { return task.id !== del.dataset.deleteTask; });
      save(); render(); showToast("Task deleted.");
    }
    var projectButton = event.target.closest("[data-project-view]");
    if (projectButton) {
      activeProject = projectButton.dataset.projectView; navigate("tasks");
      activeProject = projectButton.dataset.projectView;
      el("breadcrumb-current").textContent = projectName(activeProject); render();
    }
    var filter = event.target.closest("[data-filter]");
    if (filter) {
      currentFilter = filter.dataset.filter;
      document.querySelectorAll("[data-filter]").forEach(function (button) { button.classList.toggle("selected", button === filter); });
      render();
    }
  });
  el("task-form").addEventListener("submit", function (event) {
    event.preventDefault();
    try {
      var task = Core.createTask({ title: el("task-title").value, projectId: el("task-project").value, priority: el("task-priority").value, dueDate: el("task-due").value }, "t-" + Date.now().toString(36));
      data.tasks.unshift(task); save(); el("task-dialog").close(); render(); showToast("Task created.");
    } catch (error) { showToast(error.message); }
  });
  el("project-form").addEventListener("submit", function (event) {
    event.preventDefault();
    var name = el("project-name").value.trim();
    if (!name) return;
    if (data.projects.some(function (project) { return project.name.toLowerCase() === name.toLowerCase(); })) { showToast("A project with that name already exists."); return; }
    data.projects.push({ id: "p-" + Date.now().toString(36), name: name.slice(0, 60), description: el("project-description").value.trim().slice(0, 180) });
    save(); el("project-dialog").close(); render(); showToast("Project created.");
  });
  el("import-file").addEventListener("change", function (event) {
    importData(event.target.files[0]); event.target.value = "";
  });
  el("search-input").addEventListener("input", render);
  el("plan-button").addEventListener("click", async function () {
    var goal = el("goal-input").value.trim();
    if (!el("ai-consent").checked) { showToast("Please review and accept the AI data notice first."); return; }
    if (goal.length < 3) { showToast("Enter a goal with at least 3 characters."); return; }
    var button = el("plan-button");
    button.disabled = true;
    button.setAttribute("aria-busy", "true");
    button.textContent = "Thinking...";
    el("plan-status").textContent = "Asking Claude to break your goal into practical steps...";
    el("plan-output").textContent = "";
    try {
      var response = await fetch((window.TASKFLOW_API_BASE || "") + "/api/plan", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          goal: goal,
          tasks: data.tasks.slice(0, 30).map(function (task) {
            return { title: task.title, priority: task.priority, completed: task.completed };
          })
        })
      });
      var result = await response.json().catch(function () { return {}; });
      if (!response.ok) throw new Error(result.error || (response.status === 404
        ? "The AI backend is not deployed yet. Deploy this repository to Vercel and add ANTHROPIC_API_KEY."
        : "The AI planner could not create a plan."));
      if (!Array.isArray(result.tasks) || !result.tasks.length) throw new Error("The AI returned an empty plan. Try again.");
      pendingAiPlan = result.tasks;
      el("plan-status").textContent = "AI plan ready. Review the suggestions and add only the tasks you want.";
      el("plan-output").innerHTML = "<strong>" + escapeHtml(result.summary || "Your suggested plan") + "</strong>" +
        '<div class="ai-task-list">' + pendingAiPlan.map(function (task, index) {
          return '<article class="ai-task-suggestion"><div><span class="priority ' + escapeHtml(task.priority) + '">' + escapeHtml(task.priority) + '</span><h3>' + escapeHtml(task.title) + '</h3><p>' + escapeHtml(task.rationale || "") + '</p></div><button type="button" class="text-button" data-add-ai-task="' + index + '">＋ Add task</button></article>';
        }).join("") + "</div>";
    } catch (error) {
      pendingAiPlan = [];
      el("plan-status").textContent = error.message || "The AI planner is unavailable.";
      showToast(el("plan-status").textContent);
    } finally {
      button.disabled = false;
      button.removeAttribute("aria-busy");
      button.innerHTML = 'Create AI plan <span>✳</span>';
    }
  });
  el("today-label").textContent = new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric" }).format(new Date()).toUpperCase();
  navigate("overview");
})();