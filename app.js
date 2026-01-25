const STORAGE_KEY = "jeopardy-football-state";

const DEFAULT_STATE = {
  teams: [
    {
      name: "Team 1",
      avatar: "🦁",
      totalYards: 0,
      drivePosition: 0,
      color: "#ef4444",
      direction: 1,
    },
    {
      name: "Team 2",
      avatar: "🐻",
      totalYards: 0,
      drivePosition: 0,
      color: "#3b82f6",
      direction: -1,
    },
  ],
  usedClues: {},
  offenseIndex: 0,
};

const DEFAULT_CATEGORIES = [
  {
    title: "Football",
    clues: [
      { value: 10, question: "What shape is a football?", answer: "Oval." },
      { value: 20, question: "What do players try to reach to score a touchdown?", answer: "End zone." },
      { value: 30, question: "How many points is a touchdown worth?", answer: "6 points." },
      { value: 40, question: "Who won the 2025 Super Bowl?", answer: "Philadelphia Eagles." },
      {
        value: 50,
        question: "Which team has won the Super Bowl the most times?",
        answer: "The New England Patriots and the Pittsburgh Steelers are tied with six championships each.",
      },
    ],
  },
  {
    title: "Satsang Diksha",
    clues: [
      { value: 10, question: "How many Shlokas are in the Satsang Diksha?", answer: "315." },
      { value: 20, question: "Who wrote the Satsang Diksha?", answer: "Pragat Brahmaswarup Mahant Swami Maharaj." },
      { value: 30, question: "Where was the Satsang Diksha written?", answer: "Nenpur." },
      { value: 40, question: "In which year was the Satsang Diksha given to us?", answer: "2020." },
      {
        value: 50,
        question: "What is the first Satsang Diksha Shlok? (Swaminarayan Bhagwan etle ke sākshāt…)",
        answer: "Swaminarayan Bhagwan etle ke sākshāt Akshar-Purushottam Maharaj sarvane param shānti, ānand ane sukh arpe.",
      },
    ],
  },
  {
    title: "General Knowledge",
    clues: [
      { value: 10, question: "How many states are there in the United States?", answer: "50." },
      { value: 20, question: "Who is the president right now?", answer: "Donald Trump." },
      { value: 30, question: "How many continents are there?", answer: "7." },
      { value: 40, question: "Who discovered America?", answer: "Christopher Columbus." },
      { value: 50, question: "How many planets are in the solar system?", answer: "8." },
    ],
  },
  {
    title: "Satsang Questions",
    clues: [
      { value: 10, question: "At what age did Ghanshyam leave his home?", answer: "11." },
      { value: 20, question: "What were the names of Maharaj’s parents?", answer: "Dharmadev and Bhaktimata." },
      { value: 30, question: "How many beads does a mala have?", answer: "108." },
      {
        value: 40,
        question: "What year was Maharaj born?",
        answer: "April 3, 1781 (Chaitra Sud 9, Vikram Samvat 1837).",
      },
      { value: 50, question: "What was Mahant Swami’s childhood name?", answer: "Vinubhai Patel." },
    ],
  },
  {
    title: "Miscellaneous",
    clues: [
      {
        value: 10,
        question: "What was the name Maharaj was recognized by when he was traveling across India in his teenage years?",
        answer: "Nilkanth Varni.",
      },
      { value: 20, question: "What is the tallest animal on Earth?", answer: "Giraffe." },
      { value: 30, question: "How many players from each team are on a football field at once?", answer: "11." },
      { value: 40, question: "How many mandirs did Maharaj make?", answer: "6." },
      {
        value: 50,
        question: "What are the five mandirs that Shastriji Maharaj built?",
        answer: "Bochasan, Sarangpur, Gondal, Atladra, Gadhada.",
      },
    ],
  },
];

const CUSTOM_QUESTIONS_KEY = "jeopardy-custom-questions";

let CATEGORIES = loadCustomQuestions();

const boardEl = document.getElementById("board");
const modalEl = document.getElementById("questionModal");
const modalCategory = document.getElementById("modalCategory");
const modalValue = document.getElementById("modalValue");
const modalStatus = document.getElementById("modalStatus");
const modalQuestion = document.getElementById("modalQuestion");
const modalAnswer = document.getElementById("modalAnswer");
const answerBlock = document.getElementById("answerBlock");
const showAnswerBtn = document.getElementById("showAnswerBtn");
const awardOffenseBtn = document.getElementById("awardOffenseBtn");
const awardDefenseBtn = document.getElementById("awardDefenseBtn");
const noAwardBtn = document.getElementById("noAwardBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const newGameBtn = document.getElementById("newGameBtn");
const swapTeamsBtn = document.getElementById("swapTeamsBtn");

const teamNameInputs = [document.getElementById("teamName0"), document.getElementById("teamName1")];
const teamAvatarInputs = [document.getElementById("teamAvatar0"), document.getElementById("teamAvatar1")];
const teamColorInputs = [document.getElementById("teamColor0"), document.getElementById("teamColor1")];
const teamCards = Array.from(document.querySelectorAll(".team-card"));
const teamYardsEls = [document.getElementById("teamYards0"), document.getElementById("teamYards1")];
const scoreboardNameEls = [document.getElementById("scoreName0"), document.getElementById("scoreName1")];
const scoreboardTDEls = [document.getElementById("scoreTD0"), document.getElementById("scoreTD1")];
const markers = [document.getElementById("marker0"), document.getElementById("marker1")];
const footballIcon = document.getElementById("footballIcon");
const fieldEl = document.querySelector(".field");
const tdBanner = document.getElementById("tdBanner");
const turnBanner = document.getElementById("turnBanner");
const winnerOverlay = document.getElementById("winnerOverlay");
const winnerText = document.getElementById("winnerText");
const closeWinnerBtn = document.getElementById("closeWinnerBtn");
const tipsBtn = document.getElementById("tipsBtn");
const tipsOverlay = document.getElementById("tipsOverlay");
const closeTipsBtn = document.getElementById("closeTipsBtn");
const editQuestionsBtn = document.getElementById("editQuestionsBtn");
const editQuestionsOverlay = document.getElementById("editQuestionsOverlay");
const closeEditQuestionsBtn = document.getElementById("closeEditQuestionsBtn");
const categoryListEl = document.getElementById("categoryList");
const categoryEditorEl = document.getElementById("categoryEditor");
const saveQuestionsBtn = document.getElementById("saveQuestionsBtn");
const resetQuestionsBtn = document.getElementById("resetQuestionsBtn");
const questionsError = document.getElementById("questionsError");
const endzoneNameEls = [document.getElementById("endzoneName0"), document.getElementById("endzoneName1")];
const possessionEls = [document.getElementById("possession0"), document.getElementById("possession1")];
const offenseNameEl = document.getElementById("offenseName");
const defenseNameEl = document.getElementById("defenseName");
const themeSelect = document.getElementById("themeSelect");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const timerToggle = document.getElementById("timerToggle");
const timerSelect = document.getElementById("timerSelect");
const modalTimer = document.getElementById("modalTimer");
const endzoneAvatarEls = [document.getElementById("endzoneAvatar0"), document.getElementById("endzoneAvatar1")];

let state = loadState();
let activeClue = null;
let timerId = null;
let timerRemaining = 0;

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return structuredClone(DEFAULT_STATE);
  try {
    const parsed = JSON.parse(saved);
    if (!parsed.teams || parsed.teams.length !== 2) return structuredClone(DEFAULT_STATE);
    const hydratedTeams = parsed.teams.map((team, index) => {
      const defaults = DEFAULT_STATE.teams[index];
      const legacyYards = Number.isFinite(team.yards) ? team.yards : 0;
      return {
        ...defaults,
        ...team,
        avatar: team.avatar || defaults.avatar,
        color: normalizeColor(team.color || defaults.color),
        direction: Number.isInteger(team.direction) ? team.direction : defaults.direction,
        totalYards: Number.isFinite(team.totalYards) ? team.totalYards : legacyYards,
        drivePosition: Number.isFinite(team.drivePosition) ? team.drivePosition : legacyYards % 100,
      };
    });
    return {
      teams: hydratedTeams,
      usedClues: parsed.usedClues || {},
      offenseIndex: Number.isInteger(parsed.offenseIndex) ? parsed.offenseIndex : 0,
    };
  } catch (error) {
    return structuredClone(DEFAULT_STATE);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function normalizeColor(color) {
  if (!color) return "#ef4444";
  if (color === "red") return "#ef4444";
  if (color === "blue") return "#3b82f6";
  return color;
}

function buildBoard() {
  boardEl.innerHTML = "";
  CATEGORIES.forEach((category, catIndex) => {
    const catEl = document.createElement("div");
    catEl.className = "category";
    catEl.textContent = category.title;
    boardEl.appendChild(catEl);
  });

  const maxClues = Math.max(...CATEGORIES.map((cat) => cat.clues.length));
  for (let clueIndex = 0; clueIndex < maxClues; clueIndex += 1) {
    CATEGORIES.forEach((category, catIndex) => {
      const clue = category.clues[clueIndex];
      const clueEl = document.createElement("div");
      clueEl.className = "clue";
      clueEl.dataset.cat = String(catIndex);
      clueEl.dataset.clue = String(clueIndex);
      clueEl.textContent = clue ? `${clue.value}` : "";
      if (!clue) {
        clueEl.classList.add("used");
        clueEl.textContent = "";
        clueEl.style.visibility = "hidden";
      } else if (state.usedClues[`${catIndex}-${clueIndex}`]) {
        clueEl.classList.add("used");
      }
      clueEl.addEventListener("click", () => handleClueClick(catIndex, clueIndex));
      boardEl.appendChild(clueEl);
    });
  }
}

function handleClueClick(catIndex, clueIndex) {
  const key = `${catIndex}-${clueIndex}`;
  if (state.usedClues[key]) return;
  const clue = CATEGORIES[catIndex].clues[clueIndex];
  if (!clue) return;
  activeClue = { catIndex, clueIndex, ...clue };
  openModal();
}

function loadCustomQuestions() {
  const saved = localStorage.getItem(CUSTOM_QUESTIONS_KEY);
  if (!saved) return structuredClone(DEFAULT_CATEGORIES);
  try {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.length) {
      return parsed;
    }
  } catch (error) {
    return structuredClone(DEFAULT_CATEGORIES);
  }
  return structuredClone(DEFAULT_CATEGORIES);
}

function validateQuestions(candidate) {
  if (!Array.isArray(candidate) || candidate.length === 0) {
    return "Questions must be an array of categories.";
  }
  for (const category of candidate) {
    if (!category.title || !Array.isArray(category.clues)) {
      return "Each category must have a title and clues array.";
    }
    for (const clue of category.clues) {
      if (typeof clue.value !== "number") return "Each clue must include a numeric value.";
      if (!clue.question || !clue.answer) return "Each clue must include question and answer.";
    }
  }
  return null;
}

function openModal() {
  if (!activeClue) return;
  modalCategory.textContent = CATEGORIES[activeClue.catIndex].title;
  modalValue.textContent = `${activeClue.value} yards`;
  modalStatus.textContent = "Unanswered";
  modalQuestion.textContent = activeClue.question;
  modalAnswer.textContent = activeClue.answer;
  answerBlock.classList.add("hidden");
  startTimer();
  modalEl.classList.remove("hidden");
}

function closeModal() {
  modalEl.classList.add("hidden");
  activeClue = null;
  stopTimer();
}

function awardClue(teamIndex) {
  if (!activeClue) return;
  const key = `${activeClue.catIndex}-${activeClue.clueIndex}`;
  state.usedClues[key] = true;
  if (teamIndex !== null) {
    const yardDelta = calculateYards(activeClue.value);
    const result = applyYards(teamIndex, yardDelta);
    if (result.yardsApplied !== 0) {
      showPlayResult(state.teams[teamIndex].name, result.yardsApplied);
    }
  } else {
    logEvent("No award given for that clue.");
  }
  const nextOffenseIndex = 1 - state.offenseIndex;
  setTimeout(() => {
    state.offenseIndex = nextOffenseIndex;
    logEvent(`${state.teams[state.offenseIndex].name} takes possession.`);
    showTurn(state.teams[state.offenseIndex].name);
    saveState();
    updateUI();
  }, 1600);
  closeModal();
}


function updateTeamNames() {
  state.teams.forEach((team, index) => {
    teamNameInputs[index].value = team.name;
  });
}

function updateScoreboard() {
  state.teams.forEach((team, index) => {
    teamYardsEls[index].textContent = team.totalYards;
    scoreboardNameEls[index].textContent = team.name;
    scoreboardTDEls[index].textContent = `${team.totalYards} yards`;
    endzoneNameEls[index].textContent = team.name;
    endzoneAvatarEls[index].textContent = team.avatar;
    teamAvatarInputs[index].value = team.avatar;
    teamColorInputs[index].value = team.color;
    possessionEls[index].textContent = index === state.offenseIndex ? "Offense" : "Defense";
    possessionEls[index].style.backgroundColor = hexToRgba(team.color, 0.25);
    possessionEls[index].style.color = getTextColor(team.color);
    teamCards[index].classList.toggle("is-offense", index === state.offenseIndex);
  });
  if (offenseNameEl) {
    offenseNameEl.textContent = state.teams[state.offenseIndex].name;
  }
  if (defenseNameEl) {
    defenseNameEl.textContent = state.teams[1 - state.offenseIndex].name;
  }
}

function updateMarkers() {
  const fieldWidth = 100;
  const endzoneWidth = 60;
  const fieldWidthPx = fieldEl ? fieldEl.clientWidth : 0;
  const playableWidth = Math.max(0, fieldWidthPx - endzoneWidth * 2);

  const toFieldLeft = (displayPosition) => {
    if (!fieldWidthPx) return `${6 + (displayPosition / fieldWidth) * 88}%`;
    const leftPx = endzoneWidth + (displayPosition / fieldWidth) * playableWidth;
    return `${leftPx}px`;
  };

  state.teams.forEach((team, index) => {
    const position = team.drivePosition % fieldWidth;
    const displayPosition = team.direction === 1 ? position : fieldWidth - position;
    const marker = markers[index];
    marker.style.left = toFieldLeft(displayPosition);
    marker.classList.remove("pulse");
    requestAnimationFrame(() => marker.classList.add("pulse"));
    marker.className = `team-marker direction-${team.direction === 1 ? "right" : "left"} pulse`;
    marker.style.setProperty("--team-color", team.color);
  });
  const offense = state.teams[state.offenseIndex];
  const offensePosition = offense.drivePosition % fieldWidth;
  const offenseDisplay = offense.direction === 1 ? offensePosition : fieldWidth - offensePosition;
  footballIcon.style.left = toFieldLeft(offenseDisplay);
}

function updateAwardButtons() {
  const offenseTeam = state.teams[state.offenseIndex];
  const defenseTeam = state.teams[1 - state.offenseIndex];
  awardOffenseBtn.textContent = `Offense Correct (${offenseTeam.name})`;
  awardDefenseBtn.textContent = `Defense Steal (${defenseTeam.name})`;
  applyButtonColor(awardOffenseBtn, offenseTeam.color);
  applyButtonColor(awardDefenseBtn, defenseTeam.color);
}

function updateTeamColors() {
  state.teams.forEach((team, index) => {
    const icon = document.querySelector(`[data-team="${index}"] .team-icon`);
    const markerDot = markers[index].querySelector(".marker-dot");
    const endzone = endzoneNameEls[index].parentElement;
    const textColor = getTextColor(team.color);
    icon.style.backgroundColor = team.color;
    icon.style.color = textColor;
    markerDot.style.backgroundColor = team.color;
    endzone.style.backgroundColor = hexToRgba(team.color, 0.75);
    endzoneNameEls[index].style.color = textColor;
  });
}

function updateTeamInitials() {
  const icon0 = document.querySelector('[data-team="0"] .team-icon');
  const icon1 = document.querySelector('[data-team="1"] .team-icon');
  icon0.textContent = state.teams[0].avatar;
  icon1.textContent = state.teams[1].avatar;
}

function updateUI() {
  updateTeamNames();
  updateScoreboard();
  updateMarkers();
  updateAwardButtons();
  updateTeamColors();
  updateTeamInitials();
  buildBoard();
  checkGameOver();
}

function applyButtonColor(button, color) {
  button.className = "btn";
  button.style.backgroundColor = color;
  button.style.color = getTextColor(color);
}

function hexToRgba(hex, alpha) {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getTextColor(hex) {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.7 ? "#0f172a" : "#f8fafc";
}

function triggerCelebration(teamColor) {
  if (!fieldEl) return;
  const confettiCount = 24;
  for (let i = 0; i < confettiCount; i += 1) {
    const piece = document.createElement("div");
    piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.backgroundColor = i % 2 === 0 ? teamColor : "#fbbf24";
    piece.style.animationDelay = `${Math.random() * 0.4}s`;
    fieldEl.appendChild(piece);
    setTimeout(() => piece.remove(), 2200);
  }
}

function showTouchdown(teamName) {
  if (!tdBanner) return;
  tdBanner.textContent = `${teamName} TOUCHDOWN!`;
  tdBanner.classList.remove("hidden");
  setTimeout(() => tdBanner.classList.add("hidden"), 1800);
}

function showPlayResult(teamName, yardsApplied) {
  if (!turnBanner) return;
  const verb = yardsApplied > 0 ? "scored" : "lost";
  const yards = Math.abs(yardsApplied);
  turnBanner.textContent = `${teamName} ${verb} ${yards} yards`;
  turnBanner.classList.remove("hidden");
  setTimeout(() => turnBanner.classList.add("hidden"), 1600);
}

function showTurn(teamName) {
  if (!turnBanner) return;
  turnBanner.textContent = `Now ${teamName}'s turn`;
  turnBanner.classList.remove("hidden");
  requestAnimationFrame(() => turnBanner.classList.add("show"));
  setTimeout(() => {
    turnBanner.classList.remove("show");
    turnBanner.classList.add("hidden");
  }, 1600);
}

function checkGameOver() {
  const totalClues = CATEGORIES.reduce((sum, category) => sum + category.clues.length, 0);
  const usedCount = Object.keys(state.usedClues).length;
  if (usedCount < totalClues) {
    if (winnerOverlay) winnerOverlay.classList.add("hidden");
    return;
  }
  const [teamA, teamB] = state.teams;
  let message = "It's a tie!";
  if (teamA.totalYards > teamB.totalYards) {
    message = `${teamA.name} wins!`;
  } else if (teamB.totalYards > teamA.totalYards) {
    message = `${teamB.name} wins!`;
  }
  if (winnerText) {
    winnerText.textContent = message;
  }
  winnerOverlay.classList.remove("hidden");
  triggerCelebration(teamA.totalYards >= teamB.totalYards ? teamA.color : teamB.color);
}

function calculateYards(baseValue) {
  return baseValue;
}

function applyYards(teamIndex, yardDelta) {
  const team = state.teams[teamIndex];
  if (yardDelta > 0) {
    const yardsToGoal = 100 - team.drivePosition;
    if (yardDelta >= yardsToGoal) {
      team.totalYards += yardsToGoal;
      team.drivePosition = 0;
      logEvent(`${team.name} scores a touchdown! +7 points.`);
      triggerCelebration(team.color);
      showTouchdown(team.name);
      team.direction *= -1;
      return { yardsApplied: yardsToGoal, touchdown: true };
    } else {
      team.totalYards += yardDelta;
      team.drivePosition += yardDelta;
      logEvent(`${team.name} gains ${yardDelta} yards.`);
      return { yardsApplied: yardDelta, touchdown: false };
    }
  } else if (yardDelta < 0) {
    team.totalYards = Math.max(0, team.totalYards + yardDelta);
    team.drivePosition = Math.max(0, team.drivePosition + yardDelta);
    logEvent(`${team.name} loses ${Math.abs(yardDelta)} yards.`);
    return { yardsApplied: yardDelta, touchdown: false };
  }
  return { yardsApplied: 0, touchdown: false };
}

function logEvent(message) {
  void message;
}

function setupTeamInputs() {
  teamNameInputs.forEach((input, index) => {
    input.addEventListener("input", (event) => {
      state.teams[index].name = event.target.value || `Team ${index + 1}`;
      saveState();
      updateScoreboard();
      updateAwardButtons();
      updateTeamInitials();
    });
  });
}

function setupTeamAvatars() {
  teamAvatarInputs.forEach((input, index) => {
    const handler = (event) => {
      state.teams[index].avatar = event.target.value;
      saveState();
      updateTeamInitials();
      updateScoreboard();
    };
    input.addEventListener("change", handler);
    input.addEventListener("input", handler);
  });
}

function setupTeamColors() {
  teamColorInputs.forEach((input, index) => {
    input.addEventListener("input", (event) => {
      state.teams[index].color = normalizeColor(event.target.value);
      saveState();
      updateTeamColors();
      updateMarkers();
      updateAwardButtons();
      updateScoreboard();
    });
  });
}

function applyTheme(theme) {
  document.body.classList.toggle("theme-day", theme === "day");
}

function setupThemeSelect() {
  themeSelect.addEventListener("change", (event) => {
    applyTheme(event.target.value);
  });
  applyTheme(themeSelect.value);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function openQuestionsEditor() {
  questionsError.classList.add("hidden");
  categoryListEl.innerHTML = "";
  CATEGORIES.forEach((category, index) => {
    const button = document.createElement("button");
    button.className = "category-button";
    button.type = "button";
    button.textContent = category.title;
    button.addEventListener("click", () => renderCategoryEditor(index));
    categoryListEl.appendChild(button);
  });
  renderCategoryEditor(0);
  editQuestionsOverlay.classList.remove("hidden");
}

function closeQuestionsEditor() {
  editQuestionsOverlay.classList.add("hidden");
}

function renderCategoryEditor(index) {
  const category = CATEGORIES[index];
  Array.from(categoryListEl.children).forEach((child, idx) => {
    child.classList.toggle("active", idx === index);
  });
  const rows = category.clues
    .map(
      (clue, clueIndex) => `
        <div class="clue-row" data-index="${clueIndex}">
          <input class="edit-input clue-value" type="number" value="${escapeHtml(clue.value)}" />
          <textarea class="edit-textarea clue-question">${escapeHtml(clue.question)}</textarea>
          <textarea class="edit-textarea clue-answer">${escapeHtml(clue.answer)}</textarea>
        </div>
      `
    )
    .join("");

  categoryEditorEl.innerHTML = `
    <label class="edit-label">
      Category Title
      <input id="categoryTitleInput" class="edit-input" type="text" value="${escapeHtml(category.title)}" />
    </label>
    <div class="clue-editor">${rows}</div>
  `;

  categoryEditorEl.dataset.activeIndex = String(index);
}

function setupFullscreen() {
  fullscreenBtn.addEventListener("click", async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      fullscreenBtn.textContent = "Exit Fullscreen";
      document.body.classList.add("fullscreen-mode");
    } else {
      await document.exitFullscreen();
      fullscreenBtn.textContent = "Fullscreen";
      document.body.classList.remove("fullscreen-mode");
    }
  });
  document.addEventListener("fullscreenchange", () => {
    const isFull = Boolean(document.fullscreenElement);
    fullscreenBtn.textContent = isFull ? "Exit Fullscreen" : "Fullscreen";
    document.body.classList.toggle("fullscreen-mode", isFull);
  });
}

function updateTimerDisplay() {
  if (!timerToggle.checked) {
    modalTimer.textContent = "--";
    return;
  }
  modalTimer.textContent = String(timerRemaining);
}

function startTimer() {
  stopTimer();
  if (!timerToggle.checked) {
    updateTimerDisplay();
    return;
  }
  timerRemaining = Number(timerSelect.value);
  updateTimerDisplay();
  timerId = setInterval(() => {
    timerRemaining -= 1;
    updateTimerDisplay();
    if (timerRemaining <= 0) {
      stopTimer();
      const defenseTeam = state.teams[1 - state.offenseIndex].name;
      modalStatus.textContent = `Time’s up! ${defenseTeam}, you can steal this one.`;
      logEvent("Time ran out. Defense can steal.");
    }
  }, 1000);
}

function stopTimer() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
}

function setupTimerControls() {
  timerToggle.addEventListener("change", () => {
    if (!timerToggle.checked) {
      stopTimer();
      updateTimerDisplay();
    }
  });
  timerSelect.addEventListener("change", () => {
    if (!activeClue) {
      timerRemaining = Number(timerSelect.value);
      updateTimerDisplay();
    }
  });
  timerRemaining = Number(timerSelect.value);
  updateTimerDisplay();
}

function buildYardLines() {
  const yardLinesEl = document.getElementById("yardLines");
  yardLinesEl.innerHTML = "";
  for (let i = 10; i <= 50; i += 10) {
    const leftPos = i;
    const rightPos = 100 - i;
    const line = document.createElement("div");
    line.className = "yard-line";
    line.style.left = `${leftPos}%`;
    yardLinesEl.appendChild(line);

    const label = document.createElement("div");
    label.className = "yard-number";
    label.style.left = `${leftPos}%`;
    label.textContent = i;
    yardLinesEl.appendChild(label);

    if (rightPos !== leftPos) {
      const lineRight = document.createElement("div");
      lineRight.className = "yard-line";
      lineRight.style.left = `${rightPos}%`;
      yardLinesEl.appendChild(lineRight);

      const labelRight = document.createElement("div");
      labelRight.className = "yard-number";
      labelRight.style.left = `${rightPos}%`;
      labelRight.textContent = i;
      yardLinesEl.appendChild(labelRight);
    }
  }
}

function swapTeamColors() {
  const temp = state.teams[0].color;
  state.teams[0].color = state.teams[1].color;
  state.teams[1].color = temp;
  saveState();
  updateTeamColors();
  updateAwardButtons();
  updateScoreboard();
}

function newGame() {
  state = structuredClone(DEFAULT_STATE);
  saveState();
  logEvent("New game started.");
  updateUI();
  if (winnerOverlay) winnerOverlay.classList.add("hidden");
}

showAnswerBtn.addEventListener("click", () => {
  answerBlock.classList.remove("hidden");
});

awardOffenseBtn.addEventListener("click", () => awardClue(state.offenseIndex));
awardDefenseBtn.addEventListener("click", () => awardClue(1 - state.offenseIndex));
noAwardBtn.addEventListener("click", () => awardClue(null));
closeModalBtn.addEventListener("click", closeModal);
newGameBtn.addEventListener("click", newGame);
swapTeamsBtn.addEventListener("click", swapTeamColors);
closeWinnerBtn.addEventListener("click", () => winnerOverlay.classList.add("hidden"));

modalEl.addEventListener("click", (event) => {
  if (event.target === modalEl) closeModal();
});

tipsBtn.addEventListener("click", () => tipsOverlay.classList.remove("hidden"));
closeTipsBtn.addEventListener("click", () => tipsOverlay.classList.add("hidden"));
tipsOverlay.addEventListener("click", (event) => {
  if (event.target === tipsOverlay) tipsOverlay.classList.add("hidden");
});

editQuestionsBtn.addEventListener("click", openQuestionsEditor);
closeEditQuestionsBtn.addEventListener("click", closeQuestionsEditor);
editQuestionsOverlay.addEventListener("click", (event) => {
  if (event.target === editQuestionsOverlay) closeQuestionsEditor();
});
saveQuestionsBtn.addEventListener("click", () => {
  questionsError.classList.add("hidden");
  try {
    const activeIndex = Number(categoryEditorEl.dataset.activeIndex || 0);
    const titleInput = document.getElementById("categoryTitleInput");
    const title = titleInput ? titleInput.value.trim() : "";
    if (!title) {
      questionsError.textContent = "Category title is required.";
      questionsError.classList.remove("hidden");
      return;
    }

    const rows = Array.from(categoryEditorEl.querySelectorAll(".clue-row"));
    const clues = rows.map((row) => {
      const value = Number(row.querySelector(".clue-value").value);
      const question = row.querySelector(".clue-question").value.trim();
      const answer = row.querySelector(".clue-answer").value.trim();
      return { value, question, answer };
    });

    const updated = [...CATEGORIES];
    updated[activeIndex] = { title, clues };

    const error = validateQuestions(updated);
    if (error) {
      questionsError.textContent = error;
      questionsError.classList.remove("hidden");
      return;
    }
    CATEGORIES = updated;
    localStorage.setItem(CUSTOM_QUESTIONS_KEY, JSON.stringify(updated));
    state.usedClues = {};
    saveState();
    buildBoard();
    closeQuestionsEditor();
  } catch (error) {
    questionsError.textContent = "Please check your entries and try again.";
    questionsError.classList.remove("hidden");
  }
});
resetQuestionsBtn.addEventListener("click", () => {
  CATEGORIES = structuredClone(DEFAULT_CATEGORIES);
  localStorage.removeItem(CUSTOM_QUESTIONS_KEY);
  state.usedClues = {};
  saveState();
  buildBoard();
  openQuestionsEditor();
});

buildYardLines();
setupTeamInputs();
setupTeamAvatars();
setupTeamColors();
setupThemeSelect();
setupFullscreen();
setupTimerControls();
updateUI();

