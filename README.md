# SpendWise Interactive Dashboard

## Project description
SpendWise is a responsive personal finance dashboard built with HTML, CSS, and JavaScript. It extends the original dashboard with interactive income management, expense recording, deletion, budget-health feedback, and dynamic transaction rendering.

## Features
- Financial overview with monthly income, total expenses, and remaining balance.
- Form to update monthly income and form to add expenses by name, category, and amount.
- Expense records sorted by date, with the option to delete one record or clear all records after confirmation.
- Budget feedback: within budget, spending warning at 80%, income fully used, or over budget.
- Input validation, dynamic dashboard updates, responsive layout, keyboard focus styles, and dark theme.
- Browser `localStorage` retains income and expense records after refreshing in the same browser.

## Technologies
- **HTML5:** page structure and accessible forms.
- **CSS3:** Grid/Flexbox, responsive layout, transitions, and dark theme.
- **JavaScript:** variables, arrays, objects, conditionals, loops, reusable functions, DOM manipulation, event listeners, validation, and localStorage.

## Project structure
```text
spendwise-dashboard/
├── index.html
├── styles.css
├── script.js
└── README.md
```

## Run the project
1. Keep all four files in the same folder.
2. Open the folder in Visual Studio Code.
3. Open `index.html` with Live Server or a modern web browser.
4. Update monthly income or add an expense using the forms.
5. View the updated summary and transaction table.
6. Use **Delete** to remove a transaction or **Clear expenses** to remove all records after confirming.
7. Refresh the page to verify that the browser retained the data.

The HTML should include `<link rel="stylesheet" href="styles.css">` in the head and `<script src="script.js" defer></script>` before `</body>`.

## JavaScript concepts demonstrated
- **Variables:** `monthlyIncome` and `expenses`.
- **Arrays and objects:** each expense record is an object in the `expenses` array.
- **Decision making:** `if`, `else if`, and `else` validate input and evaluate the budget status.
- **Loops:** `for...of` calculates totals and creates transaction rows.
- **Functions:** `calculateTotalExpenses()`, `calculateRemainingBalance()`, `calculateSpendingPercentage()`, `updateSummary()`, `displayExpenses()`, and `updateDashboard()`.
- **DOM manipulation:** updates text, creates table rows, and changes the budget progress bar.
- **Event listeners:** handles form submission, delete clicks, and clearing records.
- **Persistence:** `localStorage` saves data in the current browser.

## Budget calculation
**Remaining balance = Monthly income − Total expenses**

For example, with income of KSh 120,000 and expenses of KSh 76,400, the remaining balance is KSh 43,600 and 63.7% of income has been spent.

## Testing checklist
- [ ] Update income with a valid positive amount.
- [ ] Try invalid income and confirm validation appears.
- [ ] Add an expense and verify it appears in the table.
- [ ] Try missing fields or a non-positive amount.
- [ ] Add several expenses and verify totals recalculate.
- [ ] Spend 80% or more of income and confirm a warning.
- [ ] Exceed income and confirm the over-budget status.
- [ ] Delete an expense and verify totals recalculate.
- [ ] Clear all expenses and verify the empty-state message.
- [ ] Refresh and verify data persistence.

## Limitations
- Data is saved only in the current browser and is not synchronized between devices.
- Clearing browser storage removes saved data.
- The project does not connect to banks, process payments, or provide financial advice.
- The category cards are sample figures; the summary and transaction list are updated from the interactive expense records.

## Conclusion
SpendWise demonstrates how HTML, CSS, and JavaScript work together to create an interactive budgeting dashboard. Users can manage income and expense records and see budget calculations respond to their actions.
