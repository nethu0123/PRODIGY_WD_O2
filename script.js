let startTime = 0;
let elapsed = 0;
let timerInterval = null;
let running = false;
let laps = [];

const display = document.getElementById('display');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');
const lapBtn = document.getElementById('lap');
const lapList = document.getElementById('lapList');

function formatTime(ms) {
  const centiseconds = Math.floor((ms % 1000) / 10);
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor(ms / (1000 * 60 * 60));
  return (
    (hours < 10 ? '0' : '') + hours + ':' +
    (minutes < 10 ? '0' : '') + minutes + ':' +
    (seconds < 10 ? '0' : '') + seconds + '.' +
    (centiseconds < 10 ? '0' : '') + centiseconds
  );
}

function updateDisplay() {
  display.textContent = formatTime(elapsed);
}

function startOrStop() {
  if (!running) {
    // Start
    startTime = Date.now() - elapsed;
    timerInterval = setInterval(() => {
      elapsed = Date.now() - startTime;
      updateDisplay();
    }, 10);
    running = true;
    startBtn.textContent = "Stop";
    pauseBtn.disabled = false;
    resetBtn.disabled = false;
    lapBtn.disabled = false;
    pauseBtn.textContent = "Pause";
  } else {
    // Stop: reset time and laps
    clearInterval(timerInterval);
    elapsed = 0;
    running = false;
    laps = [];
    updateDisplay();
    renderLaps();
    startBtn.textContent = "Start";
    pauseBtn.disabled = true;
    resetBtn.disabled = true;
    lapBtn.disabled = true;
    pauseBtn.textContent = "Pause";
  }
}

function reset() {
  clearInterval(timerInterval);
  elapsed = 0;
  running = false;
  laps = [];
  updateDisplay();
  renderLaps();
  startBtn.disabled = false;
  startBtn.textContent = "Start";
  pauseBtn.disabled = true;
  resetBtn.disabled = true;
  lapBtn.disabled = true;
  pauseBtn.textContent = "Pause";
}

function pauseOrResume() {
  if (running) {
    // Pause
    clearInterval(timerInterval);
    running = false;
    pauseBtn.textContent = "Resume";
    lapBtn.disabled = true;
    startBtn.disabled = true;
  } else {
    // Resume
    startTime = Date.now() - elapsed;
    timerInterval = setInterval(() => {
      elapsed = Date.now() - startTime;
      updateDisplay();
    }, 10);
    running = true;
    pauseBtn.textContent = "Pause";
    lapBtn.disabled = false;
    startBtn.disabled = false;
  }
}
function lap() {
  if (running) {
    laps.push(elapsed);
    renderLaps();
  }
}

function renderLaps() {
  lapList.innerHTML = '';
  laps.forEach((lapTime, idx) => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="lap-label">Lap ${idx + 1}</span> <span>${formatTime(lapTime)}</span>`;
    lapList.appendChild(li);
  });
}

startBtn.addEventListener('click', startOrStop);
pauseBtn.addEventListener('click', pauseOrResume);
resetBtn.addEventListener('click', reset);
lapBtn.addEventListener('click', lap);

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    pauseOrResume();
  }
  if (e.code === 'KeyL' && running) lap();
  if (e.code === 'KeyR') reset();
});

updateDisplay();