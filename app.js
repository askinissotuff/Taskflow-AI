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

  function loadData() {
    try {
      var saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved && Array.isArray(saved.projects) && Array.isArray(saved.tasks)) return saved;
    } catch (error) { /* Start with sample data if browser storage is unavailable. */ }
    return JSON.parse(JSON.stringify(defaultData));
  }
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
    catch (error) { showToast("Browser storage is unavailable. Changes may not persist."); }
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
    toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 2400);
  }
  function renderTask(task) {
    return '<div class="task-row ' + (task.completed ? "done" : "") + '">' +
      '<input class="task-check" type="checkbox" data-toggle-task="' + escapeHtml(task.id) + '" ' + (task.completed ? "checked" : "") + ' aria-label="Mark ' + escapeHtml(task.title) + ' complete">' +
      '<div class="task-main"><div class="task-title">' + escapeHtml(task.title) + '</div><div class="task-meta"><span>' + escapeHtml(projectName(task.projectId)) + '</span>' +
      (task.dueDate ? '<span>· ' + escapeHtml(task.dueDate) + '</span>' : "") +
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
    var upcoming = data.tasks.filter(function (task) { return !task.completed; }).slice(0, 5);
    el("upcoming-list").innerHTML = upcoming.map(renderTask).join("") || '<div class="empty-state">You are all caught up. Nice work!</div>';
    var filtered = Core.filterTasks(data.tasks, currentFilter, el("search-input").value);
    if (activeProject) filtered = filtered.filter(function (task) { return task.projectId === activeProject; });
    el("all-task-list").innerHTML = filtered.map(renderTask).join("") || '<div class="empty-state">No tasks match this view. Add a task to get started.</div>';
    el("task-results-label").textContent = filtered.length + " task" + (filtered.length === 1 ? "" : "s");
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
    el("task-form").reset();
    render();
    el("task-dialog").showModal();
    el("task-title").focus();
  }
  function openProjectDialog() {
    el("project-form").reset();
    el("project-dialog").showModal();
    el("project-name").focus();
  }
  function toggleTask(id) {
    var task = data.tasks.find(function (item) { return item.id === id; });
    if (!task) return;
    task.completed = !task.completed;
    save(); render();
    showToast(task.completed ? "Task completed." : "Task moved back to active.");
  }
  document.addEventListener("click", function (event) {
    var nav = event.target.closest("[data-view]");
    if (nav) navigate(nav.dataset.view);
    var openView = event.target.closest("[data-open-view]");
    if (openView) navigate(openView.dataset.openView);
    if (event.target.closest("#quick-add-button") || event.target.closest("#tasks-add-button")) openTaskDialog();
    if (event.target.closest("#add-project-button") || event.target.closest("#projects-add-button") || event.target.closest("#add-project-shortcut")) openProjectDialog();
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
      activeProject = projectButton.dataset.projectView;
      navigate("tasks");
      activeProject = projectButton.dataset.projectView;
      el("breadcrumb-current").textContent = projectName(activeProject);
      render();
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
      var task = Core.createTask({
        title: el("task-title").value,
        projectId: el("task-project").value,
        priority: el("task-priority").value,
        dueDate: el("task-due").value
      }, "t-" + Date.now().toString(36));
      data.tasks.unshift(task);
      save(); el("task-dialog").close(); render(); showToast("Task created.");
    } catch (error) { showToast(error.message); }
  });
  el("project-form").addEventListener("submit", function (event) {
    event.preventDefault();
    var name = el("project-name").value.trim();
    if (!name) return;
    data.projects.push({ id: "p-" + Date.now().toString(36), name: name, description: el("project-description").value.trim() });
    save(); el("project-dialog").close(); render(); showToast("Project created.");
  });
  el("search-input").addEventListener("input", render);
  el("plan-button").addEventListener("click", function () {
    var steps = Core.makePlan(el("goal-input").value);
    if (!steps.length) { showToast("Add a goal first."); return; }
    el("plan-output").innerHTML = "<strong>Suggested next steps</strong><ol>" + steps.map(function (step) { return "<li>" + escapeHtml(step) + "</li>"; }).join("") + "</ol>";
  });
  el("today-label").textContent = new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric" }).format(new Date()).toUpperCase();
  navigate("overview");
})();