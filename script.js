// The task list is saved in the browser so it is still here next time.
const STORAGE_KEY = "studyTasks";

const taskForm = document.querySelector("#task-form");
const titleInput = document.querySelector("#task-title");
const descriptionInput = document.querySelector("#task-description");
const priorityInput = document.querySelector("#task-priority");
const dueDateInput = document.querySelector("#task-due-date");
const submitButton = document.querySelector("#submit-button");
const cancelEditButton = document.querySelector("#cancel-edit");
const taskList = document.querySelector("#task-list");
const emptyState = document.querySelector("#empty-state");
const emptyTitle = document.querySelector("#empty-title");
const emptyCopy = document.querySelector("#empty-copy");
const taskFilter = document.querySelector("#task-filter");
const announcement = document.querySelector("#announcement");

let tasks = loadTasks();
let editingTaskId = null;

// Read previously saved tasks, but keep the app usable if browser storage is unavailable.
function loadTasks() {
  try {
    const savedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(savedTasks) ? savedTasks : [];
  } catch (error) {
    console.error("Could not load saved tasks.", error);
    return [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Could not save tasks in this browser.", error);
    announce("Your changes could not be saved in this browser.");
  }
}

function announce(message) {
  announcement.textContent = message;
}

// Format date-only values locally so they don't shift to the day before in some time zones.
function formatDate(dateString) {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function isOverdue(task) {
  if (!task.dueDate || task.completed) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(`${task.dueDate}T00:00:00`);
  return dueDate < today;
}

function updateSummary() {
  const completedCount = tasks.filter((task) => task.completed).length;
  document.querySelector("#total-count").textContent = tasks.length;
  document.querySelector("#pending-count").textContent = tasks.length - completedCount;
  document.querySelector("#completed-count").textContent = completedCount;
  document.querySelector("#list-count").textContent = tasks.length;
}

// Build task cards with text nodes so task text is displayed safely as plain text.
function createBadge(text, className) {
  const badge = document.createElement("span");
  badge.className = `badge ${className}`;
  badge.textContent = text;
  return badge;
}

function renderTasks() {
  taskList.replaceChildren();
  updateSummary();

  const filter = taskFilter.value;
  const visibleTasks = tasks.filter((task) => {
    if (filter === "pending") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  emptyState.hidden = visibleTasks.length > 0;
  if (tasks.length === 0) {
    emptyTitle.textContent = "Your list is a fresh page.";
    emptyCopy.textContent = "Add your first task and take one step closer to your goals.";
  } else if (visibleTasks.length === 0) {
    emptyTitle.textContent = "Nothing to show here.";
    emptyCopy.textContent = "Try another filter to see your tasks.";
  }

  visibleTasks.forEach((task) => {
    const item = document.createElement("li");
    item.className = `task-item${task.completed ? " is-completed" : ""}`;

    const statusToggle = document.createElement("input");
    statusToggle.className = "status-toggle";
    statusToggle.type = "checkbox";
    statusToggle.checked = task.completed;
    statusToggle.setAttribute("aria-label", `Mark "${task.title}" as ${task.completed ? "to do" : "completed"}`);
    statusToggle.addEventListener("change", () => toggleTask(task.id));

    const content = document.createElement("div");
    content.className = "task-content";

    const title = document.createElement("h3");
    title.className = "task-title";
    title.textContent = task.title;
    content.append(title);

    if (task.description) {
      const description = document.createElement("p");
      description.className = "task-description";
      description.textContent = task.description;
      content.append(description);
    }

    const meta = document.createElement("div");
    meta.className = "task-meta";
    meta.append(createBadge(`${task.priority[0].toUpperCase()}${task.priority.slice(1)} priority`, `priority-${task.priority}`));
    meta.append(createBadge(task.completed ? "Completed" : "To do", `status-badge${task.completed ? " is-completed" : ""}`));

    if (task.dueDate) {
      const dueDate = document.createElement("span");
      dueDate.className = `due-date${isOverdue(task) ? " is-overdue" : ""}`;
      dueDate.textContent = `${isOverdue(task) ? "Overdue · " : "Due "}${formatDate(task.dueDate)}`;
      meta.append(dueDate);
    }
    content.append(meta);

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const editButton = document.createElement("button");
    editButton.className = "icon-button";
    editButton.type = "button";
    editButton.textContent = "✎";
    editButton.setAttribute("aria-label", `Edit "${task.title}"`);
    editButton.addEventListener("click", () => startEditing(task));

    const deleteButton = document.createElement("button");
    deleteButton.className = "icon-button delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "×";
    deleteButton.setAttribute("aria-label", `Delete "${task.title}"`);
    deleteButton.addEventListener("click", () => deleteTask(task.id));

    actions.append(editButton, deleteButton);
    item.append(statusToggle, content, actions);
    taskList.append(item);
  });
}

// Use the same form for adding a new task and editing an existing one.
function resetForm() {
  taskForm.reset();
  priorityInput.value = "medium";
  editingTaskId = null;
  submitButton.innerHTML = 'Add task <span aria-hidden="true">＋</span>';
  cancelEditButton.hidden = true;
}

function startEditing(task) {
  editingTaskId = task.id;
  titleInput.value = task.title;
  descriptionInput.value = task.description;
  priorityInput.value = task.priority;
  dueDateInput.value = task.dueDate;
  submitButton.innerHTML = 'Save changes <span aria-hidden="true">✓</span>';
  cancelEditButton.hidden = false;
  titleInput.focus();
  announce(`Editing "${task.title}".`);
}

function toggleTask(taskId) {
  const task = tasks.find((item) => item.id === taskId);
  if (!task) return;
  task.completed = !task.completed;
  saveTasks();
  renderTasks();
  announce(`"${task.title}" marked ${task.completed ? "completed" : "to do"}.`);
}

function deleteTask(taskId) {
  const task = tasks.find((item) => item.id === taskId);
  if (!task) return;
  tasks = tasks.filter((item) => item.id !== taskId);
  if (editingTaskId === taskId) resetForm();
  saveTasks();
  renderTasks();
  announce(`"${task.title}" deleted.`);
}

// Validate the title, then add a new task or save edits to the selected task.
taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const taskDetails = {
    title: titleInput.value.trim(),
    description: descriptionInput.value.trim(),
    priority: priorityInput.value,
    dueDate: dueDateInput.value,
  };

  if (!taskDetails.title) {
    titleInput.focus();
    return;
  }

  if (editingTaskId) {
    const task = tasks.find((item) => item.id === editingTaskId);
    if (!task) return;
    Object.assign(task, taskDetails);
    announce(`"${task.title}" updated.`);
  } else {
    const id = window.crypto && window.crypto.randomUUID
      ? window.crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    tasks.unshift({ id, ...taskDetails, completed: false });
    announce(`"${taskDetails.title}" added to your tasks.`);
  }

  saveTasks();
  resetForm();
  renderTasks();
});

cancelEditButton.addEventListener("click", () => {
  resetForm();
  announce("Editing canceled.");
});

taskFilter.addEventListener("change", renderTasks);

renderTasks();
