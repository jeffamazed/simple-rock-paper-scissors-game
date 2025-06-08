const movesEl = document.getElementById("moves");
const resultText = document.getElementById("result");
const resetBtn = document.getElementById("reset-btn");
const autoPlayBtn = document.getElementById("auto-play-btn");
const scoreText = document.getElementById("score");
const confWindow = document.getElementById("conf-window");
const yesBtn = document.getElementById("yes-btn");
const noBtn = document.getElementById("no-btn");
let score;

try {
  score = JSON.parse(localStorage.getItem("score"));

  if (
    !score ||
    typeof score.wins !== "number" ||
    typeof score.losses !== "number" ||
    typeof score.ties !== "number"
  ) {
    score = { wins: 0, losses: 0, ties: 0 };
  }
} catch (e) {
  score = { wins: 0, losses: 0, ties: 0 };
}

function generateComputerMove() {
  const randNum = Math.random();

  if (randNum < 1 / 3) return "rock";
  if (randNum < 2 / 3) return "paper";
  else return "scissors";
}

function generateResult(player, computer) {
  if (player === computer) {
    score.ties++;
    return "Tie.";
  }

  const winAgainst = {
    rock: "scissors",
    paper: "rock",
    scissors: "paper",
  };

  if (winAgainst[player] === computer) {
    score.wins++;
    return "You win.";
  } else {
    score.losses++;
    return "You lose.";
  }
}

function updateResetBtnState() {
  if (score.wins === 0 && score.losses === 0 && score.ties === 0) {
    resetBtn.disabled = true;
    resetBtn.style.cursor = "not-allowed";
  } else {
    resetBtn.disabled = false;
    resetBtn.style.cursor = "pointer";
  }
}

function updateScore() {
  scoreText.textContent = `Wins: ${score.wins}, Losses: ${score.losses}, Ties: ${score.ties}`;
}

function updateResultMsg(playerMove, computerMove, result) {
  movesEl.innerHTML = `You
        <img class="move-icon" src="./img/${playerMove}-emoji.png" alt="${playerMove} move" />
        <img class="move-icon" src="./img/${computerMove}-emoji.png" alt="${computerMove} move" />
        Computer`;
  resultText.textContent = result;
  updateScore();

  localStorage.setItem("score", JSON.stringify(score));
}

function resetScore() {
  score.wins = 0;
  score.losses = 0;
  score.ties = 0;

  resultText.textContent = "Score is reset! Press on!";
  movesEl.innerHTML = "";

  updateScore();

  localStorage.setItem("score", JSON.stringify(score));
  updateResetBtnState();
  confWindow.classList.add("hidden");
}

function displayConfWindow() {
  confWindow.showModal();

  yesBtn.addEventListener(
    "click",
    () => {
      resetScore();
      confWindow.close();
    },
    { once: true },
  );

  noBtn.addEventListener(
    "click",
    () => {
      confWindow.close();
    },
    { once: true },
  );
}

let isAutoPlaying = false;
let intervalId;

function autoPlay() {
  if (!isAutoPlaying) {
    isAutoPlaying = true;
    autoPlayBtn.textContent = "Stop Play";
    intervalId = setInterval(() => {
      const playerMove = generateComputerMove();
      runGame(playerMove);
    }, 1000);
  } else {
    clearInterval(intervalId);
    isAutoPlaying = false;
    autoPlayBtn.textContent = "Auto Play";
  }
}

function runGame(playerMove) {
  const computerMove = generateComputerMove();
  const result = generateResult(playerMove, computerMove);
  updateResultMsg(playerMove, computerMove, result);

  updateResetBtnState();
}

updateResetBtnState();
updateScore();

// Event Listeners
function handleKeyboard(e) {
  if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;

  if (e.key === "a") autoPlay();
  if (e.key === " ") {
    e.preventDefault();
    if (!resetBtn.disabled) displayConfWindow();
  }

  const move = { r: "rock", p: "paper", s: "scissors" }[e.key.toLowerCase()];

  if (move) runGame(move);
}
document.body.addEventListener("keydown", handleKeyboard);

const moves = ["rock", "paper", "scissors"];

moves.forEach((move) => {
  document
    .getElementById(`${move}-btn`)
    .addEventListener("click", () => runGame(move));
});

autoPlayBtn.addEventListener("click", autoPlay);
resetBtn.addEventListener("click", displayConfWindow);
