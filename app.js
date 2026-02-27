const STORAGE_KEY = "mess-manager-tasks";

const form = document.getElementById("mess-form");
const input = document.getElementById("mess-input");
const list = document.getElementById("mess-list");
const stats = document.getElementById("stats");
const clearDone = document.getElementById("clear-done");
const template = document.getElementById("mess-item-template");

let tasks = loadTasks();

render();

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  tasks.unshift({
    id: crypto.randomUUID(),
    text,
    done: false,
  });

  input.value = "";
  persistAndRender();
});

clearDone.addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.done);
  persistAndRender();
});

function render() {
  list.innerHTML = "";

  for (const task of tasks) {
    const item = template.content.firstElementChild.cloneNode(true);
    const checkbox = item.querySelector('input[type="checkbox"]');
    const text = item.querySelector(".task-text");
    const del = item.querySelector(".delete");

    checkbox.checked = task.done;
    text.textContent = task.text;

    if (task.done) {
      item.classList.add("done");
    }

    checkbox.addEventListener("change", () => {
      task.done = checkbox.checked;
      persistAndRender();
    });

    del.addEventListener("click", () => {
      tasks = tasks.filter((t) => t.id !== task.id);
      persistAndRender();
    });

    list.appendChild(item);
  }

  const total = tasks.length;
  const cleaned = tasks.filter((task) => task.done).length;
  const pending = total - cleaned;
  stats.textContent = `${total} total • ${cleaned} cleaned • ${pending} pending`;
}

function persistAndRender() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  render();
}

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (task) =>
        task &&
        typeof task.id === "string" &&
        typeof task.text === "string" &&
        typeof task.done === "boolean"
    );
  } catch {
    return [];
  }
}
