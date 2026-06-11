document.getElementById("view-progress").addEventListener("click", () => {
  document.getElementById("card-container").style.display = "block";
  document.getElementById("card-form").style.display = "none";
  document.getElementById("progress-container").style.display = "block";
});

document.getElementById("view-edit").addEventListener("click", () => {
  document.getElementById("card-container").style.display = "none";
  document.getElementById("progress-container").style.display = "none";
  document.getElementById("card-form").style.display = "flex";
});

function showCheckAnimation() {
  const check = document.createElement("div");
  check.className = "check-popup";
  check.innerHTML = `
    <div class="check-circle">
      <div class="check-mark"></div>
    </div>
  `;
  document.body.appendChild(check);

  setTimeout(() => {
    check.remove();
  }, 800); // 0.8秒で消える
}