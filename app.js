// CompTIA CySA+ (CS0-003) Application Engine - Multi-select & Diagram Support

let state = {
  activeQuestions: [],
  currentIndex: 0,
  userAnswers: {},       // questionId -> answer string/array or PBQ object
  strikethroughs: {},    // questionId -> Set of struck indices
  flagged: new Set(),
  examMode: 'full',      // 'full', 'quick', 'domain', 'pbq'
  timeRemaining: 165 * 60, // 165 minutes in seconds
  timerInterval: null,
  isPaused: false,
  strikethroughActive: false,
  examHistory: []
};

document.addEventListener('DOMContentLoaded', () => {
  loadExamHistory();
  renderHistoryTable();
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
    statusBar.classList.remove('hidden');
  } else {
    statusBar.classList.add('hidden');
    if (state.timerInterval) clearInterval(state.timerInterval);
  }
}

// START EXAM MODE
function startExam(mode) {
  state.examMode = mode;
  state.currentIndex = 0;
  state.userAnswers = {};
  state.strikethroughs = {};
  state.flagged.clear();
  state.isPaused = false;

  let baseBank = [...CYSA_QUESTIONS];

  if (mode === 'full') {
    state.activeQuestions = generateFullQuestionBank(baseBank, 85);
    state.timeRemaining = 165 * 60; // 165 minutes
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
  }

  showScreen('exam');
  renderCurrentQuestion();
  updateProgressMeter();
  startTimer();
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

// CREATE MCQ VIEW (Supports Single & Multi-Select + Diagrams)
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

  // Options List
  const optionsList = document.createElement('div');
  optionsList.className = 'options-list';

  const currentAnswer = state.userAnswers[q.id];
  const struckSet = state.strikethroughs[q.id] || new Set();

  q.options.forEach((optText, index) => {
    const optLetter = String.fromCharCode(65 + index); // A, B, C, D...
    
    let isSelected = false;
    if (q.multiSelect) {
      isSelected = Array.isArray(currentAnswer) && currentAnswer.includes(optLetter);
    } else {
      isSelected = currentAnswer === optLetter;
    }

    const isStruck = struckSet.has(index);

    const optItem = document.createElement('div');
    optItem.className = `option-item ${isSelected ? 'selected' : ''} ${isStruck ? 'struck' : ''}`;
    
    const controlIcon = q.multiSelect
      ? `<span class="checkbox-indicator ${isSelected ? 'checked' : ''}">${isSelected ? '✓' : ''}</span>`
      : `<span class="radio-indicator ${isSelected ? 'checked' : ''}">${isSelected ? '●' : ''}</span>`;

    optItem.innerHTML = `
      ${controlIcon}
      <span class="option-prefix">${optLetter}.</span>
      <div class="option-content">${formatCodeSnippets(optText.replace(/^[A-F]\.\s*/, ''))}</div>
    `;

    optItem.onclick = () => {
      if (state.strikethroughActive) {
        toggleStrikethroughOption(q.id, index);
      } else {
        selectMCQAnswer(q, optLetter);
      }
    };

    optionsList.appendChild(optItem);
  });

  wrapper.appendChild(optionsList);
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
function selectMCQAnswer(q, optLetter) {
  if (q.multiSelect) {
    let current = state.userAnswers[q.id];
    if (!Array.isArray(current)) {
      current = [];
    }
    
    if (current.includes(optLetter)) {
      current = current.filter(l => l !== optLetter);
    } else {
      if (current.length < (q.selectCount || 2)) {
        current.push(optLetter);
      } else {
        // Replaced earliest selection if limit reached
        current.shift();
        current.push(optLetter);
      }
    }

    if (current.length === 0) {
      delete state.userAnswers[q.id];
    } else {
      state.userAnswers[q.id] = current;
    }
  } else {
    state.userAnswers[q.id] = optLetter;
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
  document.getElementById('answered-counter').textContent = `${count}/${state.activeQuestions.length}`;
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
  const isPass = scaledScore >= 750;

  const historyEntry = {
    date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
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
  
  headerBanner.innerHTML = `
    <div class="results-icon">${isPass ? '✓' : '✕'}</div>
    <div>
      <h1 style="font-family:var(--font-display); font-size:1.8rem;">${isPass ? 'Exam Passed!' : 'Exam Needs Improvement'}</h1>
      <p style="color:var(--text-muted);">${isPass ? 'Congratulations! You met the CompTIA CySA+ passing threshold.' : 'Keep practicing! Review your weak domains below before your real exam.'}</p>
    </div>
  `;

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

    let answerSummaryHtml = '';
    if (q.type === 'pbq') {
      answerSummaryHtml = `<p><strong>PBQ Status:</strong> ${isCorrect ? '<span style="color:var(--success)">Correct Solution</span>' : '<span style="color:var(--danger)">Incorrect Configuration</span>'}</p>`;
    } else {
      const userRaw = state.userAnswers[q.id];
      let userStr = 'None Selected';
      if (Array.isArray(userRaw)) userStr = userRaw.sort().join(', ');
      else if (userRaw) userStr = userRaw;

      const correctRaw = q.answer;
      let correctStr = Array.isArray(correctRaw) ? correctRaw.sort().join(', ') : correctRaw;

      answerSummaryHtml = `
        <p><strong>Your Selection:</strong> ${userStr} | <strong>Correct Answer:</strong> <span style="color:var(--success); font-weight:700;">${correctStr}</span></p>
      `;
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
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
        <span style="font-weight:700; font-size:0.95rem;">Q${idx + 1}. ${q.domain}</span>
        <span style="font-weight:700; font-size:0.85rem; color:${isCorrect ? 'var(--success)' : 'var(--danger)'}">${isCorrect ? 'CORRECT (+1)' : 'INCORRECT (0)'}</span>
      </div>
      <p style="margin-bottom:0.75rem;">${formatCodeSnippets(q.question || q.scenario)}</p>
      ${imageHtml}
      ${answerSummaryHtml}
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
    try { state.examHistory = JSON.parse(saved); } catch (e) {}
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
          <th style="padding:0.75rem;">Exam Mode</th>
          <th style="padding:0.75rem;">Scaled Score</th>
          <th style="padding:0.75rem;">Accuracy</th>
          <th style="padding:0.75rem;">Result</th>
        </tr>
      </thead>
      <tbody>
  `;

  state.examHistory.slice(0, 5).forEach(h => {
    html += `
      <tr style="border-bottom:1px solid var(--border-color);">
        <td style="padding:0.75rem;">${h.date}</td>
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
  reader.onload = function(e) {
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
