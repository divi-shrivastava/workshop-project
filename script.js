const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const category = document.getElementById('category');
const list = document.getElementById('list');
const balance = document.getElementById('balance');
const moneyPlus = document.getElementById('money-plus');
const moneyMinus = document.getElementById('money-minus');
const errorMsg = document.getElementById('error');
const transactionCount = document.getElementById('transaction-count');
const searchInput = document.getElementById('searchTransaction');

// Load transactions from localStorage
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Function to generate a unique ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// Add transaction to the DOM list
function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement('li');

  // Add class based on value
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
  
  item.innerHTML = `
    <div>
      <span class="transaction-description">${transaction.text}</span>
      <span class="transaction-category">(${transaction.category})</span>
    </div>
    <span class="transaction-amount">${sign}&#8377;${Math.abs(transaction.amount).toFixed(2)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})"><i class="fas fa-trash-alt"></i></button>
  `;
  list.appendChild(item);
}

// Update the balance, income, and expense
function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);

  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);
  const expense = (
    amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1
  ).toFixed(2);

  balance.innerText = `₹${total}`;
  moneyPlus.innerText = `+₹${income}`;
  moneyMinus.innerText = `-₹${expense}`;
  transactionCount.innerText = transactions.length;
}

// Add a new transaction
function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === '' || amount.value.trim() === '' || category.value.trim() === '') {
    errorMsg.innerText = 'Please fill in all fields.';
    return;
  } else {
    errorMsg.innerText = '';
  }

  const transaction = {
    id: generateID(),
    text: text.value,
    amount: +amount.value,
    category: category.value,
  };

  transactions.push(transaction);

  addTransactionDOM(transaction);
  updateValues();
  updateLocalStorage();

  text.value = '';
  amount.value = '';
  category.value = '';
}

// Remove transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);

  updateLocalStorage();
  init();
}

// Clear all transactions
function clearAll() {
  localStorage.removeItem('transactions');
  transactions = [];
  init();
}

// Filter transactions based on search input
function filterTransactions() {
  const searchTerm = searchInput.value.toLowerCase();
  const filteredTransactions = transactions.filter(transaction =>
    transaction.text.toLowerCase().includes(searchTerm) ||
    transaction.category.toLowerCase().includes(searchTerm)
  );
  
  // Clear the current list
  list.innerHTML = '';
  
  // Add filtered transactions to the DOM
  filteredTransactions.forEach(addTransactionDOM);
}

// Update local storage
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Initialize the app
function init() {
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateValues();
}

// Event listeners
form.addEventListener('submit', addTransaction);
searchInput.addEventListener('input', filterTransactions);

// Initial call
init();
