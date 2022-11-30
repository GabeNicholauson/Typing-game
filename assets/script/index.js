'use strict';

import Score from './Score.js';

const playerInput = document.querySelector('.player-input');
const currentWord = document.querySelector('.current-word');
const totalPoints = document.querySelector('.points');
const timeLimit = document.querySelector('.timer');
const leaderboard = document.querySelector('.leaderboard');

const allWords = ['dinosaur', 'love', 'pineapple', 'calendar', 'robot', 'building', 'population',
'weather', 'bottle', 'history', 'dream', 'character', 'money', 'absolute',
'discipline', 'machine', 'accurate', 'connection', 'rainbow', 'bicycle',
'eclipse', 'calculator', 'trouble', 'watermelon', 'developer', 'philosophy',
'database', 'periodic', 'capitalism', 'abominable', 'component', 'future',
'pasta', 'microwave', 'jungle', 'wallet', 'canada', 'coffee', 'beauty', 'agency',
'chocolate', 'eleven', 'technology', 'alphabet', 'knowledge', 'magician',
'professor', 'triangle', 'earthquake', 'baseball', 'beyond', 'evolution',
'banana', 'perfumer', 'computer', 'management', 'discovery', 'ambition', 'music',
'eagle', 'crown', 'chess', 'laptop', 'bedroom', 'delivery', 'enemy', 'button',
'superman', 'library', 'unboxing', 'bookstore', 'language', 'homework',
'fantastic', 'economy', 'interview', 'awesome', 'challenge', 'science', 'mystery',
'famous', 'league', 'memory', 'leather', 'planet', 'software', 'update', 'yellow',
'keyboard', 'window'];
let scores = [];
let chosenWord = '';
let points = 0;
let time = 0;
const maxTime = 10;

/************************
 * Event listeners
************************/
playerInput.addEventListener('click', () => {
    resetPoints();
    startGame(...allWords);
    timer();

    let countTime = setInterval(function() {
        timer();
        if (time === 0) {
            updateLeaderBoard();
            clearInterval(countTime);
        }
    }, 1000)
});

playerInput.addEventListener('keyup', () => {
    verifyWord();
});

playerInput.addEventListener('keydown', () => {
    verifyWord();
});

/************************
 * Functions
************************/

function startGame(...words) {
    playerInput.value = '';
    let randomWord = words[randomNum(words.length)];
    currentWord.innerHTML = randomWord;
    chosenWord = randomWord;
}

function randomNum(arrLength) {
    return Math.floor(Math.random() * arrLength);
}

function verifyWord() {
    let word = chosenWord.split('');
    let wrongLet = false;
    for (let i = 0; i < playerInput.value.length; i++) {
        if (playerInput.value.charAt(i) !== word[i] && playerInput.value.length <= word.length) {
            wrongLet = true;
            word[i] = `<a class="wrong">${word[i]}</a>`;
            currentWord.innerHTML = word.join('');
        }
    }

    if (!wrongLet && playerInput.value.length <= word.length) currentWord.innerHTML = word.join('');

    if(playerInput.value === chosenWord) {
        startGame(...allWords);
        incrementPoints();
    } 
}

function incrementPoints() {
    totalPoints.innerHTML = `Points: ${++points}`;
}

function resetPoints() {
    points = -1;
    incrementPoints();
}

function timer() {
    if (time === 0) time = maxTime + 1;
    timeLimit.innerHTML = --time;
}

function updateLeaderBoard() {
    const percentage = (points / allWords.length * 100).toPrecision(2);
    const date = new Date().toString().substring(4, 15);
    const score = new Score(date, points, percentage);
    scores.push(score);
    scores.sort(function compareFn(a, b) {
        if (a.hits > b.hits) return 1;
        if (a.hits < b.hits) return -1;
        return 0;
    });
    
    leaderboard.innerHTML = '';
    for (let i = 0; i < scores.length; i++) {
        leaderboard.innerHTML = `<p>${scores[i].hits} / ${scores[i].percentage}% / ${scores[i].date}</p>` + leaderboard.innerHTML;
    }
}