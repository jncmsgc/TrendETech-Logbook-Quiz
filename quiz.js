// Tayo Quiz Engine
document.addEventListener('DOMContentLoaded', () => {

    // --- State ---
    let userName = '';
    let userDept = '';
    let filteredQuestions = [];
    let userAnswers = {};

    // --- DOM Refs ---
    const welcomeScreen = document.getElementById('welcome-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const resultsScreen = document.getElementById('results-screen');
    const nameInput = document.getElementById('quiz-name');
    const deptSelect = document.getElementById('quiz-dept');
    const btnStart = document.getElementById('btn-start');
    const questionsContainer = document.getElementById('questions-container');
    const progressText = document.getElementById('progress-text');
    const progressPct = document.getElementById('progress-pct');
    const progressFill = document.getElementById('progress-fill');
    const btnSubmit = document.getElementById('btn-submit');
    const confirmModal = document.getElementById('confirm-modal');
    const modalUnanswered = document.getElementById('modal-unanswered');
    const btnCancelSubmit = document.getElementById('btn-cancel-submit');
    const btnConfirmSubmit = document.getElementById('btn-confirm-submit');
    const qCountInfo = document.getElementById('question-count-info');
    const qCount = document.getElementById('q-count');

    // --- Users Data ---
    const usersByDept = {
        tech: ['Ian', 'Ravzel', 'Ledj', 'Jimpul'],
        ops: ['Tracie', 'Richmond', 'Aaron'],
        sales: ['Lhanica', 'Antoneth', 'Lenard', 'Samantha']
    };

    // --- Welcome Logic ---
    function checkStartEnabled() {
        const hasName = nameInput.value !== '';
        const hasDept = deptSelect.value !== '';
        btnStart.disabled = !(hasName && hasDept);
    }

    nameInput.addEventListener('change', checkStartEnabled);
    deptSelect.addEventListener('change', () => {
        const selectedDept = deptSelect.value;
        
        // Populate names
        nameInput.innerHTML = '<option value="" disabled selected>Select your name</option>';
        if (selectedDept && usersByDept[selectedDept]) {
            usersByDept[selectedDept].forEach(name => {
                const opt = document.createElement('option');
                opt.value = name;
                opt.textContent = name;
                nameInput.appendChild(opt);
            });
            nameInput.disabled = false;
        } else {
            nameInput.disabled = true;
            nameInput.innerHTML = '<option value="" disabled selected>Select department first</option>';
        }

        checkStartEnabled();

        if (selectedDept) {
            const count = QUESTIONS.filter(q => q.depts.includes(selectedDept)).length;
            qCount.textContent = count;
            qCountInfo.style.display = 'block';
        } else {
            qCountInfo.style.display = 'none';
        }
    });

    btnStart.addEventListener('click', startQuiz);

    function startQuiz() {
        userName = nameInput.value;
        userDept = deptSelect.value;
        filteredQuestions = QUESTIONS.filter(q => q.depts.includes(userDept));
        userAnswers = {};

        welcomeScreen.classList.add('hidden');
        quizScreen.classList.remove('hidden');

        renderQuestions();
        updateProgress();
    }

    // --- Render Questions ---
    function renderQuestions() {
        questionsContainer.innerHTML = '';
        let currentSection = '';

        filteredQuestions.forEach((q, idx) => {
            // Section header
            if (q.section !== currentSection) {
                currentSection = q.section;
                const secDef = SECTIONS.find(s => s.key === currentSection);
                const header = document.createElement('div');
                header.className = 'section-header';
                header.innerHTML = `
                    <div class="icon-wrap icon-${secDef.color}">${secDef.icon}</div>
                    <h2>${currentSection}</h2>
                    <span class="section-badge">${filteredQuestions.filter(fq => fq.section === currentSection).length} items</span>
                `;
                questionsContainer.appendChild(header);
            }

            const card = document.createElement('div');
            card.className = 'question-card';
            card.id = `q-${q.id}`;

            let content = `<div class="question-number">${idx + 1}</div>`;

            // Scenario box for case questions
            if (q.type === 'case' && q.scenario) {
                content += `<div class="scenario-box">${q.scenario}</div>`;
            }

            // Question text
            if (q.type === 'fitb') {
                const parts = q.text.split('_____');
                let displayText = '';
                parts.forEach((part, i) => {
                    displayText += part;
                    if (i < parts.length - 1) {
                        displayText += `<span class="blank">&nbsp;</span>`;
                    }
                });
                content += `<div class="question-text">${displayText}</div>`;
            } else {
                content += `<div class="question-text">${q.text}</div>`;
            }

            // Input area based on type
            if (q.type === 'mc' || q.type === 'case') {
                content += renderMCOptions(q);
            } else if (q.type === 'tf') {
                content += renderTFOptions(q);
            } else if (q.type === 'fitb') {
                content += renderFITB(q);
            } else if (q.type === 'enum') {
                content += renderEnum(q);
            } else if (q.type === 'id') {
                content += renderID(q);
            }

            card.innerHTML = content;
            questionsContainer.appendChild(card);
        });

        // Attach event listeners
        attachListeners();
    }

    function renderMCOptions(q) {
        const letters = ['A', 'B', 'C', 'D'];
        let html = '<div class="options-list">';
        q.options.forEach((opt, i) => {
            html += `
                <label class="option-item" data-qid="${q.id}" data-val="${i}">
                    <input type="radio" name="q${q.id}" value="${i}">
                    <div class="option-radio"></div>
                    <span class="option-label">${letters[i]}) ${opt}</span>
                </label>`;
        });
        html += '</div>';
        return html;
    }

    function renderTFOptions(q) {
        return `
            <div class="tf-options">
                <button class="tf-btn" data-qid="${q.id}" data-val="true">True</button>
                <button class="tf-btn" data-qid="${q.id}" data-val="false">False</button>
            </div>`;
    }

    function renderFITB(q) {
        return `
            <div style="margin-top: 4px;">
                <input type="text" class="blank-input" data-qid="${q.id}" placeholder="Type your answer..." autocomplete="off">
            </div>`;
    }

    function renderEnum(q) {
        let html = '<div class="enum-inputs">';
        for (let i = 0; i < q.count; i++) {
            html += `
                <div class="enum-row">
                    <span class="enum-num">${i + 1}</span>
                    <input type="text" class="blank-input" data-qid="${q.id}" data-idx="${i}" placeholder="Item ${i + 1}..." autocomplete="off">
                </div>`;
        }
        html += '</div>';
        return html;
    }

    function renderID(q) {
        return `
            <div style="margin-top: 4px;">
                <input type="text" class="blank-input" data-qid="${q.id}" placeholder="Type your answer..." autocomplete="off">
            </div>`;
    }

    // --- Event Listeners ---
    function attachListeners() {
        // MC / Case options
        document.querySelectorAll('.option-item').forEach(item => {
            item.addEventListener('click', () => {
                const qid = parseInt(item.dataset.qid);
                const val = parseInt(item.dataset.val);
                // Deselect siblings
                document.querySelectorAll(`.option-item[data-qid="${qid}"]`).forEach(o => o.classList.remove('selected'));
                item.classList.add('selected');
                item.querySelector('input').checked = true;
                userAnswers[qid] = val;
                updateProgress();
            });
        });

        // True/False
        document.querySelectorAll('.tf-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const qid = parseInt(btn.dataset.qid);
                const val = btn.dataset.val === 'true';
                // Deselect siblings
                document.querySelectorAll(`.tf-btn[data-qid="${qid}"]`).forEach(b => {
                    b.classList.remove('selected-true', 'selected-false');
                });
                btn.classList.add(val ? 'selected-true' : 'selected-false');
                userAnswers[qid] = val;
                updateProgress();
            });
        });

        // Fill in the blank (single)
        document.querySelectorAll('.blank-input:not([data-idx])').forEach(input => {
            input.addEventListener('input', () => {
                const qid = parseInt(input.dataset.qid);
                userAnswers[qid] = input.value.trim();
                updateProgress();
            });
        });

        // Enumeration inputs
        document.querySelectorAll('.blank-input[data-idx]').forEach(input => {
            input.addEventListener('input', () => {
                const qid = parseInt(input.dataset.qid);
                if (!userAnswers[qid]) userAnswers[qid] = [];
                const idx = parseInt(input.dataset.idx);
                userAnswers[qid][idx] = input.value.trim();
                updateProgress();
            });
        });
    }

    // --- Progress ---
    function updateProgress() {
        let answered = 0;
        filteredQuestions.forEach(q => {
            if (q.type === 'enum') {
                const ans = userAnswers[q.id];
                if (ans && ans.some(a => a && a.length > 0)) answered++;
            } else if (userAnswers[q.id] !== undefined && userAnswers[q.id] !== '') {
                answered++;
            }
        });

        const total = filteredQuestions.length;
        const pct = Math.round((answered / total) * 100);
        progressText.textContent = `${answered} of ${total} answered`;
        progressPct.textContent = `${pct}%`;
        progressFill.style.width = `${pct}%`;
    }

    // --- Submit ---
    btnSubmit.addEventListener('click', () => {
        // Count unanswered
        let unanswered = 0;
        filteredQuestions.forEach(q => {
            if (q.type === 'enum') {
                const ans = userAnswers[q.id];
                if (!ans || !ans.some(a => a && a.length > 0)) unanswered++;
            } else if (userAnswers[q.id] === undefined || userAnswers[q.id] === '') {
                unanswered++;
            }
        });

        if (unanswered > 0) {
            modalUnanswered.textContent = `You have ${unanswered} unanswered question${unanswered > 1 ? 's' : ''}. Submit anyway?`;
        } else {
            modalUnanswered.textContent = 'All questions answered. Ready to submit?';
        }
        confirmModal.classList.add('active');
    });

    btnCancelSubmit.addEventListener('click', () => confirmModal.classList.remove('active'));

    btnConfirmSubmit.addEventListener('click', () => {
        confirmModal.classList.remove('active');
        calculateAndShowResults();
    });

    // --- Scoring ---
    function checkAnswer(q) {
        const userAns = userAnswers[q.id];

        if (q.type === 'mc' || q.type === 'case') {
            return userAns === q.answer;
        }

        if (q.type === 'tf') {
            return userAns === q.answer;
        }

        if (q.type === 'fitb' || q.type === 'id') {
            if (!userAns) return false;
            const normalized = userAns.toLowerCase().trim();
            return q.answer.some(a => a.toLowerCase() === normalized);
        }

        if (q.type === 'enum') {
            if (!userAns) return false;
            const userItems = userAns.map(a => (a || '').toLowerCase().trim()).filter(a => a.length > 0);
            const correctItems = q.answer.map(a => a.toLowerCase());

            if (q.ordered) {
                // Must be in exact order
                let allCorrect = true;
                for (let i = 0; i < correctItems.length; i++) {
                    if (!userItems[i] || userItems[i] !== correctItems[i]) {
                        allCorrect = false;
                        break;
                    }
                }
                return allCorrect;
            } else {
                // Order doesn't matter, count matches
                let matches = 0;
                const remaining = [...correctItems];
                userItems.forEach(item => {
                    const idx = remaining.indexOf(item);
                    if (idx !== -1) {
                        matches++;
                        remaining.splice(idx, 1);
                    }
                });
                return matches === correctItems.length;
            }
        }

        return false;
    }

    function getCorrectAnswerDisplay(q) {
        if (q.type === 'mc' || q.type === 'case') {
            const letters = ['A', 'B', 'C', 'D'];
            return `${letters[q.answer]}) ${q.options[q.answer]}`;
        }
        if (q.type === 'tf') return q.answer ? 'True' : 'False';
        if (q.type === 'fitb' || q.type === 'id') return q.answer[0];
        if (q.type === 'enum') return q.answer.join(', ');
        return '';
    }

    function getUserAnswerDisplay(q) {
        const ans = userAnswers[q.id];
        if (ans === undefined || ans === '' || ans === null) return '(No answer)';

        if (q.type === 'mc' || q.type === 'case') {
            const letters = ['A', 'B', 'C', 'D'];
            return `${letters[ans]}) ${q.options[ans]}`;
        }
        if (q.type === 'tf') return ans ? 'True' : 'False';
        if (q.type === 'fitb' || q.type === 'id') return ans;
        if (q.type === 'enum') {
            return (ans || []).filter(a => a && a.length > 0).join(', ') || '(No answer)';
        }
        return String(ans);
    }

    // --- Results ---
    function calculateAndShowResults() {
        let correct = 0;
        const total = filteredQuestions.length;
        const details = [];

        filteredQuestions.forEach((q, idx) => {
            const isCorrect = checkAnswer(q);
            if (isCorrect) correct++;
            details.push({
                question: q,
                index: idx + 1,
                isCorrect,
                userAnswer: getUserAnswerDisplay(q),
                correctAnswer: getCorrectAnswerDisplay(q)
            });
        });

        const scorePct = Math.round((correct / total) * 100);
        const passed = scorePct >= PASSING_SCORE;

        // Send to backend
        sendResults({
            name: userName,
            department: userDept,
            score: scorePct,
            correct,
            total,
            passed,
            version: QUIZ_VERSION,
            answers: details.map(d => ({
                id: d.question.id,
                section: d.question.section,
                correct: d.isCorrect,
                userAnswer: d.userAnswer,
                correctAnswer: d.correctAnswer
            }))
        });

        // Show results
        quizScreen.classList.add('hidden');
        resultsScreen.classList.remove('hidden');

        let html = `
            <div class="score-display card">
                <div class="score-circle ${passed ? 'pass' : 'fail'}">
                    <span class="score-number" id="score-anim">0</span>
                    <span class="score-label">percent</span>
                </div>
                <div class="score-status ${passed ? 'pass' : 'fail'}">${passed ? '🎉 PASSED!' : '❌ FAILED'}</div>
                <div class="score-detail">${correct} out of ${total} correct</div>
            </div>

            <div class="section-header">
                <div class="icon-wrap icon-blue">📊</div>
                <h2>Answer Review</h2>
            </div>
        `;

        details.forEach(d => {
            html += `
                <div class="review-card ${d.isCorrect ? 'correct' : 'wrong'}">
                    <div class="review-q">
                        <span style="color:var(--text-secondary); margin-right:6px;">${d.index}.</span>
                        ${d.question.type === 'case' && d.question.scenario ? `<div class="scenario-box" style="margin:8px 0; font-size:0.85rem;">${d.question.scenario}</div>` : ''}
                        ${d.question.text}
                    </div>
                    <div class="review-answer ${d.isCorrect ? 'correct-answer' : 'your-answer'}">
                        Your answer: ${d.userAnswer}
                    </div>
                    ${!d.isCorrect ? `<div class="review-answer correct-answer">Correct answer: ${d.correctAnswer}</div>` : ''}
                </div>
            `;
        });

        html += `
            <div class="submit-area">
                <button class="btn btn-secondary" onclick="location.reload()">Take Quiz Again</button>
                <a href="dashboard.html" class="btn btn-primary" style="margin-left:12px;">View Dashboard →</a>
            </div>
        `;

        resultsScreen.innerHTML = html;

        // Animate score
        animateScore(scorePct);
    }

    function animateScore(target) {
        const el = document.getElementById('score-anim');
        let current = 0;
        const duration = 1500;
        const step = target / (duration / 16);

        function tick() {
            current += step;
            if (current >= target) {
                el.textContent = target + '%';
                return;
            }
            el.textContent = Math.round(current) + '%';
            requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    // --- Backend ---
    function sendResults(data) {
        // Replace with your Google Apps Script Web App URL
        const BACKEND_URL = 'https://script.google.com/macros/s/AKfycbwf3j3jp21X_sV_mzgZEd_N5FAK7yXG_s7DQp4dk8OD16mGB2-CpAl3bUROBvvHE2K2/exec';

        if (!BACKEND_URL) {
            console.log('Quiz results (no backend configured):', data);
            // Store locally as fallback
            const stored = JSON.parse(localStorage.getItem('tayo_results') || '[]');
            stored.push({ ...data, timestamp: new Date().toISOString() });
            localStorage.setItem('tayo_results', JSON.stringify(stored));
            return;
        }

        fetch(BACKEND_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).catch(err => {
            console.error('Failed to send results:', err);
            // Fallback to localStorage
            const stored = JSON.parse(localStorage.getItem('tayo_results') || '[]');
            stored.push({ ...data, timestamp: new Date().toISOString() });
            localStorage.setItem('tayo_results', JSON.stringify(stored));
        });
    }

});
