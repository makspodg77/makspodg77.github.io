console.debug("Hello world!");

const validate = () => {
  const nameInput = document.querySelector('input[name="name"]');
  const dateInput = document.querySelector('input[name="date"]');

  if (!nameInput || !dateInput) return false;
  const name = nameInput.value.trim();
  const date = dateInput.value;

  if (!name || name.length < 3 || name.length > 255) return false;

  const today = new Date().toISOString().split("T")[0];
  if (date && date <= today) return false;

  nameInput.value = "";
  dateInput.value = "";

  return { name, date };
};

class Todo {
  tasks = [];
  editedTask = null;
  term = "";

  constructor() {
    const storageTasks = localStorage.getItem("tasks");

    if (!storageTasks) return;

    try {
      const parsedTasks = JSON.parse(storageTasks);
      if (Array.isArray(parsedTasks)) {
        const now = Date.now();
        this.tasks = parsedTasks.map((task, idx) => ({
          ...task,
          id: typeof task.id === "number" ? task.id : now + idx,
        }));
      }
    } catch {
      this.tasks = [];
    }

    this.draw();
  }

  draw = () => {
    const list = document.querySelector("ul");

    if (!list) return false;

    list.innerHTML = "";

    const normalizedTerm = this.term.trim().toLowerCase();
    const visibleTasks = normalizedTerm
      ? this.tasks.filter((task) =>
        task.name.toLowerCase().includes(normalizedTerm),
      )
      : this.tasks;

    visibleTasks.forEach((task) => {
      const item = document.createElement("li");
      item.addEventListener("click", (e) => this.openEdit(e));
      const name = document.createElement("div");

      if (this.term) {
        const lowerName = task.name.toLowerCase();
        const start = lowerName.indexOf(normalizedTerm);

        if (start === -1) {
          name.textContent = task.name;
        } else {
          const end = start + normalizedTerm.length;
          name.textContent = "";
          name.appendChild(document.createTextNode(task.name.slice(0, start)));

          const termSpan = document.createElement("span");
          termSpan.className = "term";
          termSpan.textContent = task.name.slice(start, end);
          name.appendChild(termSpan);

          name.appendChild(document.createTextNode(task.name.slice(end)));
        }
      } else {
        name.textContent = task.name;
      }

      item.dataset.taskId = String(task.id);

      const date = document.createElement("div");
      date.textContent = task.date;

      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.textContent = "X";
      removeButton.addEventListener("click", (e) => {
        e.stopPropagation();
        this.delete(task.id);
      });

      item.appendChild(name);
      item.appendChild(date);
      item.appendChild(removeButton);

      list.appendChild(item);
    });

    return true;
  };

  add = () => {
    const vals = validate();
    if (!vals) return false;
    if (!vals.date || !vals.name) return false;
    this.tasks.push({ ...vals, id: Date.now() });
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
    this.draw();
    return true;
  };

  delete(id) {
    const newTasks = this.tasks.filter((task) => task.id !== id);
    this.tasks = newTasks;
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
    this.draw();
    return true;
  }

  openEdit = (e) => {
    e.stopPropagation();

    const existingEdit = document.querySelector(".edit");
    if (existingEdit) {
      this.closeEdit();
      existingEdit.remove();
    }

    const newDiv = document.createElement("div");
    newDiv.className = "edit";
    const editNameInput = document.createElement("input");
    newDiv.appendChild(editNameInput);
    editNameInput.type = "text";
    editNameInput.placeholder = "Chyba miałem zrobić co innego.";
    editNameInput.name = "nameEdit";

    const editDateInput = document.createElement("input");
    newDiv.appendChild(editDateInput);
    editDateInput.type = "date";
    editDateInput.name = "dateEdit";
    const item = e.currentTarget;
    item.insertAdjacentElement("afterend", newDiv);

    this.editedTask = Number(e.currentTarget.dataset.taskId);
  };

  closeEdit = () => {
    const nameInput = document.querySelector('input[name="nameEdit"]');
    const dateInput = document.querySelector('input[name="dateEdit"]');

    if (!nameInput || !dateInput) return false;
    const name = nameInput.value.trim();
    const date = dateInput.value;

    const taskIndex = this.tasks.findIndex(
      (task) => task.id === this.editedTask,
    );
    if (taskIndex === -1) return false;

    this.tasks[taskIndex] = {
      name,
      date,
      id: this.editedTask,
    };

    localStorage.setItem("tasks", JSON.stringify(this.tasks));
    this.draw();
    this.editedTask = null;
    return true;
  };

  getFilteredTasks = (e) => {
    if (e.target.value.trim().length > 1 || e.target.value.trim().length === 0)
      this.term = e.target.value || "";

    this.draw();
  };
}

const todo = new Todo();
window.todo = todo;
document.todo = todo;

const addButton = document.querySelector(".addSection button");
if (addButton) {
  addButton.addEventListener("click", () => todo.add());
}

const searchInput = document.querySelector(".searchbar");
if (searchInput) {
  searchInput.addEventListener("input", (e) => todo.getFilteredTasks(e));
}

document.addEventListener("click", (e) => {
  if (e.target.closest(".edit") || e.target.closest("li")) return;

  const editElement = document.querySelector(".edit");
  if (editElement) {
    todo.closeEdit();
    editElement.remove();
  }
});
