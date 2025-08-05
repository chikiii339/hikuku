// === Beatmap: Based on your video ===
const beatmap = [
  { type: "tap", x: 180, y: 350, time: 0 },
  { type: "tap", x: 210, y: 400, time: 800 },
  { type: "slide", x1: 200, y1: 390, x2: 280, y2: 450, duration: 400, time: 1600 },
  { type: "tap", x: 220, y: 420, time: 2500 }
];

// === Tap and Slide Simulators ===
function simulateTap(x, y) {
  const el = document.elementFromPoint(x, y);
  if (!el) return;

  el.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, clientX: x, clientY: y }));
  el.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, clientX: x, clientY: y }));
  console.log(`🟢 Tap at (${x}, ${y})`);
}

function simulateSlide(x1, y1, x2, y2, duration) {
  const el = document.elementFromPoint(x1, y1);
  if (!el) return;

  const steps = 10;
  const delay = duration / steps;

  let i = 0;
  function step() {
    const x = x1 + ((x2 - x1) * i) / steps;
    const y = y1 + ((y2 - y1) * i) / steps;
    el.dispatchEvent(new PointerEvent("pointermove", { bubbles: true, clientX: x, clientY: y }));
    i++;
    if (i <= steps) setTimeout(step, delay);
    else el.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, clientX: x2, clientY: y2 }));
  }

  el.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, clientX: x1, clientY: y1 }));
  setTimeout(step, delay);
}

// === Autoplay After "GO" ===
function startAutoPlay() {
  const startTime = Date.now();
  beatmap.forEach(action => {
    setTimeout(() => {
      if (action.type === "tap") {
        simulateTap(action.x, action.y);
      } else if (action.type === "slide") {
        simulateSlide(action.x1, action.y1, action.x2, action.y2, action.duration);
      }
    }, action.time);
  });
  console.log("🎮 AutoPlay Started");
}

// === Detect "GO" and Start Script ===
const observer = new MutationObserver(mutations => {
  for (let mutation of mutations) {
    if (mutation.type === "childList") {
      const goText = Array.from(document.querySelectorAll("*")).find(el => /GO!?/i.test(el.textContent));
      if (goText) {
        console.log("🚀 'GO!' detected — launching autoplay");
        observer.disconnect();
        setTimeout(startAutoPlay, 200); // small buffer before first circle
        break;
      }
    }
  }
});

observer.observe(document.body, { childList: true, subtree: true });
console.log("⏳ Waiting for 'GO'...");
