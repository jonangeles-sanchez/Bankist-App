'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
// Demo Accounts

//const account1 = {
//  owner: 'Jonas Schmedtmann',
//  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//  interestRate: 1.2, // %
//  pin: 1111,
//};
//
//const account2 = {
//  owner: 'Jessica Davis',
//  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//  interestRate: 1.5,
//  pin: 2222,
//};
//
//const account3 = {
//  owner: 'Steven Thomas Williams',
//  movements: [200, -200, 340, -300, -20, 50, 400, -460],
//  interestRate: 0.7,
//  pin: 3333,
//};
//
//const account4 = {
//  owner: 'Sarah Smith',
//  movements: [430, 1000, 700, 50, 90],
//  interestRate: 1,
//  pin: 4444,
//};

//DEMO ACCOUNTS W/TIMES

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

//const accounts = [account1, account2, account3, account4];

// variables -> Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//Event Handler Variables
let currentAccount;

/*---------------------------------------------------------------*/

//Display transaction history Function
//Using arrays
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  //If sort = true, array will be sorted
  //Else transactions will be traditionally shown
  const movs = sort ? acc.slice().sort((a, b) => a - b) : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    //Template string/literal
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov.toFixed(2)}€</div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//Display balance Function
//=> means return
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};

//Calculate and Display balances Function
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out).toFixed(2)}`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

//Username creator
const createUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0]) //Simpler way of returning name[0]
      .join('');
  });
};
createUsername(accounts);

//UI Updater
const updateUI = function (acc) {
  //Display movements
  displayMovements(acc);
  //Display balance
  calcDisplayBalance(acc);
  //Display summary
  calcDisplaySummary(acc);
};

//Login Function
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  //Determine if account exists and throw a true or false
  currentAccount = accounts.find(
    //return a true or false if account is found
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    //Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //Updates UI after every transfer
    updateUI(currentAccount);
  }
});

//Transfer Function
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    //Transfer data between arrays
    //console.log('Transfer valid');
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    //console.log('Transfer successfully complete!');
    updateUI(currentAccount);
  }
});

//Loan Function
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }

  inputLoanAmount.value = '';
});

//Closing(Deleting) an account Function
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    //Find username within the accounts and return it's index and remove the user using the splice method at that index
    //console.log('Deletion in progress...');
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);

    //After deletion, hide UI
    containerApp.style.opacity = 0;

    //Empty fields
    inputCloseUsername.value = inputClosePin.value = '';
  }
});

//Sorting indication function
//Indicates if array is sorted or not
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

//Get date and display it
const now = new Date();
const day = `${now.getDate()}`.padStart(2, 0);
const month = `${now.getMonth() + 1}`.padStart(2, 0);
const year = now.getFullYear();
const hour = now.getHours();
const minute = now.getMinutes();
labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minute}`;

//labelBalance.addEventListener('click', function () {
//  const movementsUI = Array.from(
//    document.querySelectorAll('.movements_value'),
//    el => Number(el.textContent.replace('€', ''))
//  );
//
//  console.log(movementsUI);
//
//  const movementsUI2 = [...document.querySelectorAll('.movements_value')];
//});

/*----------------------------------------------------------------*/
//Function calls and login For Testing

currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;

//displayMovements(account1.movements);
//createUsername(accounts);
//console.log(accounts);
//calcDisplayBalance(account1.movements);
//calcDisplaySummary(account1.movements);
