const grid = document.getElementById("ballGrid");
const popup = document.getElementById("popup");
const resetBtn = document.getElementById("resetBtn");

let score1 = 0;
let score2 = 0;

const ballState = {};

// 効果音再生
function playSoundOverlap(src) {
  const sound = new Audio(src);
  sound.play().catch((e) => console.warn("音声再生エラー:", e));
}

// アニメーションクラスの再発火
function restartAnimation(el, className) {
  el.classList.remove("roll-left", "roll-right");
  void el.offsetWidth;
  el.classList.add(className);
}

function updateScoreDisplay() {
  document.getElementById("score1").textContent = score1;
  document.getElementById("score2").textContent = score2;
}

function showPopup(text) {
  popup.textContent = text;
  popup.style.display = "block";
  setTimeout(() => {
    popup.style.display = "none";
  }, 1000);
}

function updateMultiplierLabel(num) {
  const label = document.getElementById(`multi${num}`);
  const mult = ballState[num].multiplier;
  if (mult === 2) {
    label.textContent = "×2";
    label.style.display = "block";
    label.classList.remove("bounce");
    void label.offsetWidth;
    label.classList.add("bounce");
  } else {
    label.style.display = "none";
    label.classList.remove("bounce");
  }
}

function recalculateScores() {
  score1 = 0;
  score2 = 0;
  for (let j = 1; j <= 9; j++) {
    const state = ballState[j];
    if (state.swiped && state.assigned) {
      const base = j === 9 ? 2 : 1;
      const point = base * state.multiplier;
      if (state.assigned === 1) score1 += point;
      if (state.assigned === 2) score2 += point;
    }
  }
  updateScoreDisplay();
}

for (let i = 1; i <= 9; i++) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("ball-wrapper");

  const img = document.createElement("img");
  img.src = `images/ball${i}.png`;
  img.classList.add("ball");
  img.dataset.number = i;

  const label = document.createElement("div");
  label.classList.add("ball-multiplier");
  label.id = `multi${i}`;
  label.textContent = "";
  label.style.display = "none";

  wrapper.appendChild(img);
  wrapper.appendChild(label);
  grid.appendChild(wrapper);

  ballState[i] = {
    swiped: false,
    assigned: null,
    multiplier: 1,
    wrapper: wrapper
  };

  let startX = null;

  const onStart = (clientX) => {
    startX = clientX;
  };

  const onEnd = (clientX) => {
    if (startX === null) return;
    const deltaX = clientX - startX;
    if (Math.abs(deltaX) < 30) return;

    const prevAssigned = ballState[i].assigned;
    const isSwiped = ballState[i].swiped;

    const wrapperEl = ballState[i].wrapper;

    if (!isSwiped) {
      if (deltaX < -30) {
        ballState[i].assigned = 1;
        restartAnimation(wrapperEl, "roll-left");
      } else if (deltaX > 30) {
        ballState[i].assigned = 2;
        restartAnimation(wrapperEl, "roll-right");
      }
      ballState[i].swiped = true;
      playSoundOverlap("sounds/swipe.mp3");
    } else {
      if (
        (prevAssigned === 1 && deltaX > 30) ||
        (prevAssigned === 2 && deltaX < -30)
      ) {
        ballState[i].assigned = null;
        ballState[i].swiped = false;
        wrapperEl.classList.remove("roll-left", "roll-right");
        playSoundOverlap("sounds/cancel.mp3");
      }
    }

    recalculateScores();
  };

  // タッチ操作
  wrapper.addEventListener("touchstart", (e) => onStart(e.touches[0].clientX));
  wrapper.addEventListener("touchend", (e) => onEnd(e.changedTouches[0].clientX));

  // マウス操作
  wrapper.addEventListener("mousedown", (e) => onStart(e.clientX));
  wrapper.addEventListener("mouseup", (e) => onEnd(e.clientX));

  // タップで倍率切替
  wrapper.addEventListener("click", () => {
    if (!ballState[i].swiped) return;

    if (ballState[i].multiplier === 1) {
      ballState[i].multiplier = 2;
      showPopup("サイド（得点×2）");
    } else {
      ballState[i].multiplier = 1;
      showPopup("コーナー（得点×1）");
    }

    updateMultiplierLabel(i);
    playSoundOverlap("sounds/side.mp3");
    recalculateScores();
  });
}

// リセット処理
resetBtn.addEventListener("click", () => {
  score1 = 0;
  score2 = 0;
  updateScoreDisplay();

  for (let i = 1; i <= 9; i++) {
    const state = ballState[i];
    const img = state.wrapper.querySelector("img");
    const wrapperEl = state.wrapper;
    wrapperEl.classList.remove("roll-left", "roll-right");
    state.swiped = false;
    state.assigned = null;
    state.multiplier = 1;
    updateMultiplierLabel(i);
  }
});

// PWA登録
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log("Service Worker Registered"))
    .catch(err => console.error("SW registration failed:", err));
}
