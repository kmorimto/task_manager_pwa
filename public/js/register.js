let selectedTaskIndex = null;

function loadCards() {
  const data = localStorage.getItem("cards");
  return data ? JSON.parse(data) : [];
}

function saveCards(cards) {
  localStorage.setItem("cards", JSON.stringify(cards));
}

document.getElementById("card-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const taskInputs = document.querySelectorAll("#task-edit-list input[data-task-id]");

  let cards = loadCards();

  // -----------------------------
  // 新規登録
  // -----------------------------
  if (editingCardId === null) {
    const taskList = Array.from(taskInputs)
      .map((input, i) => ({
        id: i,
        title: input.value.trim(),
        done: false
      }))
      .filter(t => t.title !== ""); // 空欄は無視

    const newCard = {
      id: cards.length,
      title,
      progress: 0,
      tasks: taskList
    };

    cards.push(newCard);
  }

  // -----------------------------
  // 編集
  // -----------------------------
  else {
    const card = cards[editingCardId];

    const updatedTasks = [];
    let newIndex = 0;

    Array.from(taskInputs).forEach((input, i) => {
      const text = input.value.trim();

      if (text === "") {
        // 空欄 → 元のタスクを保持（削除扱いにしない）
        if (card.tasks[i]) {
          updatedTasks.push({
            id: newIndex++,
            title: card.tasks[i].title,
            done: card.tasks[i].done
          });
        }
      } else {
        // テキストがある → 更新
        updatedTasks.push({
          id: newIndex++,
          title: text,
          done: card.tasks[i]?.done ?? false
        });
      }
    });

    card.tasks = updatedTasks;

    // progress 再計算
    const doneCount = card.tasks.filter(t => t.done).length;
    card.progress = Math.floor((doneCount / card.tasks.length) * 100);

    editingCardId = null;
  }

  saveCards(cards);
  renderCards(cards);

  alert("保存しました");

  if (editMode) {
    document.getElementById("card-container").style.display = "block";
    document.getElementById("card-form").style.display = "none";
    document.getElementById("progress-container").style.display = "block";
  }

  // -----------------------------
  // 保存後は編集モード解除
  // -----------------------------
  editMode = false;
  editingCardId = null;

  document.getElementById("toggle-edit").checked = false;
  document.getElementById("title").disabled = false;
  document.querySelector("#card-form button[type='submit']").textContent = "追加";

  e.target.reset();
  document.getElementById("task-edit-list").innerHTML = "";

});

document.getElementById("add-task").onclick = () => {
  const list = document.getElementById("task-edit-list");

  const newId = list.children.length;

  list.insertAdjacentHTML(
    "beforeend",
    `
    <div class="task-edit-row" data-index="${newId}">
        <button class="select-task" type="button">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M8 6h8M8 12h8M8 18h8" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </svg>
        </button>
        <input type="text" data-task-id="${newId}">
        <button class="delete-task" data-task-id="${newId}" type="button">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <path d="M8 6v12c0 1 1 2 2 2h4c1 0 2-1 2-2V6" stroke="white" stroke-width="2"/>
            <path d="M10 10v6" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <path d="M14 10v6" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </svg>
        </button>
    </div>
    `
  );
};


document.getElementById("task-edit-list").addEventListener("click", (e) => {
  if (!e.target.classList.contains("select-task")) return;

  const row = e.target.closest(".task-edit-row");
  const index = Number(row.dataset.index);

  // 1つ目の選択
  if (selectedTaskIndex === null) {
    selectedTaskIndex = index;
    row.classList.add("selected");
    return;
  }

  // 2つ目の選択 → 入れ替え
  if (selectedTaskIndex !== index) {
    swapTasks(selectedTaskIndex, index);
  }

  // 選択解除
  selectedTaskIndex = null;
  document.querySelectorAll(".task-edit-row").forEach(r => r.classList.remove("selected"));
});

function swapTasks(i, j) {
  const list = document.getElementById("task-edit-list");
  const rows = Array.from(list.children);

  // DOM を入れ替える
  if (i < j) {
    list.insertBefore(rows[j], rows[i]);
    list.insertBefore(rows[i], rows[j + 1]);
  } else {
    list.insertBefore(rows[i], rows[j]);
    list.insertBefore(rows[j], rows[i + 1]);
  }

  // data-index を振り直す
  Array.from(list.children).forEach((row, idx) => {
    row.dataset.index = idx;
    row.querySelector("input").dataset.taskId = idx;
    row.querySelector(".delete-task").dataset.taskId = idx;
  });
}