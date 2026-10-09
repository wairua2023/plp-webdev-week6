
"use strict";

// SpendWise: arrays, objects, conditionals, loops, functions, DOM and events.

const STORAGE_KEY = "spendwise-expenses-v1";
const INCOME_KEY = "spendwise-income-v1";

const currency = new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 2
});

const initialExpenses = [
    { id: "seed-1", name: "Groceries", category: "Food", date: "2026-10-08", amount: 12500 },
    { id: "seed-2", name: "Bus fare", category: "Transport", date: "2026-10-07", amount: 6800 },
    { id: "seed-3", name: "Rent", category: "Housing", date: "2026-10-03", amount: 25000 },
    { id: "seed-4", name: "Movie and outing", category: "Entertainment", date: "2026-10-02", amount: 4200 },
    { id: "seed-5", name: "Internet and power", category: "Utilities", date: "2026-10-05", amount: 3900 },
    { id: "seed-6", name: "Other expenses", category: "Other", date: "2026-10-01", amount: 24000 }
];

function loadExpenses() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);

        if (raw === null) {
            return initialExpenses.map(x => ({ ...x }));
        }

        const data = JSON.parse(raw);

        return Array.isArray(data)
            ? data.filter(x =>
                x &&
                typeof x.id === "string" &&
                typeof x.name === "string" &&
                typeof x.category === "string" &&
                typeof x.date === "string" &&
                Number.isFinite(x.amount) &&
                x.amount > 0
            )
            : initialExpenses.map(x => ({ ...x }));
    } catch (e) {
        console.warn("Could not load saved expenses; using sample records.", e);
        return initialExpenses.map(x => ({ ...x }));
    }
}

function loadIncome() {
    const n = Number(localStorage.getItem(INCOME_KEY));
    return Number.isFinite(n) && n > 0 ? n : 120000;
}

let monthlyIncome = loadIncome();
let expenses = loadExpenses();

const el = {
    incomeInput: document.getElementById("incomeInput"),
    budgetForm: document.getElementById("budgetForm"),
    expenseForm: document.getElementById("expenseForm"),
    expenseName: document.getElementById("expenseName"),
    expenseCategory: document.getElementById("expenseCategory"),
    expenseAmount: document.getElementById("expenseAmount"),
    totalBalance: document.getElementById("totalBalance"),
    monthlyIncome: document.getElementById("monthlyIncome"),
    totalExpenses: document.getElementById("totalExpenses"),
    expenseRatio: document.getElementById("expenseRatio"),
    remainingBalance: document.getElementById("remainingBalance"),
    budgetStatus: document.getElementById("budgetStatus"),
    budgetStatusDetail: document.getElementById("budgetStatusDetail"),
    healthProgress: document.getElementById("healthProgress"),
    healthPercent: document.getElementById("healthPercent"),
    transactionRows: document.getElementById("transactionRows"),
    emptyTransactions: document.getElementById("emptyTransactions"),
    feedback: document.getElementById("feedback"),
    clearExpenses: document.getElementById("clearExpenses")
};

function money(n) {
    return currency.format(n);
}

function calculateTotalExpenses() {
    let total = 0;

    for (const expense of expenses) {
        total += expense.amount;
    }

    return total;
}

function calculateRemainingBalance() {
    return monthlyIncome - calculateTotalExpenses();
}

function calculateSpendingPercentage() {
    return monthlyIncome > 0
        ? calculateTotalExpenses() / monthlyIncome * 100
        : 0;
}

function showFeedback(message, isError = false) {
    el.feedback.textContent = message;
    el.feedback.classList.toggle("feedback-error", isError);
}

function saveData() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
        localStorage.setItem(INCOME_KEY, String(monthlyIncome));
    } catch (e) {
        showFeedback(
            "Changes are active, but this browser could not save them for next time.",
            true
        );
        console.warn("Could not save SpendWise data.", e);
    }
}

function updateSummary() {
    const total = calculateTotalExpenses();
    const balance = calculateRemainingBalance();
    const percent = calculateSpendingPercentage();
    const bounded = Math.max(0, Math.min(percent, 100));

    el.totalBalance.textContent = money(balance);
    el.monthlyIncome.textContent = money(monthlyIncome);
    el.totalExpenses.textContent = money(total);
    el.expenseRatio.textContent = `${percent.toFixed(1)}% of monthly income`;

    el.remainingBalance.textContent =
        `${money(balance)} ${balance < 0 ? "over budget" : "remaining"}`;

    el.healthProgress.style.width = `${bounded}%`;

    el.healthProgress.parentElement.setAttribute(
        "aria-label",
        `${percent.toFixed(1)} percent of monthly income spent`
    );

    el.healthPercent.textContent = `${percent.toFixed(1)}% of income used`;

    if (balance < 0) {
        el.budgetStatus.textContent = "Over budget";
        el.budgetStatusDetail.textContent =
            `You have spent ${money(Math.abs(balance))} more than your income.`;
        el.healthProgress.style.background = "var(--danger)";
    } else if (balance === 0) {
        el.budgetStatus.textContent = "Income fully used";
        el.budgetStatusDetail.textContent =
            "Your expenses equal your monthly income.";
        el.healthProgress.style.background = "var(--warning)";
    } else if (percent >= 80) {
        el.budgetStatus.textContent = "Spending warning";
        el.budgetStatusDetail.textContent =
            "You have used at least 80% of your monthly income.";
        el.healthProgress.style.background = "var(--warning)";
    } else {
        el.budgetStatus.textContent = "Within budget";
        el.budgetStatusDetail.textContent =
            "Your expenses are below 80% of your monthly income.";
        el.healthProgress.style.background = "var(--accent)";
    }
}

function dateLabel(s) {
    const d = new Date(`${s}T00:00:00`);

    return Number.isNaN(d.getTime())
        ? s
        : new Intl.DateTimeFormat("en-KE", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }).format(d);
}

function displayExpenses() {
    el.transactionRows.replaceChildren();

    const sorted = [...expenses].sort(
        (a, b) => b.date.localeCompare(a.date)
    );

    for (const item of sorted) {
        const row = document.createElement("tr");
        const name = document.createElement("td");
        const cat = document.createElement("td");
        const date = document.createElement("td");
        const amount = document.createElement("td");
        const action = document.createElement("td");
        const button = document.createElement("button");

        name.textContent = item.name;
        cat.textContent = item.category;
        date.textContent = dateLabel(item.date);

        // Use a normal hyphen to avoid the âˆ’ character problem.
        amount.textContent = `- ${money(item.amount)}`;
        amount.className = "amount-cell";

        button.type = "button";
        button.className = "delete-button";
        button.textContent = "Delete";
        button.dataset.expenseId = item.id;
        button.setAttribute("aria-label", `Delete ${item.name}`);

        action.appendChild(button);
        row.append(name, cat, date, amount, action);
        el.transactionRows.appendChild(row);
    }

    el.emptyTransactions.hidden = expenses.length !== 0;
}

function updateDashboard() {
    updateSummary();
    displayExpenses();
}

el.incomeInput.value = String(monthlyIncome);

el.budgetForm.addEventListener("submit", event => {
    event.preventDefault();

    const n = Number(el.incomeInput.value);

    if (!Number.isFinite(n) || n <= 0) {
        showFeedback("Enter a valid monthly income greater than zero.", true);
        return;
    }

    monthlyIncome = n;
    saveData();
    updateDashboard();
    showFeedback("Monthly income updated.");
});

el.expenseForm.addEventListener("submit", event => {
    event.preventDefault();

    const name = el.expenseName.value.trim();
    const category = el.expenseCategory.value;
    const amount = Number(el.expenseAmount.value);

    if (!name || !category || !Number.isFinite(amount) || amount <= 0) {
        showFeedback(
            "Enter an expense name, choose a category, and enter an amount above zero.",
            true
        );
        return;
    }

    const id = window.crypto && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    expenses.push({
        id,
        name,
        category,
        date: new Date().toISOString().slice(0, 10),
        amount
    });

    saveData();
    updateDashboard();
    el.expenseForm.reset();
    showFeedback(`Added ${name} (${money(amount)}).`);
});

el.transactionRows.addEventListener("click", event => {
    const button = event.target.closest("button[data-expense-id]");

    if (!button) return;

    const item = expenses.find(x => x.id === button.dataset.expenseId);

    if (!item) return;

    expenses = expenses.filter(x => x.id !== item.id);

    saveData();
    updateDashboard();
    showFeedback(`Deleted ${item.name}.`);
});

el.clearExpenses.addEventListener("click", () => {
    if (!expenses.length) {
        showFeedback("There are no expenses to clear.");
        return;
    }

    if (!window.confirm("Delete all expense records? This cannot be undone.")) {
        return;
    }

    expenses = [];
    saveData();
    updateDashboard();
    showFeedback("All expense records were cleared.");
});

updateDashboard();