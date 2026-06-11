let editMode = false;
let editingCardId = null;

document.getElementById("toggle-edit").onchange = (e) => {
  editMode = e.target.checked;
  editingCardId = null;

  const titleInput = document.getElementById("title");
  const submitBtn = document.querySelector("#card-form button[type='submit']");
  const taskList = document.getElementById("task-edit-list");

  if (editMode) {
    titleInput.disabled = true;
    submitBtn.textContent = "保存";
    taskList.innerHTML = ""; // 編集モードでは空にしておく
  } else {
    titleInput.disabled = false;
    submitBtn.textContent = "追加";
    document.getElementById("card-form").reset();
    taskList.innerHTML = "";
  }
};

document.getElementById("task-edit-list").addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-task")) {
    e.target.parentElement.remove();
  }
});

document.getElementById("add-milestone")?.addEventListener("click", () => {
  const list = document.getElementById("ask-edit-list");
  const item = document.createElement("div");
  item.className = "milestone-item";
  item.innerHTML = `
    <input class="edit-input" type="text" placeholder="目標を入力">
    <button class="delete-milestone">×</button>
  `;
  list.appendChild(item);
});
