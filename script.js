const balance = document.querySelector('#balance');
const money_plus = document.querySelector('#money-plus');
const money_minus = document.querySelector('#money-minus');
const list = document.querySelector('#list');
const form = document.querySelector('#form');
const text = document.querySelector('#text');
const amount = document.querySelector('#amount');

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// Add transaction
function addTransaction(e) {
   e.preventDefault();

   if (text.value.trim() === '' || amount.value.trim() === '') {
      alert('Please add a text and amount');
   } else {
      const transaction = {
         id: generateID(),
         text: text.value,
         amount: +(amount.value)
      }

      transactions.push(transaction);
      addTransactionDOM(transaction);
      updateValues();
      updateLocalStorage();

      text.value = '';
      amount.value = '';
   }
}

// Genrate random ID
function generateID() {
   return Math.floor(Math.random() * 100000000);
}

// Add transactions to DOM list
function addTransactionDOM(transaction) {

   // Get sign
   const sign = transaction.amount < 0 ? '-' : '+';
   const item = document.createElement('li');

   // Add class based on value
   item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

   item.innerHTML = `
    ${transaction.text} <span>${sign}${transformToCzk(Math.abs(transaction.amount))}</span>
   <button class="delete-btn" onClick="removeTransaction(${transaction.id})">X</button>
  `;

   list.appendChild(item);
}

// Update the balance, income and expense
function updateValues() {
   const amounts = transactions.map(transaction => transaction.amount)

   const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

   const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2);

   const expense = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);

   balance.innerHTML = `${transformToCzk(parseFloat(total))}`;
   money_plus.innerHTML = `+${transformToCzk(parseFloat(income))}`;
   money_minus.innerHTML = `-${transformToCzk(parseFloat(expense))}`;
}

// Czech currency (Kč)
function transformToCzk(amount) {
   return amount.toLocaleString('cs-CZ', {
      style: 'currency',
      currency: 'CZK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      useGrouping: true,
   });
}

// Remove transaction by ID
function removeTransaction(id) {
   transactions = transactions.filter(transaction => transaction.id !== id);
   updateLocalStorage();
   init();
}

// Update local storage transactions
function updateLocalStorage() {
   localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Init App
function init() {
   list.innerHTML = '';
   transactions.forEach(addTransactionDOM)
   updateValues();
}

init();

// EventListeners
form.addEventListener('submit', addTransaction);