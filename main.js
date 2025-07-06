.ball-wrapper {
  ...
  opacity: 0.5; /* 初期状態で薄く */
  transition: transform 0.6s ease, opacity 0.6s ease;
}

.ball-wrapper.roll-left {
  transform: translateX(-60px) rotate(-360deg);
}

.ball-wrapper.roll-right {
  transform: translateX(60px) rotate(360deg);
}
