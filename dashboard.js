// Tayo Dashboard Engine
document.addEventListener('DOMContentLoaded', () => {

    // --- State ---
    let allResults = [];
    let sortField = 'score';
    let sortDir = 'desc';
    let missedChart = null;
    let deptChart = null;

    // --- DOM Refs ---
    const filterDept = document.getElementById('filter-dept');
    const filterStatus = document.getElementById('filter-status');
    const searchName = document.getElementById('search-name');
    const leaderboardBody = document.getElementById('leaderboard-body');
    const noData = document.getElementById('no-data');

    // --- Load Data ---
    function loadData() {
        // Try backend first, fallback to localStorage
        const BACKEND_URL = 'https://script.google.com/macros/s/AKfycbwUNkCbjEDQCg-4nNit5hQ6rghUe-omyMIJlrWQM6cqCDfeBLyLMvWneBmILZO7VHFP/exec';

        if (BACKEND_URL) {
            fetch(`${BACKEND_URL}?action=leaderboard`)
                .then(r => r.json())
                .then(data => { allResults = data; render(); })
                .catch(() => loadLocal());
        } else {
            loadLocal();
        }
    }

    function loadLocal() {
        allResults = JSON.parse(localStorage.getItem('tayo_results') || '[]');
        render();
    }

    // --- Filters ---
    function getFiltered() {
        let data = [...allResults];

        const dept = filterDept.value;
        if (dept !== 'all') data = data.filter(r => r.department === dept);

        const status = filterStatus.value;
        if (status === 'pass') data = data.filter(r => r.passed);
        else if (status === 'fail') data = data.filter(r => !r.passed);

        const search = searchName.value.toLowerCase().trim();
        if (search) data = data.filter(r => r.name.toLowerCase().includes(search));

        // Sort
        data.sort((a, b) => {
            let va, vb;
            if (sortField === 'name') { va = a.name.toLowerCase(); vb = b.name.toLowerCase(); }
            else if (sortField === 'score') { va = a.score; vb = b.score; }
            else if (sortField === 'date') { va = new Date(a.timestamp); vb = new Date(b.timestamp); }
            else { va = a[sortField]; vb = b[sortField]; }

            if (va < vb) return sortDir === 'asc' ? -1 : 1;
            if (va > vb) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });

        return data;
    }

    filterDept.addEventListener('change', render);
    filterStatus.addEventListener('change', render);
    searchName.addEventListener('input', render);

    // Sort headers
    document.querySelectorAll('[data-sort]').forEach(th => {
        th.addEventListener('click', () => {
            const field = th.dataset.sort;
            if (sortField === field) sortDir = sortDir === 'asc' ? 'desc' : 'asc';
            else { sortField = field; sortDir = 'desc'; }
            render();
        });
    });

    // --- Render ---
    function render() {
        const filtered = getFiltered();
        renderKPIs(filtered);
        renderLeaderboard(filtered);
        renderCharts(filtered);
    }

    function renderKPIs(data) {
        document.getElementById('kpi-total').textContent = data.length;

        if (data.length === 0) {
            document.getElementById('kpi-pass-rate').textContent = '—';
            document.getElementById('kpi-avg').textContent = '—';
            document.getElementById('kpi-missed').textContent = '—';
            return;
        }

        const passed = data.filter(r => r.passed).length;
        document.getElementById('kpi-pass-rate').textContent = Math.round((passed / data.length) * 100) + '%';

        const avg = Math.round(data.reduce((s, r) => s + r.score, 0) / data.length);
        document.getElementById('kpi-avg').textContent = avg + '%';

        // Most missed question
        const missedMap = getMissedMap(data);
        const entries = Object.entries(missedMap).sort((a, b) => b[1] - a[1]);
        if (entries.length > 0) {
            const qId = parseInt(entries[0][0]);
            const q = QUESTIONS.find(qq => qq.id === qId);
            const short = q ? (q.text.length > 50 ? q.text.substring(0, 50) + '...' : q.text) : `Q${qId}`;
            document.getElementById('kpi-missed').textContent = short;
        }
    }

    function getMissedMap(data) {
        const map = {};
        data.forEach(r => {
            if (r.answers) {
                r.answers.forEach(a => {
                    if (!a.correct) {
                        map[a.id] = (map[a.id] || 0) + 1;
                    }
                });
            }
        });
        return map;
    }

    function renderLeaderboard(data) {
        if (data.length === 0) {
            leaderboardBody.innerHTML = '';
            noData.classList.remove('hidden');
            return;
        }
        noData.classList.add('hidden');

        const deptLabels = { sales: 'Sales', ops: 'Operations', tech: 'Tech' };
        let html = '';

        data.forEach((r, i) => {
            const date = r.timestamp ? new Date(r.timestamp).toLocaleDateString('en-PH', {
                month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
            }) : '—';

            html += `
                <tr class="result-row" data-idx="${i}">
                    <td>${i + 1}</td>
                    <td><strong>${escHtml(r.name)}</strong></td>
                    <td><span class="dept-badge ${r.department}">${deptLabels[r.department] || r.department}</span></td>
                    <td><strong>${r.score}%</strong> <span style="color:var(--text-muted); font-size:0.8rem;">(${r.correct}/${r.total})</span></td>
                    <td><span class="${r.passed ? 'badge-pass' : 'badge-fail'}">${r.passed ? 'PASSED' : 'FAILED'}</span></td>
                    <td style="font-size:0.85rem; color:var(--text-secondary);">${date}</td>
                    <td><button class="btn btn-secondary expand-btn" data-idx="${i}" style="padding:6px 12px; font-size:0.8rem;">View</button></td>
                </tr>
                <tr class="expand-row" id="expand-${i}">
                    <td colspan="7">
                        <div class="expand-content">
                            <div class="mini-grid">
                                ${renderMiniResults(r)}
                            </div>
                        </div>
                    </td>
                </tr>
            `;
        });

        leaderboardBody.innerHTML = html;

        // Expand listeners
        document.querySelectorAll('.expand-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const row = document.getElementById(`expand-${btn.dataset.idx}`);
                row.classList.toggle('active');
                btn.textContent = row.classList.contains('active') ? 'Hide' : 'View';
            });
        });
    }

    function renderMiniResults(result) {
        if (!result.answers) return '<span style="color:var(--text-muted);">No detailed data available</span>';

        return result.answers.map(a => {
            const q = QUESTIONS.find(qq => qq.id === a.id);
            const short = q ? (q.text.length > 60 ? q.text.substring(0, 60) + '...' : q.text) : \`Q\${a.id}\`;
            
            let overrideBtn = '';
            if (!a.correct) {
                overrideBtn = \`<button onclick="window.overrideScore('\${result.timestamp}', \${a.id})" style="margin-top:8px; background:var(--accent-green); color:white; border:none; padding:4px 8px; border-radius:4px; font-size:0.75rem; cursor:pointer;">✅ Mark as Correct</button>\`;
            }

            return \`
                <div class="mini-result \${a.correct ? 'correct' : 'wrong'}" style="display:flex; flex-direction:column; align-items:flex-start; padding:12px; height:auto;">
                    <div style="display:flex; align-items:center; margin-bottom:8px;">
                        <div class="mini-dot"></div>
                        <span style="font-weight:600;">\${short}</span>
                    </div>
                    <div style="font-size:0.8rem; color:var(--text-secondary); width:100%;">
                        <div><strong>They answered:</strong> \${escHtml(a.userAnswer || '')}</div>
                        \${!a.correct ? \`<div style="color:var(--accent-red); margin-top:4px;"><strong>Correct answer:</strong> \${escHtml(a.correctAnswer || '')}</div>\` : ''}
                    </div>
                    \${overrideBtn}
                </div>
            \`;
        }).join('');
    }

    // Expose override globally
    window.overrideScore = function(timestamp, questionId) {
        if (!confirm("Are you sure you want to mark this answer as correct? The score will automatically recalculate.")) return;

        // Optimistic UI Update
        const result = allResults.find(r => r.timestamp === timestamp);
        if (result) {
            const ans = result.answers.find(a => a.id === questionId);
            if (ans && !ans.correct) {
                ans.correct = true;
                result.correct += 1;
                result.score = Math.round((result.correct / result.total) * 100);
                result.passed = result.score >= 80; // PASSING_SCORE is 80
            }
        }
        render(); // Re-render immediately

        // Send update to Google Sheets
        const BACKEND_URL = 'https://script.google.com/macros/s/AKfycbwUNkCbjEDQCg-4nNit5hQ6rghUe-omyMIJlrWQM6cqCDfeBLyLMvWneBmILZO7VHFP/exec';
        if (BACKEND_URL) {
            fetch(BACKEND_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify({
                    action: 'override',
                    timestamp: timestamp,
                    id: questionId
                })
            });
        }
    };

    // --- Charts ---
    function renderCharts(data) {
        renderMissedChart(data);
        renderDeptChart(data);
    }

    function renderMissedChart(data) {
        const missedMap = getMissedMap(data);
        const entries = Object.entries(missedMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        const labels = entries.map(([id]) => {
            const q = QUESTIONS.find(qq => qq.id === parseInt(id));
            return q ? (q.text.length > 40 ? 'Q' + id + ': ' + q.text.substring(0, 37) + '...' : 'Q' + id + ': ' + q.text) : 'Q' + id;
        });
        const values = entries.map(([, count]) => count);

        const ctx = document.getElementById('chart-missed');
        if (missedChart) missedChart.destroy();

        missedChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Times Missed',
                    data: values,
                    backgroundColor: 'rgba(239, 68, 68, 0.6)',
                    borderColor: 'rgba(239, 68, 68, 1)',
                    borderWidth: 1,
                    borderRadius: 6
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        ticks: { color: '#a0aabf', stepSize: 1 },
                        grid: { color: 'rgba(255,255,255,0.05)' }
                    },
                    y: {
                        ticks: { color: '#a0aabf', font: { size: 11 } },
                        grid: { display: false }
                    }
                }
            }
        });
    }

    function renderDeptChart(data) {
        const depts = ['sales', 'ops', 'tech'];
        const deptLabels = ['Sales', 'Operations', 'Tech'];
        const colors = ['rgba(59,130,246,0.7)', 'rgba(16,185,129,0.7)', 'rgba(139,92,246,0.7)'];

        const passRates = depts.map(d => {
            const deptData = data.filter(r => r.department === d);
            if (deptData.length === 0) return 0;
            return Math.round((deptData.filter(r => r.passed).length / deptData.length) * 100);
        });

        const ctx = document.getElementById('chart-dept');
        if (deptChart) deptChart.destroy();

        deptChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: deptLabels,
                datasets: [{
                    data: passRates.map(r => r || 1), // minimum 1 for display
                    backgroundColor: colors,
                    borderColor: '#1e2130',
                    borderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#a0aabf', padding: 16, font: { family: 'Outfit' } }
                    },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => `${ctx.label}: ${passRates[ctx.dataIndex]}% pass rate`
                        }
                    }
                }
            }
        });
    }

    // --- Utility ---
    function escHtml(str) {
        const d = document.createElement('div');
        d.textContent = str;
        return d.innerHTML;
    }

    // --- Init ---
    loadData();
});
