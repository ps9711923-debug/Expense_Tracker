const form = document.getElementById('expense-form');
const list = document.getElementById('expense-list');
const totalSpan = document.getElementById('total');
const submitBtn = document.getElementById('submit-btn');

const ExpenseManager = {
    expenses: JSON.parse(localStorage.getItem('expenses')) || [],
    editingIndex: null,

    init() {
        this.renderExpenses();
        form.addEventListener('submit', this.handleFormSubmit.bind(this));
        list.addEventListener('click', this.handleListClick.bind(this));
    },

    saveExpenses() {
        localStorage.setItem('expenses', JSON.stringify(this.expenses));
    },

    calculateTotal() {
        const total = this.expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
        
        totalSpan.textContent = `₹${total.toFixed(2)}`;
        totalSpan.className = 'total-amount';
        if (total >= 0) {
            totalSpan.classList.add('amount-positive');
        } else {
            totalSpan.classList.add('amount-negative');
        }
    },

    createExpenseListItem({ description, amount, category, date }, index) {
        const li = document.createElement('li');
        const formattedAmount = parseFloat(amount).toFixed(2);
        const isPositive = formattedAmount >= 0;
        
        li.classList.add(isPositive ? 'amount-positive' : 'amount-negative');

        li.innerHTML = `
            <span class="expense-info">
                <span class="expense-desc">${description}</span>
                <span class="expense-meta">${category} on ${date}</span>
            </span>
            <div class="expense-actions">
                <span class="expense-amount">${isPositive ? '+' : ''}₹${formattedAmount}</span>
                <button class="btn btn-edit" data-index="${index}"><i class="fas fa-edit"></i></button>
                <button class="btn btn-delete" data-index="${index}"><i class="fas fa-trash"></i></button>
            </div>
        `;
        return li;
    },

    renderExpenses() {
        list.innerHTML = '';
        this.expenses.forEach((expense, index) => {
            list.appendChild(this.createExpenseListItem(expense, index));
        });
        this.calculateTotal();
        this.saveExpenses();
    },

    handleFormSubmit(e) {
        e.preventDefault();

        if (!form.checkValidity()) {
            alert("Please fill out all fields correctly.");
            return;
        }

        const newExpense = {
            description: document.getElementById('description').value.trim(),
            amount: document.getElementById('amount').value,
            category: document.getElementById('category').value,
            date: document.getElementById('date').value
        };

        if (this.editingIndex !== null) {
            this.expenses[this.editingIndex] = newExpense;
            this.editingIndex = null;
            submitBtn.textContent = 'Add Expense';
            submitBtn.classList.remove('btn-warning');
            submitBtn.classList.add('btn-primary');
        } else {
            this.expenses.push(newExpense);
        }
        
        this.renderExpenses();
        form.reset();
        document.getElementById('category').value = ''; 
    },

    handleListClick(e) {
        const target = e.target.closest('.btn'); 
        if (!target) return;

        const index = parseInt(target.dataset.index);

        if (target.classList.contains('btn-delete')) {
            this.deleteExpense(index);
        } else if (target.classList.contains('btn-edit')) {
            this.editExpense(index);
        }
    },

    deleteExpense(index) {
        if (confirm(`Are you sure you want to delete "${this.expenses[index].description}"?`)) {
            this.expenses.splice(index, 1);
            this.renderExpenses();
        }
    },

    editExpense(index) {
        const expense = this.expenses[index];
        
        document.getElementById('description').value = expense.description;
        document.getElementById('amount').value = expense.amount;
        document.getElementById('category').value = expense.category;
        document.getElementById('date').value = expense.date;
        
        this.editingIndex = index;
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
        submitBtn.classList.remove('btn-primary');
        submitBtn.classList.add('btn-warning');

        document.querySelector('.form-card').scrollIntoView({ behavior: 'smooth' });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    ExpenseManager.init();
});