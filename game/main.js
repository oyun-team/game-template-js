// Örnek oyun: Balon Patlat. Bu dosyayı kendi oyununla değiştir.
// Example game: Pop the Balloons. Replace this file with your own game.

const TEXT = {
  tr: { start: "Başlamak için dokun", score: "Skor", time: "Süre", over: "Süre bitti!", best: "En iyi", again: "Tekrar oynamak için dokun" },
  en: { start: "Tap to start", score: "Score", time: "Time", over: "Time's up!", best: "Best", again: "Tap to play again" },
};
const t = TEXT[OyunSDK.getLanguage()] || TEXT.tr;

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
let W = 0, H = 0;

// Keep the canvas sharp on phones (devicePixelRatio) and fill the screen.
function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener("resize", resize);
resize();

const ROUND_SECONDS = 30;
const COLORS = ["#ff5d73", "#ffb703", "#4cc9f0", "#90e0ef", "#c77dff", "#80ed99"];
let state = "start"; // start | playing | over
let paused = false;
let balloons = [];
let score = 0;
let timeLeft = ROUND_SECONDS;
let best = null;
let spawnTimer = 0;

function startRound() {
  state = "playing";
  balloons = [];
  score = 0;
  timeLeft = ROUND_SECONDS;
  spawnTimer = 0;
}

function spawn() {
  const r = Math.max(22, Math.min(W, H) * 0.07) * (0.8 + Math.random() * 0.5);
  balloons.push({
    x: r + Math.random() * (W - 2 * r),
    y: H + r,
    r,
    speed: (H / 6) * (0.7 + Math.random() * 0.8) * (1 + (ROUND_SECONDS - timeLeft) / ROUND_SECONDS),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  });
}

async function endRound() {
  state = "over";
  try {
    const result = await OyunSDK.submitScore(score);
    best = result.best;
  } catch (err) {
    console.warn(err);
  }
}

// Pointer events work for both touch and mouse.
canvas.addEventListener("pointerdown", (e) => {
  if (state !== "playing") {
    startRound();
    return;
  }
  for (let i = balloons.length - 1; i >= 0; i--) {
    const b = balloons[i];
    if (Math.hypot(e.clientX - b.x, e.clientY - b.y) <= b.r * 1.15) {
      balloons.splice(i, 1);
      score++;
      break;
    }
  }
});

// The site tells the game when the player switches tabs or locks the phone.
OyunSDK.onPause(() => (paused = true));
OyunSDK.onResume(() => (paused = false));

function update(dt) {
  if (state !== "playing" || paused) return;
  timeLeft -= dt;
  if (timeLeft <= 0) {
    timeLeft = 0;
    endRound();
    return;
  }
  spawnTimer -= dt;
  if (spawnTimer <= 0) {
    spawn();
    spawnTimer = 0.45 + Math.random() * 0.35;
  }
  for (const b of balloons) b.y -= b.speed * dt;
  balloons = balloons.filter((b) => b.y + b.r > 0);
}

function drawBalloon(b) {
  ctx.strokeStyle = "rgba(255,255,255,0.6)";
  ctx.beginPath();
  ctx.moveTo(b.x, b.y + b.r);
  ctx.quadraticCurveTo(b.x - 6, b.y + b.r * 1.6, b.x, b.y + b.r * 2.1);
  ctx.stroke();
  ctx.fillStyle = b.color;
  ctx.beginPath();
  ctx.ellipse(b.x, b.y, b.r * 0.85, b.r, 0, 0, Math.PI * 2);
  ctx.fill();
}

function centerText(text, y, size) {
  ctx.font = `700 ${size}px system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText(text, W / 2, y);
}

function draw() {
  ctx.fillStyle = "#1b1730";
  ctx.fillRect(0, 0, W, H);
  balloons.forEach(drawBalloon);

  ctx.fillStyle = "#fff";
  const unit = Math.min(W, H) / 20;
  if (state === "start") {
    centerText(t.start, H / 2, unit * 1.4);
  } else {
    ctx.font = `700 ${unit}px system-ui, sans-serif`;
    ctx.textAlign = "left";
    ctx.fillText(`${t.score}: ${score}`, 16, 16 + unit);
    ctx.textAlign = "right";
    ctx.fillText(`${t.time}: ${Math.ceil(timeLeft)}`, W - 16, 16 + unit);
  }
  if (state === "over") {
    centerText(t.over, H / 2 - unit * 2, unit * 1.8);
    centerText(`${t.score}: ${score}`, H / 2, unit * 1.4);
    if (best !== null) centerText(`${t.best}: ${best}`, H / 2 + unit * 1.8, unit);
    centerText(t.again, H / 2 + unit * 4, unit);
  }
}

let last = performance.now();
function frame(now) {
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;
  update(dt);
  draw();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
