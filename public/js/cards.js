function loadCards() {
  const data = localStorage.getItem("cards");
  return data ? JSON.parse(data) : [];
}

function saveCards(cards) {
  localStorage.setItem("cards", JSON.stringify(cards));
}

function getNextTask(card) {
  return card.tasks.find(t => !t.done) || null;
}

function renderCards(cards) {
  const container = document.getElementById("card-container");

  if (cards.length === 0) {
    container.innerHTML = "<p>まだカードが登録されていません。</p>";
    return;
  }

  container.innerHTML = `
    <div class="grid">
      ${cards
        .map(
          (c) => `
        <div class="card" data-id="${c.id}">
          <div class="card-header">
            <span>${c.title}</span>
            <button class="delete-card" data-id="${c.id}">×</button>
          </div>
          <div class="progress-wrapper">
            <div class="progress-circle" style="--p:${c.progress};">${c.progress}%</div>
          </div>
        </div>
      `
        )
        .join("")}
    </div>
  `;

  // カードクリック（子タスク表示）
  document.querySelectorAll(".card").forEach(cardEl => {
    cardEl.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-card")) return;

        const id = Number(cardEl.dataset.id);
        const cards = loadCards();
        const card = cards[id];

        if (editMode) {
            editingCardId = id;

            // タイトルをセット
            document.getElementById("title").value = card.title;

            // 子タスクを1行ずつテキストボックスで表示
            const list = document.getElementById("task-edit-list");
            list.innerHTML = card.tasks
            .map(
                (t, i) => `
                <div class="task-edit-row" data-index="${i}">
                    <button class="select-task" type="button">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M8 6h8M8 12h8M8 18h8" stroke="white" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    </button>
                    <input type="text" value="${t.title}" data-task-id="${i}">
                    <button class="delete-task" data-task-id="${i}" type="button">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M3 6h18" stroke="white" stroke-width="2" stroke-linecap="round"/>
                        <path d="M8 6v12c0 1 1 2 2 2h4c1 0 2-1 2-2V6" stroke="white" stroke-width="2"/>
                        <path d="M10 10v6" stroke="white" stroke-width="2" stroke-linecap="round"/>
                        <path d="M14 10v6" stroke="white" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    </button>
                </div>
                `
            )
            .join("");

            window.scrollTo({
                top: document.getElementById("card-form").offsetTop,
                behavior: "smooth"
            });

            document.getElementById("card-container").style.display = "none";
            document.getElementById("progress-container").style.display = "none";
            document.getElementById("card-form").style.display = "flex";

            return;
        }

        // 通常モード → タスク実行
        const nextTask = getNextTask(card);
        if (nextTask) {
        showTaskPopup(card, nextTask);
        } else {
        alert("すべてのタスクが完了しています");
        }
    });
  });



  // 削除ボタンのイベント
  document.querySelectorAll(".delete-card").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation(); // カードクリックを無効化
      const id = Number(btn.dataset.id);
      deleteCard(id);
    });
  });
}

function deleteCard(id) {
  let cards = loadCards();

  // id のカードを削除
  cards = cards.filter(c => c.id !== id);

  // id を振り直す（重要）
  cards = cards.map((c, i) => ({ ...c, id: i }));

  saveCards(cards);
  renderCards(cards);
}

function showTaskPopup(card, task) {
  const popup = document.createElement("div");
  popup.className = "popup";
  popup.innerHTML = `
    <div class="popup-content">
      <h2>${card.title}</h2>
      <p>${task.title}</p>
      <div class="popup-buttons">
        <button id="complete-task">完了</button>
        <button id="close-popup">閉じる</button>
      </div>
    </div>
  `;

  document.body.appendChild(popup);

  // 閉じるボタン
  document.getElementById("close-popup").onclick = () => {
    popup.remove();

    // 子タスクが全部終わっている場合は進捗を反映してカード一覧を更新
    const cards = loadCards();
    renderCards(cards);
  };

  // 完了ボタン
  document.getElementById("complete-task").onclick = () => {
    task.done = true;
    showCheckAnimation();

    // progress 更新
    const doneCount = card.tasks.filter(t => t.done).length;
    card.progress = Math.floor((doneCount / card.tasks.length) * 100);

    const cards = loadCards();
    cards[card.id] = card;
    saveCards(cards);

    popup.remove();

    // 次の未完了タスクを探す
    const nextTask = card.tasks.find(t => !t.done);

    if (nextTask) {
      // 次のタスクを即ポップアップ
      showTaskPopup(card, nextTask);
    } else {
      // 全部終わったらカード一覧を更新
      renderCards(cards);
      alert("すべてのタスクが完了しました");
    }
  };
}

function init() {
  const cards = loadCards();
  renderCards(cards);
}

init();
