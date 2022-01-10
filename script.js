'use strict';
const poll = {
  question: 'What is your favorite programming language?',
  options: ['0: JavaScript', '1: Python', '2: Rust', '3: C++'],

  answers: new Array(4).fill(0),
};

poll.registerNewAnswer = document
  .querySelector('.poll')
  .addEventListener('click', function () {
    let answer = -1;
    while (answer > 3 || answer < 0) {
      answer = prompt(
        'What is your favorite programming language?\n0: JavaScript\n1: Python\n2: Rust\n3: C++\n(write option number)'
      );
    }
    if (answer == 0) {
      poll.answers[0]++;
    } else if (answer == 1) {
      poll.answers[1]++;
    } else if (answer == 2) {
      poll.answers[2]++;
    } else if (answer == 3) {
      poll.answers[3]++;
    }
    //console.log(answer);
    poll.displayResults();
    //poll.displayResults('string');
    //poll.displayResults('array');
  });

poll.displayResults = function () {
  let type = prompt('Enter type\nString or array.');
  if (type === 'array') {
    console.log(this.answers);
  } else if (type == 'string') {
    console.log(...this.answers);
  }
};
