/*
 * Create a list that holds all of your cards
 */

// creates an Array from a NodeList
const cards = Array.from(document.querySelectorAll('.card'));

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided 'shuffle' method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

const deck = document.querySelector('.deck');

shuffle(cards);
for(let i = 0; i < cards.length; i++) {
  deck.appendChild(cards[i]);
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * Variables, event listeners
 */

let opened = [];
let iClassListFirst;
let iClassListSecond;
let count = 0;
let countUp;

const resetButton = document.querySelector('.fa.fa-repeat');
const stars = Array.from(document.querySelectorAll('.fa-star'));
let timer = document.querySelector('.time');

deck.addEventListener('click', isCard);
resetButton.addEventListener('click', reset);

/*
 * Function passed to event listener checking if clicked element has class name of 'card', if so the code inside is executed
 *  - starts the timer only if class name is 'time'
 *  - starts every other function
 *  - check if the amount of *items* with class names 'card match' equals the amount of all cards
 *    if yes the game is finished
 */

function isCard(event) {
  if(event.target.className === 'card') {
    if(timer.className === 'time') {
      startTimer();
    }
    openCards(event.target);
    starRating();
    matching();
    const allGood = document.querySelectorAll('.card.match');
    if (allGood.length === 16) {
      setTimeout(finish, 500);
    }
  }
}

/*
 * Function that *opens* cards
 *  - puts up to 2 cards inside an array, so they can be compared
 *    after the 2nd card is inserted, it removes (pauses) the event listener,
 *    so no more cards can be clicked
 */

function openCards(card) {
  event.target.classList.add('open', 'show');
  if (typeof opened[0] === 'undefined') {
    opened[0] = card;
    iClassListFirst = opened[0].querySelector('.fa').classList;
  } else if (typeof opened[1] === 'undefined'){
    opened[1] = card;
    iClassListSecond = opened[1].querySelector('.fa').classList;
    deck.removeEventListener('click', isCard);
    counter();
  }
}

/*
 * Check makes sure that the array is filled with cards, if yes it compares their symbols
 */

function matching() {
  if(opened.length === 2) {
    if (iClassListFirst.value === iClassListSecond.value) {
      doMatch();
      } else {
        opened[0].classList.add('not-match'); // if cards didn't match,
        opened[1].classList.add('not-match'); // add to them 'not-match' class (bgcolor, shake animation)
        setTimeout(doNotMatch, 600); // delay so both cards get *opened* and animation can finish
      }
    }
}

/*
 * If cards match, this function is executed
 *  - remove/add proper classes, so the cards get matched
 *  - clear the array
 *  - readd the event listener
 */

function doMatch() {
  opened[0].classList.remove('open', 'show');
  opened[1].classList.remove('open', 'show');
  opened[0].classList.add('match');
  opened[1].classList.add('match');
  opened = [];
  deck.addEventListener('click', isCard);
}

/*
 * If cards don't match this function is executed
 *  - set class back to just 'card' and add class that animates the flip
 *  - delay allows the flip animation to play
 *    * set class back to just 'card'
 *    * clear the array
 *    * readd the event listener
 */

function doNotMatch() {
  opened[0].className = 'card';
  opened[1].className = 'card';
  opened[0].classList.add('flip-card');
  opened[1].classList.add('flip-card');

  setTimeout(function() {
    opened[0].className = 'card';
    opened[1].className = 'card';
    opened = [];
    deck.addEventListener('click', isCard);
  }, 200);
}

/*
 * Move counter
 */

function counter() {
  const moves = document.querySelector('.moves');
  count++;
  moves.textContent = count;
}

/*
 * Reset function:
 *  - stop and reset the timer
 *  - shuffle cards
 *    * reset them into default (closed) position
 *    * add them back to the page
 *  - add the event listener back
 *  - clear the array
 *  - reset move count
 *  - reset amount of displayed stars
 */

function reset() {
  stopTimer();
  timer.textContent = '0m 0s';
  shuffle(cards);
  for (let i = 0; i < cards.length; i++) {
    cards[i].className = 'card';
    deck.appendChild(cards[i]);
    }
  deck.addEventListener('click', isCard);
  opened = [];
  count = -1;
  counter();
  starRating();
}

/*
 * How many filled stars should be displayed based on amount of moves
 */

function starRating() {
  switch(count) {
    case 0:
        stars[2].className = 'fa fa-star';
        stars[1].className = 'fa fa-star';
        stars[0].className = 'fa fa-star';
        break;
    case 19:
        stars[2].className = 'fa fa-star-o';
        break;
    case 29:
        stars[1].className = 'fa fa-star-o';
  }
}

/*
 * Timer based on: https://stackoverflow.com/a/32307612
 */

function startTimer() {
  const start = Date.now();
  countUp = setInterval(function() {
    const elapsedTime = Math.floor((Date.now() - start) / 1000);
    const sec = elapsedTime % 60;
    const min = Math.floor(elapsedTime / 60);
    timer.textContent = min + 'm ' + sec + ' s';
  }, 1000);
  timer.classList.add('started');
}

function stopTimer() {
  clearInterval(countUp);
  timer.classList.remove('started');
}

/*
 * Completing the game launches this function
 *  - stops the timer so it can be displayed
 *  - stops the event listener
 *  - modal pops up with some stats
 */

function finish() {
  stopTimer();
  deck.removeEventListener('click', isCard);
  toggleModal();
}

/*
 * Modal based on https://sabe.io/tutorials/how-to-create-modal-popup-box
 * Events:
 *  - click play again
 *  - close modal by clicking 'close'
 */

const modal = document.querySelector(".modal");
const closeButton = document.querySelector(".close-button");
const againButton = document.querySelector('.again-button');

let starsFinal = document.querySelector('.star-rating');
let finishTime = document.querySelector('.finish-time');
let movesNum = document.querySelector('.moves-num');

function toggleModal() {
  modal.classList.toggle("show-modal");
  finishTime.textContent = timer.textContent;
  movesNum.textContent = count;
  starsFinal.innerHTML = document.querySelector('.stars').outerHTML;
}

againButton.addEventListener("click", function() {
  reset();
  toggleModal();
});

closeButton.addEventListener("click", toggleModal);
