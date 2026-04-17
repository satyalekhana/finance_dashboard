// Nova Financial Dashboard - Main JavaScript
// Complete implementation with calculators, AI insights, and all features

// ======================
// GLOBAL STATE & DATA
// ======================

const state = {
    transactions: [],
    currentPage: 'dashboard',
    currentFilter: 'all',
    currentCalc: 'emi'
};

// Sample transaction data
const sampleTransactions = [
    { id: 1, description: 'Amazon Shopping', category: 'shopping', amount: -250.00, date: '2026-04-15', type: 'expense', status: 'completed', icon: '🛍️' },
    { id: 2, description: 'Monthly Salary', category: 'salary', amount: 8249.50, date: '2026-04-01', type: 'income', status: 'completed', icon: '💰' },
    { id: 3, description: 'Starbucks Coffee', category: 'food', amount: -15.50, date: '2026-04-16', type: 'expense', status: 'completed', icon: '☕' },
    { id: 4, description: 'Uber Ride', category: 'transport', amount: -28.00, date: '2026-04-16', type: 'expense', status: 'completed', icon: '🚗' },
    { id: 5, description: 'Netflix Subscription', category: 'entertainment', amount: -19.99, date: '2026-04-14', type: 'expense', status: 'completed', icon: '🎬' },
    { id: 6, description: 'Grocery Store', category: 'food', amount: -125.75, date: '2026-04-13', type: 'expense', status: 'completed', icon: '🛒' },
    { id: 7, description: 'Electricity Bill', category: 'bills', amount: -89.50, date: '2026-04-12', type: 'expense', status: 'completed', icon: '⚡' },
    { id: 8, description: 'Freelance Project', category: 'salary', amount: 1500.00, date: '2026-04-10', type: 'income', status: 'completed', icon: '💼' }
];

// Chart instances
let charts = {};

// ======================
// INITIALIZATION
// ======================

document.addEventListener('DOMContentLoaded', () => {
    state.transactions = [...sampleTransactions];
    setTimeGreeting();
    initNavigation();
    renderDashboard();
    initCharts();
    initCalculators();
    initAI();
    initModals();
    initMobileMenu();
    initCardControls();
    initSettings();
});

// ======================
// UTILITY FUNCTIONS
// ======================

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2
    }).format(Math.abs(amount)).replace('₹', '₹');
}

function formatNumber(num) {
    return new Intl.NumberFormat('en-IN', {
        maximumFractionDigits: 0
    }).format(num);
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function syncInputSlider(input, slider) {
    input.addEventListener('input', (e) => {
        slider.value = e.target.value;
    });
    slider.addEventListener('input', (e) => {
        input.value = e.target.value;
    });
}

// ======================
// TIME GREETING
// ======================

function setTimeGreeting() {
    const hour = new Date().getHours();
    const greetingElement = document.getElementById('timeGreeting');
    if (hour < 12) greetingElement.textContent = 'morning';
    else if (hour < 18) greetingElement.textContent = 'afternoon';
    else greetingElement.textContent = 'evening';
}

// ======================
// NAVIGATION
// ======================

function initNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navigateToPage(item.dataset.page);
        });
    });
}

function navigateToPage(page) {
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelector(`[data-page="${page}"]`).classList.add('active');
    
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(`${page}-page`).classList.add('active');
    
    state.currentPage = page;
    
    if (page === 'transactions') renderTransactions();
}

// ======================
// DASHBOARD
// ======================

function renderDashboard() {
    renderRecentTransactions();
    renderQuickTransfer();
}

function renderRecentTransactions() {
    const container = document.getElementById('recentTransactions');
    const recent = state.transactions.slice(0, 5);
    
    container.innerHTML = recent.map(t => `
        <div class="transaction-item">
            <div class="transaction-icon ${t.category}">${t.icon}</div>
            <div class="transaction-info">
                <div class="transaction-name">${t.description}</div>
                <div class="transaction-date">${formatDate(t.date)}</div>
            </div>
            <div class="transaction-amount ${t.type === 'income' ? 'positive' : 'negative'}">
                ${t.type === 'income' ? '+' : ''}${formatCurrency(t.amount)}
            </div>
        </div>
    `).join('');
}

function renderQuickTransfer() {
    document.getElementById('sendMoneyBtn').addEventListener('click', () => {
        const amount = parseFloat(document.getElementById('transferAmount').value);
        if (amount > 0) {
            showToast(`Successfully sent ${formatCurrency(amount)}`, 'success');
            document.getElementById('transferAmount').value = '';
        }
    });
}

// ======================
// CHARTS
// ======================

function initCharts() {
    initSpendingChart();
    initCategoryChart();
    initIncomeExpenseChart();
    initNetWorthChart();
    initCategoryBreakdownChart();
}

function initSpendingChart() {
    const ctx = document.getElementById('spendingChart');
    if (!ctx) return;
    
    charts.spending = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Spending',
                data: [420, 385, 510, 445, 390, 580, 520],
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#1e2332',
                    titleColor: '#f1f5f9',
                    bodyColor: '#94a3b8',
                    borderColor: '#2d3548',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: (context) => `$${context.parsed.y}`
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: '#2d3548' },
                    ticks: { color: '#64748b' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#64748b' }
                }
            }
        }
    });
    
    document.querySelectorAll('.chart-toggle').forEach(toggle => {
        toggle.addEventListener('click', () => {
            document.querySelectorAll('.chart-toggle').forEach(t => t.classList.remove('active'));
            toggle.classList.add('active');
            updateSpendingChart(toggle.dataset.period);
        });
    });
}

function updateSpendingChart(period) {
    const data = {
        week: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], values: [420, 385, 510, 445, 390, 580, 520] },
        month: { labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], values: [1850, 2100, 1950, 2200] },
        year: { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], values: [3200, 3400, 3100, 3842, 3600, 3900, 3750, 3500, 3650, 3800, 3950, 4100] }
    };
    
    charts.spending.data.labels = data[period].labels;
    charts.spending.data.datasets[0].data = data[period].values;
    charts.spending.update();
}

function initCategoryChart() {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;
    
    const categories = { 'Shopping': 1200, 'Food': 890, 'Transport': 450, 'Entertainment': 520, 'Bills': 782.75 };
    
    charts.category = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(categories),
            datasets: [{
                data: Object.values(categories),
                backgroundColor: ['#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#10b981'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#1e2332',
                    callbacks: { label: (context) => `$${context.parsed}` }
                }
            }
        }
    });
    
    const legend = document.getElementById('categoryLegend');
    if (legend) {
        legend.innerHTML = Object.entries(categories).map(([name, value], i) => `
            <div class="legend-item">
                <div class="legend-color" style="background: ${['#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#10b981'][i]}"></div>
                <span class="legend-label">${name}</span>
                <span class="legend-value">$${value.toFixed(2)}</span>
            </div>
        `).join('');
    }
}

function initIncomeExpenseChart() {
    const ctx = document.getElementById('incomeExpenseChart');
    if (!ctx) return;
    
    charts.incomeExpense = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr'],
            datasets: [
                { label: 'Income', data: [8000, 8200, 8100, 8249.50], backgroundColor: '#10b981' },
                { label: 'Expenses', data: [3500, 3700, 3600, 3842.75], backgroundColor: '#ef4444' }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: '#94a3b8' } },
                tooltip: { backgroundColor: '#1e2332' }
            },
            scales: {
                y: { beginAtZero: true, grid: { color: '#2d3548' }, ticks: { color: '#64748b' } },
                x: { grid: { display: false }, ticks: { color: '#64748b' } }
            }
        }
    });
}

function initNetWorthChart() {
    const ctx = document.getElementById('netWorthChart');
    if (!ctx) return;
    
    charts.netWorth = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr'],
            datasets: [{
                label: 'Net Worth',
                data: [20000, 21500, 23000, 24563.89],
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { backgroundColor: '#1e2332' }
            },
            scales: {
                y: { beginAtZero: true, grid: { color: '#2d3548' }, ticks: { color: '#64748b' } },
                x: { grid: { display: false }, ticks: { color: '#64748b' } }
            }
        }
    });
}

function initCategoryBreakdownChart() {
    const ctx = document.getElementById('categoryBreakdownChart');
    if (!ctx) return;
    
    charts.categoryBreakdown = new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: ['Shopping', 'Food', 'Transport', 'Entertainment', 'Bills'],
            datasets: [{
                data: [1200, 890, 450, 520, 782.75],
                backgroundColor: ['#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#10b981']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#94a3b8' } },
                tooltip: { backgroundColor: '#1e2332' }
            },
            scales: { r: { grid: { color: '#2d3548' }, ticks: { color: '#64748b' } } }
        }
    });
}

// ======================
// TRANSACTIONS
// ======================

function renderTransactions() {
    const tbody = document.getElementById('transactionsList');
    let filtered = state.currentFilter === 'all' ? state.transactions : state.transactions.filter(t => t.type === state.currentFilter);
    
    tbody.innerHTML = filtered.map(t => `
        <tr>
            <td>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <span style="font-size: 1.5rem;">${t.icon}</span>
                    <div>
                        <div style="font-weight: 600; color: var(--text-primary);">${t.description}</div>
                        <div style="font-size: 0.8125rem; color: var(--text-muted);">#${t.id}</div>
                    </div>
                </div>
            </td>
            <td><span style="text-transform: capitalize; color: var(--text-secondary);">${t.category}</span></td>
            <td style="color: var(--text-secondary);">${formatDate(t.date)}</td>
            <td>
                <span style="font-family: var(--font-mono); font-weight: 700; color: ${t.type === 'income' ? 'var(--success)' : 'var(--text-primary)'};">
                    ${t.type === 'income' ? '+' : ''}${formatCurrency(t.amount)}
                </span>
            </td>
            <td><span class="status-badge ${t.status}">${t.status}</span></td>
        </tr>
    `).join('');
    
    if (!document.querySelector('.filter-btn').hasAttribute('data-initialized')) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                state.currentFilter = btn.dataset.filter;
                renderTransactions();
            });
        });
        document.querySelector('.filter-btn').setAttribute('data-initialized', 'true');
    }
}

// ======================
// CALCULATORS
// ======================

function initCalculators() {
    document.querySelectorAll('.calc-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.calc-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            document.querySelectorAll('.calculator-panel').forEach(panel => panel.classList.remove('active'));
            document.getElementById(`${tab.dataset.calc}-calculator`).classList.add('active');
        });
    });
    
    initEMICalculator();
    initInvestmentCalculator();
    initBudgetCalculator();
    initSavingsCalculator();
    initTaxCalculator();
}

function initEMICalculator() {
    syncInputSlider(document.getElementById('loanAmount'), document.getElementById('loanAmountSlider'));
    syncInputSlider(document.getElementById('interestRate'), document.getElementById('interestRateSlider'));
    syncInputSlider(document.getElementById('loanTenure'), document.getElementById('loanTenureSlider'));
    
    document.getElementById('calculateEMI').addEventListener('click', calculateEMI);
    calculateEMI();
}

function calculateEMI() {
    const P = parseFloat(document.getElementById('loanAmount').value);
    const R = parseFloat(document.getElementById('interestRate').value) / 12 / 100;
    const N = parseFloat(document.getElementById('loanTenure').value) * 12;
    
    const EMI = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    const totalPayment = EMI * N;
    const totalInterest = totalPayment - P;
    
    document.getElementById('emiAmount').textContent = `₹${formatNumber(EMI)}`;
    document.getElementById('principalAmount').textContent = `₹${formatNumber(P)}`;
    document.getElementById('totalInterest').textContent = `₹${formatNumber(totalInterest)}`;
    document.getElementById('totalPayment').textContent = `₹${formatNumber(totalPayment)}`;
    
    updateEMIChart(P, totalInterest);
}

function updateEMIChart(principal, interest) {
    const ctx = document.getElementById('emiChart');
    if (!ctx) return;
    
    if (charts.emi) charts.emi.destroy();
    
    charts.emi = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Principal', 'Interest'],
            datasets: [{
                data: [principal, interest],
                backgroundColor: ['#6366f1', '#ef4444'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: { position: 'bottom', labels: { color: '#94a3b8' } },
                tooltip: { backgroundColor: '#1e2332', callbacks: { label: (ctx) => `₹${formatNumber(ctx.parsed)}` } }
            }
        }
    });
}

function initInvestmentCalculator() {
    document.getElementById('calculateInvestment').addEventListener('click', () => {
        const initial = parseFloat(document.getElementById('initialInvestment').value);
        const monthly = parseFloat(document.getElementById('monthlyContribution').value);
        const rate = parseFloat(document.getElementById('expectedReturn').value) / 100 / 12;
        const months = parseFloat(document.getElementById('investmentPeriod').value) * 12;
        
        const fvInitial = initial * Math.pow(1 + rate, months);
        const fvMonthly = monthly * ((Math.pow(1 + rate, months) - 1) / rate);
        const futureValue = fvInitial + fvMonthly;
        const totalInvested = initial + (monthly * months);
        const totalReturns = futureValue - totalInvested;
        
        document.getElementById('futureValue').textContent = `₹${formatNumber(futureValue)}`;
        document.getElementById('totalInvested').textContent = `₹${formatNumber(totalInvested)}`;
        document.getElementById('totalReturns').textContent = `₹${formatNumber(totalReturns)}`;
        
        updateInvestmentChart(totalInvested, totalReturns);
    });
}

function updateInvestmentChart(invested, returns) {
    const ctx = document.getElementById('investmentChart');
    if (!ctx) return;
    
    if (charts.investment) charts.investment.destroy();
    
    charts.investment = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Total Invested', 'Total Returns'],
            datasets: [{ data: [invested, returns], backgroundColor: ['#6366f1', '#10b981'] }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { backgroundColor: '#1e2332', callbacks: { label: (ctx) => `₹${formatNumber(ctx.parsed.y)}` } }
            },
            scales: {
                y: { beginAtZero: true, grid: { color: '#2d3548' }, ticks: { color: '#64748b' } },
                x: { grid: { display: false }, ticks: { color: '#64748b' } }
            }
        }
    });
}

function initBudgetCalculator() {
    document.getElementById('calculateBudget').addEventListener('click', calculateBudget);
    calculateBudget();
}

function calculateBudget() {
    const income = parseFloat(document.getElementById('monthlyIncome').value);
    const needs = income * 0.5;
    const wants = income * 0.3;
    const savings = income * 0.2;
    
    document.getElementById('needsAmount').textContent = `₹${formatNumber(needs)}`;
    document.getElementById('wantsAmount').textContent = `₹${formatNumber(wants)}`;
    document.getElementById('savingsAmount').textContent = `₹${formatNumber(savings)}`;
    
    updateBudgetChart(needs, wants, savings);
}

function updateBudgetChart(needs, wants, savings) {
    const ctx = document.getElementById('budgetChart');
    if (!ctx) return;
    
    if (charts.budget) charts.budget.destroy();
    
    charts.budget = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Needs (50%)', 'Wants (30%)', 'Savings (20%)'],
            datasets: [{
                data: [needs, wants, savings],
                backgroundColor: ['#6366f1', '#f59e0b', '#10b981'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: { position: 'bottom', labels: { color: '#94a3b8' } },
                tooltip: { backgroundColor: '#1e2332', callbacks: { label: (ctx) => `₹${formatNumber(ctx.parsed)}` } }
            }
        }
    });
}

function initSavingsCalculator() {
    document.getElementById('calculateSavings').addEventListener('click', () => {
        const target = parseFloat(document.getElementById('targetAmount').value);
        const current = parseFloat(document.getElementById('currentSavings').value);
        const monthly = parseFloat(document.getElementById('monthlySavings').value);
        const rate = parseFloat(document.getElementById('savingsInterest').value) / 100 / 12;
        
        let months = 0;
        let balance = current;
        
        while (balance < target && months < 600) {
            balance = balance * (1 + rate) + monthly;
            months++;
        }
        
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;
        
        let timeText = years > 0 ? `${years} year${years > 1 ? 's' : ''}` : '';
        if (remainingMonths > 0) timeText += ` ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
        if (!timeText) timeText = `${months} month${months > 1 ? 's' : ''}`;
        
        document.getElementById('timeToGoal').textContent = timeText;
        document.getElementById('currentProgress').textContent = `₹${formatNumber(current)}`;
        document.getElementById('targetProgress').textContent = `₹${formatNumber(target)}`;
        document.getElementById('savingsProgress').style.width = `${(current / target * 100).toFixed(1)}%`;
        
        const tips = [
            `Increase monthly savings by ₹${formatNumber(monthly * 0.2)} to reach your goal faster`,
            'Set up automatic transfers on the 1st of each month',
            'Review and cut unnecessary subscriptions',
            'Consider high-yield savings accounts for better returns'
        ];
        document.getElementById('savingsTips').innerHTML = tips.map(tip => `<li>${tip}</li>`).join('');
    });
}

function initTaxCalculator() {
    const regimeSelect = document.getElementById('taxRegime');
    regimeSelect.addEventListener('change', () => {
        document.getElementById('deductionsGroup').style.display = regimeSelect.value === 'new' ? 'none' : 'block';
    });
    
    document.getElementById('calculateTax').addEventListener('click', () => {
        const annualIncome = parseFloat(document.getElementById('annualIncome').value);
        const regime = document.getElementById('taxRegime').value;
        const deductions = regime === 'old' ? parseFloat(document.getElementById('deductions').value || 0) : 0;
        const taxableIncome = Math.max(0, annualIncome - deductions);
        
        let tax = 0;
        if (regime === 'old') {
            if (taxableIncome > 1000000) tax = 112500 + (taxableIncome - 1000000) * 0.3;
            else if (taxableIncome > 500000) tax = 12500 + (taxableIncome - 500000) * 0.2;
            else if (taxableIncome > 250000) tax = (taxableIncome - 250000) * 0.05;
        } else {
            if (taxableIncome > 1500000) tax = 150000 + (taxableIncome - 1500000) * 0.3;
            else if (taxableIncome > 1200000) tax = 90000 + (taxableIncome - 1200000) * 0.2;
            else if (taxableIncome > 900000) tax = 45000 + (taxableIncome - 900000) * 0.15;
            else if (taxableIncome > 600000) tax = 15000 + (taxableIncome - 600000) * 0.1;
            else if (taxableIncome > 300000) tax = (taxableIncome - 300000) * 0.05;
        }
        tax *= 1.04;
        
        document.getElementById('totalTax').textContent = `₹${formatNumber(tax)}`;
        document.getElementById('grossIncome').textContent = `₹${formatNumber(annualIncome)}`;
        document.getElementById('taxableIncome').textContent = `₹${formatNumber(taxableIncome)}`;
        document.getElementById('effectiveTaxRate').textContent = `${(tax / annualIncome * 100).toFixed(2)}%`;
        document.getElementById('takeHome').textContent = `₹${formatNumber(annualIncome - tax)}`;
    });
}

// ======================
// AI FEATURES
// ======================

function initAI() {
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendChatBtn');
    
    document.querySelectorAll('.quick-question').forEach(btn => {
        btn.addEventListener('click', () => sendAIMessage(btn.textContent));
    });
    
    sendBtn.addEventListener('click', () => {
        if (chatInput.value.trim()) {
            sendAIMessage(chatInput.value);
            chatInput.value = '';
        }
    });
    
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && chatInput.value.trim()) {
            sendAIMessage(chatInput.value);
            chatInput.value = '';
        }
    });
    
    const refreshBtn = document.getElementById('refreshInsights');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => showToast('Insights refreshed!', 'success'));
    }
}

function sendAIMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    
    chatMessages.innerHTML += `
        <div class="chat-message user">
            <div class="message-avatar">👤</div>
            <div class="message-content"><p>${message}</p></div>
        </div>
    `;
    
    setTimeout(() => {
        const response = generateAIResponse(message);
        chatMessages.innerHTML += `
            <div class="chat-message assistant">
                <div class="message-avatar">🤖</div>
                <div class="message-content"><p>${response}</p></div>
            </div>
        `;
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000);
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateAIResponse(question) {
    const q = question.toLowerCase();
    
    if (q.includes('biggest expense')) {
        return "Your biggest expense category this month is <strong>Shopping</strong> at ₹1,200 (31% of expenses). This is 15% higher than average. Consider setting a monthly limit.";
    } else if (q.includes('budget') || q.includes('track')) {
        return "You're at 64% of your monthly budget with ₹3,842.75 spent out of ₹6,000. You're on track! Try to limit discretionary spending to stay under budget.";
    } else if (q.includes('save')) {
        return "You could save an extra ₹250/month by:<br>• Reducing dining out (₹120/mo)<br>• Canceling unused subscriptions (₹80/mo)<br>• Using public transport 2 days/week (₹50/mo)";
    } else {
        return "I can help with spending insights, budget tracking, savings goals, and financial health. Ask about specific categories or your overall financial picture!";
    }
}

// ======================
// MODALS
// ======================

function initModals() {
    const modal = document.getElementById('addTransactionModal');
    
    document.getElementById('addTransactionBtn').addEventListener('click', () => {
        modal.classList.add('active');
        document.getElementById('transactionDate').valueAsDate = new Date();
    });
    
    document.getElementById('closeModal').addEventListener('click', () => modal.classList.remove('active'));
    document.getElementById('cancelTransaction').addEventListener('click', () => modal.classList.remove('active'));
    
    document.getElementById('saveTransaction').addEventListener('click', () => {
        const type = document.getElementById('transactionType').value;
        const description = document.getElementById('transactionDescription').value;
        const category = document.getElementById('transactionCategory').value;
        const amount = parseFloat(document.getElementById('transactionAmount').value);
        const date = document.getElementById('transactionDate').value;
        
        if (description && amount && date) {
            const icons = { shopping: '🛍️', food: '🍔', transport: '🚗', entertainment: '🎬', bills: '📄', salary: '💰' };
            state.transactions.unshift({
                id: state.transactions.length + 1,
                description,
                category,
                amount: type === 'expense' ? -amount : amount,
                date,
                type,
                status: 'completed',
                icon: icons[category] || '💳'
            });
            
            modal.classList.remove('active');
            showToast('Transaction added!', 'success');
            renderRecentTransactions();
            if (state.currentPage === 'transactions') renderTransactions();
            
            document.getElementById('transactionDescription').value = '';
            document.getElementById('transactionAmount').value = '';
        } else {
            showToast('Please fill all fields', 'error');
        }
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });
}

// ======================
// MOBILE & MISC
// ======================

function initMobileMenu() {
    const btn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar');
    
    if (btn) {
        btn.addEventListener('click', () => sidebar.classList.toggle('active'));
    }
    
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && !sidebar.contains(e.target) && !btn.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    });
}

function initCardControls() {
    const spendingLimit = document.getElementById('spendingLimit');
    const limitValue = document.querySelector('.limit-value');
    
    if (spendingLimit && limitValue) {
        spendingLimit.addEventListener('input', (e) => {
            limitValue.textContent = `$${parseInt(e.target.value).toLocaleString()}`;
        });
    }
    
    const cardLock = document.getElementById('cardLock');
    if (cardLock) {
        cardLock.addEventListener('change', (e) => {
            showToast(e.target.checked ? 'Card locked' : 'Card unlocked', 'info');
        });
    }
}

function initSettings() {
    const darkMode = document.getElementById('darkMode');
    if (darkMode) {
        darkMode.addEventListener('change', (e) => {
            showToast(e.target.checked ? 'Dark mode enabled' : 'Dark mode disabled', 'info');
        });
    }
}
