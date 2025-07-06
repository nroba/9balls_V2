const ballContainer = document.getElementById('ballContainer');
let score1 = 0;
let score2 = 0;

// 玉を生成
for (let i = 1; i <= 9; i++) {
  const img = document.createElement('img');
  img.src = `images/ball${i}.png`;
  img.classList.add('ball');
  img.dataset.number = i;
  ballContainer.appendChild(img);

  let startY = null;

  img.addEventListener('touchstart', (e) => {
    startY = e.touches[0].clientY;
  });

  img.addEventListener('touchend', (e) => {
    if (startY === null) return;
    const endY = e.changedTouches[0].clientY;
    const deltaY = endY - startY;

    if (deltaY < -30) {
      // 上スワイプ → プレイヤー1
      score1++;
      document.getElementById('score1').textContent = score1;
      img.classList.add('swipe-up');
    } else if (deltaY > 30) {
      // 下スワイプ → プレイヤー2
      score2++;
      document.getElementById('score2').textContent = score2;
      img.classList.add('swipe-down');
    }

    // 一度記録されたらタップ無効
    img.style.pointerEvents = 'none';
  });
}
    // PWA登録スクリプト
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js').then(() => {
    console.log("Service Worker Registered");
  });
}