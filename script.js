// Audio Synthesizer (Web Audio API)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(freq, type = 'sine', duration = 0.15) {
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {}
}

// Navegación entre pantallas
function goToScreen(screenId) {
  playSound(523.25);
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
}

// NIVEL 1: QUIZ LOGIC
let currentQ = 1;
let collectedPieces = 0;

function checkAnswer(questionNum, answer, isCorrect) {
  if (isCorrect) {
    playSound(659.25); // E5 (Sonido acierto)
    collectedPieces++;
    document.getElementById(`p${collectedPieces}`).textContent = '💖';
    document.getElementById(`p${collectedPieces}`).classList.add('collected');

    if (questionNum < 3) {
      document.getElementById(`q${questionNum}`).classList.add('hidden');
      document.getElementById(`q${questionNum + 1}`).classList.remove('hidden');
    } else {
      document.getElementById(`q3`).classList.add('hidden');
      document.getElementById('btn-next1').classList.remove('hidden');
      playSound(880, 'triangle', 0.4); // A5 éxito
    }
  } else {
    playSound(220, 'sawtooth', 0.2); // Error
    alert('¡Cerca! Inténtalo de nuevo mi amor ❤️');
  }
}

// NIVEL 2: CANVAS GAME LOGIC
let canvas, ctx;
let basket = { x: 140, y: 340, width: 60, height: 15 };
let hearts = [];
let score = 0;
let timeLeft = 20;
let gameInterval, timerInterval;
let isPlaying = false;

function startGame() {
  canvas = document.getElementById('gameCanvas');
  ctx = canvas.getContext('2d');
  
  score = 0;
  timeLeft = 20;
  hearts = [];
  isPlaying = true;

  document.getElementById('score').textContent = score;
  document.getElementById('timer').textContent = timeLeft;
  document.getElementById('btn-start2').classList.add('hidden');

  // Controles
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    basket.x = e.clientX - rect.left - basket.width / 2;
  });

  canvas.addEventListener('touchmove', (e) => {
    const rect = canvas.getBoundingClientRect();
    basket.x = e.touches[0].clientX - rect.left - basket.width / 2;
  });

  gameInterval = setInterval(updateGame, 1000 / 60);
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById('timer').textContent = timeLeft;
    if (timeLeft <= 0) endGame();
  }, 1000);
}

function updateGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Canasta
  ctx.fillStyle = '#ff758c';
  ctx.beginPath();
  ctx.roundRect(basket.x, basket.y, basket.width, basket.height, 8);
  ctx.fill();

  // Generar corazones
  if (Math.random() < 0.04) {
    hearts.push({
      x: Math.random() * (canvas.width - 20),
      y: 0,
      speed: 2.5 + Math.random() * 2,
      size: 18
    });
  }

  // Mover y Dibujar Corazones
  for (let i = 0; i < hearts.length; i++) {
    let h = hearts[i];
    h.y += h.speed;

    ctx.font = `${h.size}px serif`;
    ctx.fillText('❤️', h.x, h.y);

    // Colisión con canasta
    if (
      h.y >= basket.y - 5 &&
      h.y <= basket.y + basket.height &&
      h.x >= basket.x - 10 &&
      h.x <= basket.x + basket.width
    ) {
      playSound(783.99, 'sine', 0.1);
      score++;
      document.getElementById('score').textContent = score;
      hearts.splice(i, 1);
      i--;

      if (score >= 10) endGame(true);
    } else if (h.y > canvas.height) {
      hearts.splice(i, 1);
      i--;
    }
  }
}

function endGame(win = false) {
  clearInterval(gameInterval);
  clearInterval(timerInterval);
  isPlaying = false;

  if (win || score >= 10) {
    playSound(1046.50, 'triangle', 0.5);
    document.getElementById('btn-next2').classList.remove('hidden');
  } else {
    alert('¡Se acabó el tiempo! Reintentémoslo 💪');
    document.getElementById('btn-start2').classList.remove('hidden');
  }
}

// NIVEL 3: RULETA LOGIC
let selectedPrize = '';

function spinWheel() {
  const wheel = document.getElementById('wheel');
  const btn = document.getElementById('btn-spin');
  btn.disabled = true;

  playSound(440, 'square', 0.1);
  const prizes = [
    'Cena Romántica 🍷',
    'Masaje Relajante 💆‍♀️',
    'Noche de Pelis 🍿',
    'Vale de Postre 🍦',
    'Paseo Sorpresa 🚗',
    'Día de Engreimiento 👑'
  ];

  const randDegrees = 1440 + Math.floor(Math.random() * 360);
  wheel.style.transform = `rotate(${randDegrees}deg)`;

  setTimeout(() => {
    const actualDeg = randDegrees % 360;
    const index = Math.floor((360 - actualDeg + 30) % 360 / 60);
    selectedPrize = prizes[index];

    const res = document.getElementById('wheel-result');
    res.textContent = `¡Has ganado: ${selectedPrize}! 🎉`;
    res.classList.remove('hidden');

    document.getElementById('cert-prize').textContent = `Premio Canjeable: ${selectedPrize}`;
    document.getElementById('btn-next3').classList.remove('hidden');
    playSound(880, 'sine', 0.5);
  }, 4000);
}

// CELEBRACIÓN FINAL
function launchCelebration() {
  playSound(523.25, 'triangle', 0.2);
  setTimeout(() => playSound(659.25, 'triangle', 0.2), 150);
  setTimeout(() => playSound(783.99, 'triangle', 0.2), 300);
  setTimeout(() => playSound(1046.50, 'triangle', 0.4), 450);

  confetti({
    particleCount: 120,
    spread: 70,
    origin: { y: 0.6 }
  });
}
