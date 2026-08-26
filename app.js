// CompTIA CySA+ (CS0-003) Application Engine - Multi-select & Diagram Support

let state = {
  activeExam: 'cysa',      // 'cysa' or 'secai'
  activeQuestions: [],
  currentIndex: 0,
  userAnswers: {},       // questionId -> answer string/array or PBQ object
  strikethroughs: {},    // questionId -> Set of struck indices
  flagged: new Set(),
  examMode: 'full',      // 'full', 'quick', 'domain', 'pbq', 'study'
  timeRemaining: 165 * 60, // 165 minutes in seconds
  timerInterval: null,
  isPaused: false,
  strikethroughActive: false,
  examHistory: [],
  studyMode: false,         // true when exam mode is 'study'
  revealedQuestions: new Set(), // questionIds that have been answered & revealed
  shuffledOptions: {},      // questionId -> shuffled option indices array
  liveCorrect: 0           // running correct count in study mode
};

const EXAM_METADATA = {
  cysa: {
    title: "CySA+",
    code: "CS0-003",
    sub: "CompTIA Cybersecurity Analyst Simulator",
    passingScore: 750,
    thresholdLeft: "72.2%",
    getQuestions: () => CYSA_QUESTIONS,
    domains: [
      { value: "Domain 1.0: Security Operations", label: "1.0 Security Operations (33%)" },
      { value: "Domain 2.0: Vulnerability Management", label: "2.0 Vulnerability Management (30%)" },
      { value: "Domain 3.0: Incident Response and Management", label: "3.0 Incident Response & Management (20%)" },
      { value: "Domain 4.0: Reporting and Communication", label: "4.0 Reporting & Communication (17%)" }
    ],
    fallbackDomain: "CySA+ General Security",
    passText: "Congratulations! You met the CompTIA CySA+ passing threshold.",
    // Dashboard details
    heroBadge: "CompTIA Certified Cybersecurity Analyst",
    heroTitle: "CS0-003 Master Exam Simulator",
    heroDesc: "Fully realistic exam environment featuring 85 questions, 165-minute timed duration, Performance-Based Questions (PBQs), detailed explanations, and domain vulnerability analysis.",
    maxQuestions: "85",
    durationText: "165m",
    passingScoreText: "750 / 900",
    domainsBadgeVal: "4 Domains",
    domainsBadgeLbl: "Security Ops & Response",
    fullExamDesc: "85 randomized questions (MCQs & PBQs), strict 165-minute timer, no instant answers during exam, final score scaled 100-900.",
    fullExamBtnText: "Start Full Simulation (85 Qs)",
    fullExamDuration: 165 * 60,
    fullExamCount: 85
  },
  secai: {
    title: "SecAI+",
    code: "CY0-001",
    sub: "CompTIA Security AI Simulator",
    passingScore: 600,
    thresholdLeft: "62.5%",
    getQuestions: () => SECAI_QUESTIONS,
    domains: [
      { value: "Domain 1.0: Basic AI Concepts Related to Cybersecurity", label: "1.0 Basic AI Concepts Related to Cybersecurity (17%)" },
      { value: "Domain 2.0: Securing AI Systems", label: "2.0 Securing AI Systems (40%)" },
      { value: "Domain 3.0: AI-Assisted Security", label: "3.0 AI-Assisted Security (24%)" },
      { value: "Domain 4.0: AI Governance, Risk, and Compliance", label: "4.0 AI Governance, Risk, and Compliance (19%)" }
    ],
    fallbackDomain: "SecAI+ General Security",
    passText: "Congratulations! You met the CompTIA SecAI+ passing threshold.",
    // Dashboard details
    heroBadge: "CompTIA Certified Security AI Professional (CY0-001)",
    heroTitle: "CY0-001 Master Exam Simulator",
    heroDesc: "Fully realistic exam environment featuring maximum 60 questions, 60-minute timed duration, multiple-choice, Performance-Based Questions (PBQs), and AI security analysis.",
    maxQuestions: "Max 60",
    durationText: "60m",
    passingScoreText: "600 / 900",
    domainsBadgeVal: "4 Domains",
    domainsBadgeLbl: "AI Security & Governance",
    fullExamDesc: "60 randomized questions (MCQs & PBQs), strict 60-minute timer, no instant answers during exam, final score scaled 100-900.",
    fullExamBtnText: "Start Full Simulation (60 Qs)",
    fullExamDuration: 60 * 60,
    fullExamCount: 60
  }
};

function switchActiveExam(examKey) {
  state.activeExam = examKey;
  localStorage.setItem('active_exam_choice', examKey);

  const meta = EXAM_METADATA[examKey];
  if (!meta) return;

  // Update navbar branding
  const titleDisplay = document.getElementById('brand-title-display');
  const subDisplay = document.getElementById('brand-sub-display');
  if (titleDisplay) {
    titleDisplay.innerHTML = `${meta.title} <span class="badge-code" id="brand-code-display">${meta.code}</span>`;
  }
  if (subDisplay) {
    subDisplay.textContent = meta.sub;
  }

  // Update hero banner texts
  const heroBadge = document.getElementById('hero-badge');
  const heroTitle = document.getElementById('hero-title');
  const heroDesc = document.getElementById('hero-desc');
  if (heroBadge) heroBadge.textContent = meta.heroBadge;
  if (heroTitle) heroTitle.textContent = meta.heroTitle;
  if (heroDesc) heroDesc.textContent = meta.heroDesc;

  // Update stat boxes
  const statMaxQs = document.getElementById('stat-max-qs');
  const statDuration = document.getElementById('stat-duration');
  const statPassing = document.getElementById('stat-passing');
  const statDomainsVal = document.getElementById('stat-domains-val');
  const statDomainsLbl = document.getElementById('stat-domains-lbl');
  if (statMaxQs) statMaxQs.textContent = meta.maxQuestions;
  if (statDuration) statDuration.textContent = meta.durationText;
  if (statPassing) statPassing.textContent = meta.passingScoreText;
  if (statDomainsVal) statDomainsVal.textContent = meta.domainsBadgeVal;
  if (statDomainsLbl) statDomainsLbl.textContent = meta.domainsBadgeLbl;

  // Update Full Exam card info
  const fullExamDesc = document.getElementById('full-exam-desc');
  const fullExamBtn = document.getElementById('full-exam-btn');
  if (fullExamDesc) fullExamDesc.textContent = meta.fullExamDesc;
  if (fullExamBtn) fullExamBtn.textContent = meta.fullExamBtnText;

  // Update domain focused card description
  const descEl = document.getElementById('domain-practice-desc');
  if (descEl) {
    descEl.textContent = `Practice specific ${meta.title} domains (${meta.domains.map(d => d.value.split(':')[0].replace('Domain ', '')).join(', ')}).`;
  }

  // Populate domain select options
  const selectEl = document.getElementById('domain-select');
  if (selectEl) {
    let html = `<option value="all">All Domains</option>`;
    meta.domains.forEach(d => {
      html += `<option value="${d.value}">${d.label}</option>`;
    });
    selectEl.innerHTML = html;
  }

  // Reload history table to show relevant info
  renderHistoryTable();
}

document.addEventListener('DOMContentLoaded', () => {
  const savedExam = localStorage.getItem('active_exam_choice') || 'cysa';
  state.activeExam = savedExam;

  loadExamHistory();

  const selectDropdown = document.getElementById('active-exam-select');
  if (selectDropdown) {
    selectDropdown.value = savedExam;
  }
  switchActiveExam(savedExam);
});

// NAVIGATION SCREEN SWITCHER
function showScreen(screenId) {
  document.querySelectorAll('.screen-view').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  const targetScreen = document.getElementById(`screen-${screenId}`);
  if (targetScreen) targetScreen.classList.add('active');

  const navBtn = document.getElementById(`nav-${screenId}-btn`);
  if (navBtn) navBtn.classList.add('active');

  const statusBar = document.getElementById('exam-status-bar');
  if (screenId === 'exam') {
    // In study mode, hide the timer elements
    const timerCard = document.getElementById('timer-card');
    const pauseBtn = document.getElementById('pause-timer-btn');
    const liveScorePill = document.getElementById('live-score-pill');
    if (state.studyMode) {
      timerCard.classList.add('hidden');
      pauseBtn.classList.add('hidden');
      liveScorePill.classList.remove('hidden');
    } else {
      timerCard.classList.remove('hidden');
      pauseBtn.classList.remove('hidden');
      liveScorePill.classList.add('hidden');
    }
    statusBar.classList.remove('hidden');
  } else {
    statusBar.classList.add('hidden');
    if (state.timerInterval) clearInterval(state.timerInterval);
  }
}

// START EXAM MODE
function startExam(mode) {
  state.examMode = mode;
  state.studyMode = (mode === 'study' || mode === 'domain-study');
  state.currentIndex = 0;
  state.userAnswers = {};
  state.strikethroughs = {};
  state.flagged.clear();
  state.isPaused = false;
  state.revealedQuestions = new Set();
  state.shuffledOptions = {};
  state.liveCorrect = 0;

  const meta = EXAM_METADATA[state.activeExam];
  let baseBank = meta ? [...meta.getQuestions()] : [...CYSA_QUESTIONS];

  if (mode === 'full') {
    const qCount = meta ? meta.fullExamCount : 85;
    const duration = meta ? meta.fullExamDuration : 165 * 60;
    state.activeQuestions = generateFullQuestionBank(baseBank, qCount);
    state.timeRemaining = duration;
  } else if (mode === 'quick') {
    state.activeQuestions = shuffleArray([...baseBank]).slice(0, 20);
    state.timeRemaining = 45 * 60;
  } else if (mode === 'domain') {
    const selectedDomain = document.getElementById('domain-select').value;
    if (selectedDomain !== 'all') {
      const filtered = baseBank.filter(q => q.domain === selectedDomain);
      state.activeQuestions = generateFullQuestionBank(filtered.length ? filtered : baseBank, 20);
    } else {
      state.activeQuestions = shuffleArray([...baseBank]).slice(0, 20);
    }
    state.timeRemaining = 45 * 60;
  } else if (mode === 'pbq') {
    state.activeQuestions = baseBank.filter(q => q.type === 'pbq');
    state.timeRemaining = 30 * 60;
  } else if (mode === 'study') {
    // Study mode: all MCQ questions, randomized order, no timer
    const mcqOnly = baseBank.filter(q => q.type !== 'pbq');
    state.activeQuestions = shuffleArray(mcqOnly);
    // Pre-shuffle answer options for each question
    state.activeQuestions.forEach(q => {
      if (q.options && q.options.length) {
        const indices = q.options.map((_, i) => i);
        state.shuffledOptions[q.id] = shuffleArray(indices);
      }
    });
    state.timeRemaining = 0;
  } else if (mode === 'domain-study') {
    // Domain-focused study mode: filter by domain, MCQ only, randomized, no timer, inline reveal
    const selectedDomain = document.getElementById('domain-select').value;
    let pool = baseBank.filter(q => q.type !== 'pbq');
    if (selectedDomain !== 'all') {
      const filtered = pool.filter(q => q.domain === selectedDomain);
      pool = filtered.length ? filtered : pool;
    }
    state.activeQuestions = shuffleArray(pool);
    // Pre-shuffle answer options for each question
    state.activeQuestions.forEach(q => {
      if (q.options && q.options.length) {
        const indices = q.options.map((_, i) => i);
        state.shuffledOptions[q.id] = shuffleArray(indices);
      }
    });
    state.timeRemaining = 0;
  }

  showScreen('exam');
  renderCurrentQuestion();
  updateProgressMeter();
  if (!state.studyMode) startTimer();
}

// TIMER MANAGEMENT
function startTimer() {
  if (state.timerInterval) clearInterval(state.timerInterval);

  updateTimerDisplay();
  state.timerInterval = setInterval(() => {
    if (!state.isPaused) {
      state.timeRemaining--;
      updateTimerDisplay();

      if (state.timeRemaining <= 0) {
        clearInterval(state.timerInterval);
        alert("Time has expired! Submitting your exam automatically.");
        submitExam();
      }
    }
  }, 1000);
}

function toggleTimerPause() {
  state.isPaused = !state.isPaused;
  const btn = document.getElementById('pause-timer-btn');
  const timerCard = document.getElementById('timer-card');

  if (state.isPaused) {
    btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg> Resume`;
    timerCard.classList.add('paused');
  } else {
    btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Pause`;
    timerCard.classList.remove('paused');
  }
}

function updateTimerDisplay() {
  const display = document.getElementById('timer-display');
  if (!display) return;

  const hours = Math.floor(state.timeRemaining / 3600);
  const minutes = Math.floor((state.timeRemaining % 3600) / 60);
  const seconds = state.timeRemaining % 60;

  if (hours > 0) {
    display.textContent = `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  } else {
    display.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
}

// QUESTION RENDERER
function renderCurrentQuestion() {
  const q = state.activeQuestions[state.currentIndex];
  if (!q) return;

  // Header meta
  document.getElementById('q-number-display').textContent = `Question ${state.currentIndex + 1} of ${state.activeQuestions.length}`;
  document.getElementById('q-domain-display').textContent = q.domain || "CySA+ General Security";

  const pbqPill = document.getElementById('q-pbq-pill');
  if (q.type === 'pbq') {
    pbqPill.classList.remove('hidden');
  } else {
    pbqPill.classList.add('hidden');
  }

  // Flag state
  document.getElementById('flag-checkbox').checked = state.flagged.has(q.id);

  // Question Card Content
  const container = document.getElementById('question-card');
  container.innerHTML = '';

  if (q.type === 'pbq') {
    container.appendChild(createPBQView(q));
  } else {
    container.appendChild(createMCQView(q));
  }

  // Footer Button states
  document.getElementById('prev-btn').disabled = state.currentIndex === 0;

  const nextBtn = document.getElementById('next-btn');
  if (state.currentIndex === state.activeQuestions.length - 1) {
    nextBtn.classList.add('hidden');
  } else {
    nextBtn.classList.remove('hidden');
  }

  updateProgressMeter();
}

// CREATE MCQ VIEW (Supports Single & Multi-Select + Diagrams + Study Mode)
function createMCQView(q) {
  const wrapper = document.createElement('div');
  wrapper.className = 'mcq-wrapper';

  // Multi-select Indicator Badge
  if (q.multiSelect) {
    const multiBadge = document.createElement('div');
    multiBadge.className = 'multi-select-badge';
    multiBadge.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> MULTI-SELECT QUESTION — Choose ${q.selectCount || 2} Options`;
    wrapper.appendChild(multiBadge);
  }

  // Question Text
  const qText = document.createElement('div');
  qText.className = 'question-text';
  qText.innerHTML = formatCodeSnippets(q.question);
  wrapper.appendChild(qText);

  // Question Image / Diagram (if present)
  if (q.image) {
    const imgContainer = document.createElement('div');
    imgContainer.className = 'question-image-box';
    imgContainer.innerHTML = `
      <div class="image-header-tag">Reference Diagram / Scenario Exhibit</div>
      <img src="${q.image}" class="question-image" alt="Question Exhibit Diagram" onclick="openImageZoom('${q.image}')">
      <span class="zoom-hint">Click image to enlarge</span>
    `;
    wrapper.appendChild(imgContainer);
  }

  // Determine the option order (shuffled in study mode, natural otherwise)
  const isRevealed = state.studyMode && state.revealedQuestions.has(q.id);
  const optionIndices = (state.studyMode && state.shuffledOptions[q.id])
    ? state.shuffledOptions[q.id]
    : q.options.map((_, i) => i);

  // Build a mapping from original index -> display letter (A, B, C, D)
  // so that answer keys still match even after shuffling
  const displayLetterMap = {}; // originalIndex -> displayLetter
  const originalIndexByLetter = {}; // displayLetter -> originalIndex
  optionIndices.forEach((origIdx, displayPos) => {
    const displayLetter = String.fromCharCode(65 + displayPos);
    displayLetterMap[origIdx] = displayLetter;
    originalIndexByLetter[displayLetter] = origIdx;
  });

  // In study mode, the stored answer is by original letter (A/B/C/D of original options)
  // We need to convert when selecting
  const currentAnswer = state.userAnswers[q.id];
  const struckSet = state.strikethroughs[q.id] || new Set();

  // Correct answers as original option letters
  const correctOriginal = Array.isArray(q.answer) ? q.answer : [q.answer];

  // Options List
  const optionsList = document.createElement('div');
  optionsList.className = 'options-list';

  optionIndices.forEach((origIdx, displayPos) => {
    const displayLetter = String.fromCharCode(65 + displayPos);
    const origLetter = String.fromCharCode(65 + origIdx); // original A/B/C/D
    const optText = q.options[origIdx];

    let isSelected = false;
    if (q.multiSelect) {
      isSelected = Array.isArray(currentAnswer) && currentAnswer.includes(origLetter);
    } else {
      isSelected = currentAnswer === origLetter;
    }

    const isStruck = struckSet.has(origIdx);
    const isCorrectAnswer = correctOriginal.includes(origLetter);

    // In study mode after reveal: color-code options
    let extraClass = '';
    if (isRevealed) {
      if (isCorrectAnswer) extraClass = 'study-correct';
      else if (isSelected && !isCorrectAnswer) extraClass = 'study-wrong';
    }

    const optItem = document.createElement('div');
    optItem.className = `option-item ${isSelected ? 'selected' : ''} ${isStruck ? 'struck' : ''} ${extraClass}`;

    let controlHtml;
    if (isRevealed) {
      if (isCorrectAnswer) {
        controlHtml = `<span class="review-opt-icon correct-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span>`;
      } else if (isSelected) {
        controlHtml = `<span class="review-opt-icon wrong-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></span>`;
      } else {
        controlHtml = `<span class="review-opt-icon neutral-icon"></span>`;
      }
    } else {
      controlHtml = q.multiSelect
        ? `<span class="checkbox-indicator ${isSelected ? 'checked' : ''}">${isSelected ? '✓' : ''}</span>`
        : `<span class="radio-indicator ${isSelected ? 'checked' : ''}">${isSelected ? '●' : ''}</span>`;
    }

    optItem.innerHTML = `
      ${controlHtml}
      <span class="option-prefix">${displayLetter}.</span>
      <div class="option-content">${formatCodeSnippets(optText.replace(/^[A-F]\.\s*/, ''))}</div>
    `;

    // Disable clicking after reveal in study mode
    if (!isRevealed) {
      optItem.onclick = () => {
        if (state.strikethroughActive) {
          toggleStrikethroughOption(q.id, origIdx);
        } else {
          selectMCQAnswer(q, origLetter);
        }
      };
    } else {
      optItem.style.cursor = 'default';
    }

    optionsList.appendChild(optItem);
  });

  wrapper.appendChild(optionsList);

  // In study mode: show inline explanation after reveal
  if (isRevealed && q.explanation) {
    const expBox = document.createElement('div');
    expBox.className = 'study-inline-explanation';
    const isCorrect = checkMCQCorrect(q, currentAnswer);
    expBox.innerHTML = `
      <div class="study-result-banner ${isCorrect ? 'study-result-correct' : 'study-result-wrong'}">
        ${isCorrect
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg> Correct!`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Incorrect`
      }
      </div>
      <div class="study-explanation-body">
        <strong>Explanation:</strong> ${formatCodeSnippets(q.explanation)}
      </div>
    `;
    wrapper.appendChild(expBox);
  }

  return wrapper;
}

// CREATE PBQ VIEW
function createPBQView(q) {
  const wrapper = document.createElement('div');
  wrapper.className = 'pbq-container';

  const title = document.createElement('h2');
  title.style.fontFamily = 'var(--font-display)';
  title.style.fontSize = '1.3rem';
  title.style.marginBottom = '0.5rem';
  title.textContent = q.title;
  wrapper.appendChild(title);

  const scenario = document.createElement('div');
  scenario.className = 'pbq-scenario';
  scenario.textContent = q.scenario;
  wrapper.appendChild(scenario);

  if (q.logs && q.logs.length) {
    const logBox = document.createElement('div');
    logBox.className = 'log-terminal';
    logBox.textContent = q.logs.join('\n');
    wrapper.appendChild(logBox);
  }

  if (q.pbqType === 'order-matching') {
    wrapper.appendChild(createOrderMatchingPBQ(q));
  } else {
    wrapper.appendChild(createDropdownFieldsPBQ(q));
  }

  return wrapper;
}

function createDropdownFieldsPBQ(q) {
  const grid = document.createElement('div');
  grid.className = 'pbq-fields-grid';

  const userPbqState = state.userAnswers[q.id] || {};

  q.fields.forEach(field => {
    const group = document.createElement('div');
    group.className = 'pbq-field-group';

    const label = document.createElement('label');
    label.className = 'pbq-field-label';
    label.textContent = field.label;
    group.appendChild(label);

    const select = document.createElement('select');
    select.className = 'form-select';

    select.innerHTML = `<option value="">-- Select Response --</option>` +
      field.options.map(opt => `<option value="${opt}" ${userPbqState[field.id] === opt ? 'selected' : ''}>${opt}</option>`).join('');

    select.onchange = (e) => {
      if (!state.userAnswers[q.id]) state.userAnswers[q.id] = {};
      state.userAnswers[q.id][field.id] = e.target.value;
      updateProgressMeter();
    };

    group.appendChild(select);
    grid.appendChild(group);
  });

  return grid;
}

function createOrderMatchingPBQ(q) {
  const container = document.createElement('div');
  container.className = 'order-list';

  if (!state.userAnswers[q.id]) {
    state.userAnswers[q.id] = [...q.items];
  }

  const currentOrder = state.userAnswers[q.id];

  currentOrder.forEach((itemText, idx) => {
    const item = document.createElement('div');
    item.className = 'order-item';
    item.innerHTML = `
      <div class="order-num">${idx + 1}</div>
      <div style="flex:1;">${itemText}</div>
      <div style="display:flex; gap:0.25rem;">
        <button class="btn btn-ghost btn-sm" ${idx === 0 ? 'disabled' : ''} onclick="moveOrderItem('${q.id}', ${idx}, -1)">▲</button>
        <button class="btn btn-ghost btn-sm" ${idx === currentOrder.length - 1 ? 'disabled' : ''} onclick="moveOrderItem('${q.id}', ${idx}, 1)">▼</button>
      </div>
    `;
    container.appendChild(item);
  });

  return container;
}

function moveOrderItem(qId, fromIdx, direction) {
  const arr = state.userAnswers[qId];
  const toIdx = fromIdx + direction;
  if (toIdx < 0 || toIdx >= arr.length) return;

  const temp = arr[fromIdx];
  arr[fromIdx] = arr[toIdx];
  arr[toIdx] = temp;

  renderCurrentQuestion();
}

// SELECTION HANDLERS (Handles Single & Multi-Select)
function selectMCQAnswer(q, origLetter) {
  if (q.multiSelect) {
    let current = state.userAnswers[q.id];
    if (!Array.isArray(current)) {
      current = [];
    }

    if (current.includes(origLetter)) {
      current = current.filter(l => l !== origLetter);
    } else {
      if (current.length < (q.selectCount || 2)) {
        current.push(origLetter);
      } else {
        // Replace earliest selection if limit reached
        current.shift();
        current.push(origLetter);
      }
    }

    if (current.length === 0) {
      delete state.userAnswers[q.id];
    } else {
      state.userAnswers[q.id] = current;
    }

    // In study mode, auto-reveal once required count is reached
    if (state.studyMode && Array.isArray(state.userAnswers[q.id]) && state.userAnswers[q.id].length === (q.selectCount || 2)) {
      if (!state.revealedQuestions.has(q.id)) {
        state.revealedQuestions.add(q.id);
        if (checkMCQCorrect(q, state.userAnswers[q.id])) state.liveCorrect++;
        updateProgressMeter();
      }
    }
  } else {
    state.userAnswers[q.id] = origLetter;
    // In study mode, immediately reveal the answer
    if (state.studyMode && !state.revealedQuestions.has(q.id)) {
      state.revealedQuestions.add(q.id);
      if (checkMCQCorrect(q, origLetter)) state.liveCorrect++;
      updateProgressMeter();
    }
  }

  renderCurrentQuestion();
}

function clearCurrentAnswer() {
  const q = state.activeQuestions[state.currentIndex];
  if (!q) return;
  delete state.userAnswers[q.id];
  renderCurrentQuestion();
}

function toggleStrikethroughOption(qId, index) {
  if (!state.strikethroughs[qId]) {
    state.strikethroughs[qId] = new Set();
  }
  const set = state.strikethroughs[qId];
  if (set.has(index)) set.delete(index);
  else set.add(index);

  renderCurrentQuestion();
}

function toggleStrikethroughMode() {
  state.strikethroughActive = !state.strikethroughActive;
  const btn = document.getElementById('strikethrough-toggle-btn');
  if (state.strikethroughActive) {
    btn.style.color = 'var(--warning)';
    btn.style.borderColor = 'var(--warning)';
  } else {
    btn.style.color = '';
    btn.style.borderColor = '';
  }
}

function toggleFlagQuestion() {
  const q = state.activeQuestions[state.currentIndex];
  if (!q) return;

  if (state.flagged.has(q.id)) {
    state.flagged.delete(q.id);
  } else {
    state.flagged.add(q.id);
  }
}

function navigateQuestion(delta) {
  const nextIdx = state.currentIndex + delta;
  if (nextIdx >= 0 && nextIdx < state.activeQuestions.length) {
    state.currentIndex = nextIdx;
    renderCurrentQuestion();
  }
}

function updateProgressMeter() {
  const count = Object.keys(state.userAnswers).length;
  const total = state.activeQuestions.length;
  if (state.studyMode) {
    const answered = state.revealedQuestions.size;
    document.getElementById('answered-counter').textContent = `${answered}/${total}`;
    // Update live score display
    const liveScoreEl = document.getElementById('live-score-display');
    if (liveScoreEl) {
      liveScoreEl.textContent = `✓ ${state.liveCorrect} / ${answered} Correct`;
    }
  } else {
    document.getElementById('answered-counter').textContent = `${count}/${total}`;
  }
}

// GRID MODAL
function openGridModal() {
  const grid = document.getElementById('question-grid-container');
  grid.innerHTML = '';

  state.activeQuestions.forEach((q, idx) => {
    const isAnswered = state.userAnswers[q.id] !== undefined;
    const isFlagged = state.flagged.has(q.id);
    const isActive = idx === state.currentIndex;

    const btn = document.createElement('button');
    btn.className = `grid-q-btn ${isAnswered ? 'answered' : ''} ${isFlagged ? 'flagged' : ''} ${isActive ? 'active' : ''}`;
    btn.textContent = idx + 1;
    btn.onclick = () => {
      state.currentIndex = idx;
      renderCurrentQuestion();
      closeGridModal();
    };

    grid.appendChild(btn);
  });

  document.getElementById('grid-modal').classList.remove('hidden');
}

function closeGridModal() {
  document.getElementById('grid-modal').classList.add('hidden');
}

// SUBMIT EXAM & CALC SCORE (Evaluates Single & Multi-Select correctly)
function confirmSubmitExam() {
  const answeredCount = Object.keys(state.userAnswers).length;
  const totalCount = state.activeQuestions.length;

  if (answeredCount < totalCount) {
    const confirm = window.confirm(`You have answered ${answeredCount} of ${totalCount} questions. Are you sure you want to finish and submit?`);
    if (!confirm) return;
  }
  submitExam();
}

function checkMCQCorrect(q, userAns) {
  if (!userAns) return false;
  if (q.multiSelect) {
    if (!Array.isArray(userAns)) return false;
    const correctArr = Array.isArray(q.answer) ? q.answer : [q.answer];
    const uSorted = [...userAns].sort().join(',');
    const cSorted = [...correctArr].sort().join(',');
    return uSorted === cSorted;
  } else {
    const correctStr = Array.isArray(q.answer) ? q.answer[0] : q.answer;
    return userAns === correctStr;
  }
}

function submitExam() {
  if (state.timerInterval) clearInterval(state.timerInterval);

  let correctCount = 0;
  const domainScores = {};

  state.activeQuestions.forEach(q => {
    if (!domainScores[q.domain]) {
      domainScores[q.domain] = { correct: 0, total: 0 };
    }
    domainScores[q.domain].total++;

    let isCorrect = false;

    if (q.type === 'pbq') {
      if (q.pbqType === 'order-matching') {
        const userOrder = state.userAnswers[q.id] || [];
        isCorrect = JSON.stringify(userOrder) === JSON.stringify(q.correctOrder);
      } else {
        const userFields = state.userAnswers[q.id] || {};
        isCorrect = q.fields.every(f => userFields[f.id] === f.correct);
      }
    } else {
      isCorrect = checkMCQCorrect(q, state.userAnswers[q.id]);
    }

    if (isCorrect) {
      correctCount++;
      domainScores[q.domain].correct++;
    }
  });

  const totalQs = state.activeQuestions.length;
  const rawPercentage = (correctCount / totalQs) * 100;
  const scaledScore = Math.round(100 + (rawPercentage / 100) * 800);
  const meta = EXAM_METADATA[state.activeExam];
  const passingScore = meta ? meta.passingScore : 750;
  const isPass = scaledScore >= passingScore;

  const historyEntry = {
    date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    exam: state.activeExam,
    mode: state.examMode,
    score: scaledScore,
    percentage: Math.round(rawPercentage),
    isPass: isPass
  };
  state.examHistory.unshift(historyEntry);
  saveExamHistory();
  renderHistoryTable();

  renderResultsScreen(scaledScore, isPass, domainScores, correctCount, totalQs);
  showScreen('results');
}

function renderResultsScreen(score, isPass, domainScores, correctCount, totalQs) {
  const headerBanner = document.getElementById('results-header-banner');
  headerBanner.className = `results-header ${isPass ? 'pass' : 'fail'}`;

  const meta = EXAM_METADATA[state.activeExam];
  const passText = meta ? meta.passText : "Congratulations!";

  headerBanner.innerHTML = `
    <div class="results-icon">${isPass ? '✓' : '✕'}</div>
    <div>
      <h1 style="font-family:var(--font-display); font-size:1.8rem;">${isPass ? 'Exam Passed!' : 'Exam Needs Improvement'}</h1>
      <p style="color:var(--text-muted);">${isPass ? passText : 'Keep practicing! Review your weak domains below before your real exam.'}</p>
    </div>
  `;

  // Update threshold marker
  const marker = document.querySelector('.threshold-marker');
  if (marker && meta) {
    marker.style.left = meta.thresholdLeft;
    marker.title = `Passing threshold: ${meta.passingScore}`;
    const span = marker.querySelector('span');
    if (span) span.textContent = `Passing (${meta.passingScore})`;
  }

  // Update final score text paragraph
  const summaryTextEl = document.getElementById('score-summary-text');
  if (summaryTextEl && meta) {
    summaryTextEl.textContent = isPass
      ? `Congratulations! You passed the ${meta.title} (${meta.code}) practice exam.`
      : `You did not meet the passing score of ${meta.passingScore} for the ${meta.title} (${meta.code}) exam. Review the recommendations below to improve your score.`;
  }

  document.getElementById('final-scaled-score').textContent = score;

  const scorePercent = Math.min(100, Math.max(0, ((score - 100) / 800) * 100));
  document.getElementById('score-progress-fill').style.width = `${scorePercent}%`;

  const domainContainer = document.getElementById('domain-bars-container');
  domainContainer.innerHTML = '';

  const weakDomains = [];

  Object.keys(domainScores).forEach(dom => {
    const data = domainScores[dom];
    const pct = Math.round((data.correct / data.total) * 100);
    if (pct < 75) weakDomains.push({ domain: dom, pct });

    const item = document.createElement('div');
    item.className = 'domain-bar-item';
    item.innerHTML = `
      <div class="domain-bar-label">
        <span>${dom}</span>
        <span style="font-weight:700; color:${pct >= 75 ? 'var(--success)' : 'var(--warning)'}">${data.correct}/${data.total} (${pct}%)</span>
      </div>
      <div class="domain-progress-track">
        <div class="domain-progress-fill" style="width:${pct}%; background:${pct >= 75 ? 'var(--success)' : 'var(--warning)'};"></div>
      </div>
    `;
    domainContainer.appendChild(item);
  });

  const recContainer = document.getElementById('recommendations-container');
  if (weakDomains.length > 0) {
    recContainer.innerHTML = `
      <h3 style="color:var(--warning); margin-bottom:0.5rem;">Targeted Weakness Recommendations</h3>
      <p style="color:var(--text-muted); font-size:0.9rem;">Focus your studying on these lower-scoring areas:</p>
      <ul style="margin-top:0.5rem; padding-left:1.2rem; color:var(--text-main); font-size:0.9rem;">
        ${weakDomains.map(d => `<li><strong>${d.domain}</strong> (Mastery: ${d.pct}%) - Review logs, threat Intel feeds, and mitigation playbooks for this domain.</li>`).join('')}
      </ul>
    `;
  } else {
    recContainer.innerHTML = `
      <h3 style="color:var(--success); margin-bottom:0.5rem;">All Domains Satisfactory</h3>
      <p style="color:var(--text-muted); font-size:0.9rem;">Great performance across all tested domains!</p>
    `;
  }

  renderReviewList('all');
}

// REVIEW LIST FILTER
function filterReview(filterType, element) {
  if (element) {
    document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
    element.classList.add('active');
  }
  renderReviewList(filterType);
}

function renderReviewList(filterType) {
  const container = document.getElementById('review-list-container');
  container.innerHTML = '';

  state.activeQuestions.forEach((q, idx) => {
    let isCorrect = false;
    if (q.type === 'pbq') {
      if (q.pbqType === 'order-matching') {
        const userOrder = state.userAnswers[q.id] || [];
        isCorrect = JSON.stringify(userOrder) === JSON.stringify(q.correctOrder);
      } else {
        const userFields = state.userAnswers[q.id] || {};
        isCorrect = q.fields.every(f => userFields[f.id] === f.correct);
      }
    } else {
      isCorrect = checkMCQCorrect(q, state.userAnswers[q.id]);
    }

    const isFlagged = state.flagged.has(q.id);

    if (filterType === 'incorrect' && isCorrect) return;
    if (filterType === 'flagged' && !isFlagged) return;
    if (filterType === 'pbq' && q.type !== 'pbq') return;

    const item = document.createElement('div');
    item.className = `review-item ${isCorrect ? 'correct' : 'incorrect'}`;

    // Build options HTML for MCQ questions
    let optionsHtml = '';
    if (q.type !== 'pbq') {
      const userRaw = state.userAnswers[q.id];
      const userSelected = Array.isArray(userRaw) ? userRaw : (userRaw ? [userRaw] : []);
      const correctAnswers = Array.isArray(q.answer) ? q.answer : [q.answer];

      optionsHtml = '<div class="review-options-list">';
      (q.options || []).forEach((optText, index) => {
        const optLetter = String.fromCharCode(65 + index);
        const isUserSelected = userSelected.includes(optLetter);
        const isCorrectAnswer = correctAnswers.includes(optLetter);
        const cleanText = optText.replace(/^[A-F]\.\s*/, '');

        let optClass = 'review-opt';
        let iconHtml = '';

        if (isCorrectAnswer) {
          optClass += ' review-opt-correct';
          iconHtml = `<span class="review-opt-icon correct-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </span>`;
        } else if (isUserSelected && !isCorrectAnswer) {
          optClass += ' review-opt-wrong';
          iconHtml = `<span class="review-opt-icon wrong-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </span>`;
        } else {
          iconHtml = `<span class="review-opt-icon neutral-icon"></span>`;
        }

        optionsHtml += `
          <div class="${optClass}">
            ${iconHtml}
            <span class="review-opt-letter">${optLetter}.</span>
            <span class="review-opt-text">${formatCodeSnippets(cleanText)}</span>
          </div>
        `;
      });
      optionsHtml += '</div>';
    }

    // PBQ answer summary
    let pbqSummaryHtml = '';
    if (q.type === 'pbq') {
      pbqSummaryHtml = `<p style="margin-bottom:0.75rem;"><strong>PBQ Status:</strong> ${isCorrect ? '<span style="color:var(--success)">Correct Solution</span>' : '<span style="color:var(--danger)">Incorrect Configuration</span>'}</p>`;
    }

    let imageHtml = '';
    if (q.image) {
      imageHtml = `
        <div class="review-image-box">
          <img src="${q.image}" class="question-image" alt="Question Diagram">
        </div>
      `;
    }

    item.innerHTML = `
      <div class="review-item-header">
        <span class="review-q-label">Q${idx + 1}. ${q.domain}</span>
        <span class="review-verdict ${isCorrect ? 'verdict-correct' : 'verdict-incorrect'}">
          ${isCorrect
        ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg> CORRECT (+1)`
        : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> INCORRECT (0)`
      }
        </span>
      </div>
      <p class="review-question-text">${formatCodeSnippets(q.question || q.scenario)}</p>
      ${imageHtml}
      ${pbqSummaryHtml}
      ${optionsHtml}
      <div class="review-explanation">
        <strong>Explanation:</strong> ${formatCodeSnippets(q.explanation)}
      </div>
    `;

    container.appendChild(item);
  });
}

// STORAGE & HISTORY
function loadExamHistory() {
  const saved = localStorage.getItem('cysa_exam_history');
  if (saved) {
    try { state.examHistory = JSON.parse(saved); } catch (e) { }
  }
}

function saveExamHistory() {
  localStorage.setItem('cysa_exam_history', JSON.stringify(state.examHistory));
}

function renderHistoryTable() {
  const container = document.getElementById('history-container');
  if (!container) return;

  if (state.examHistory.length === 0) {
    container.innerHTML = `<p class="text-muted">No exam attempts recorded yet. Click <strong>Start Full Simulation</strong> to begin your practice test!</p>`;
    return;
  }

  let html = `
    <table style="width:100%; border-collapse:collapse; font-size:0.9rem;">
      <thead>
        <tr style="border-bottom:1px solid var(--border-color); text-align:left; color:var(--text-muted);">
          <th style="padding:0.75rem;">Date & Time</th>
          <th style="padding:0.75rem;">Exam</th>
          <th style="padding:0.75rem;">Exam Mode</th>
          <th style="padding:0.75rem;">Scaled Score</th>
          <th style="padding:0.75rem;">Accuracy</th>
          <th style="padding:0.75rem;">Result</th>
        </tr>
      </thead>
      <tbody>
  `;

  state.examHistory.slice(0, 5).forEach(h => {
    const examCode = h.exam ? h.exam.toUpperCase() : 'CYSA';
    html += `
      <tr style="border-bottom:1px solid var(--border-color);">
        <td style="padding:0.75rem;">${h.date}</td>
        <td style="padding:0.75rem; font-weight:700; color:var(--text-muted);">${examCode}</td>
        <td style="padding:0.75rem; text-transform:capitalize;">${h.mode}</td>
        <td style="padding:0.75rem; font-weight:700; font-family:var(--font-display);">${h.score} / 900</td>
        <td style="padding:0.75rem;">${h.percentage}%</td>
        <td style="padding:0.75rem;"><span style="color:${h.isPass ? 'var(--success)' : 'var(--danger)'}; font-weight:700;">${h.isPass ? 'PASS' : 'FAIL'}</span></td>
      </tr>
    `;
  });

  html += `</tbody></table>`;
  container.innerHTML = html;
}

// SCRAPER & IMPORTER MODAL
function openScraperModal() {
  document.getElementById('scraper-modal').classList.remove('hidden');
}

function closeScraperModal() {
  document.getElementById('scraper-modal').classList.add('hidden');
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const parsed = JSON.parse(e.target.result);
      importQuestionsData(parsed);
    } catch (err) {
      alert("Invalid JSON file format. Please check your scraper output.");
    }
  };
  reader.readAsText(file);
}

function importPastedJson() {
  const text = document.getElementById('json-paste-input').value.trim();
  if (!text) {
    alert("Please paste valid JSON questions data.");
    return;
  }
  try {
    const parsed = JSON.parse(text);
    importQuestionsData(parsed);
  } catch (err) {
    alert("Error parsing JSON syntax. Make sure it is valid JSON.");
  }
}

function importQuestionsData(data) {
  if (Array.isArray(data) && data.length > 0) {
    CYSA_QUESTIONS.unshift(...data);
    alert(`Successfully imported ${data.length} custom questions into your CySA+ question bank!`);
    closeScraperModal();
  } else {
    alert("Imported JSON must be a non-empty array of question objects.");
  }
}

// IMAGE ZOOM MODAL
function openImageZoom(imgSrc) {
  let modal = document.getElementById('image-zoom-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'image-zoom-modal';
    modal.className = 'modal-overlay';
    modal.onclick = () => modal.classList.add('hidden');
    modal.innerHTML = `
      <div style="position:relative; max-width:90vw; max-height:90vh;">
        <img id="zoom-img-target" src="" style="max-width:100%; max-height:85vh; border-radius:12px; border:2px solid var(--primary); box-shadow:0 0 30px rgba(0,0,0,0.8);">
      </div>
    `;
    document.body.appendChild(modal);
  }
  document.getElementById('zoom-img-target').src = imgSrc;
  modal.classList.remove('hidden');
}

// HELPER UTILITIES
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function formatCodeSnippets(str) {
  if (!str) return '';
  return str.replace(/`([^`]+)`/g, '<code class="font-mono" style="background:rgba(255,255,255,0.08); padding:0.15rem 0.4rem; border-radius:4px; font-size:0.85em; color:var(--primary);">$1</code>');
}
