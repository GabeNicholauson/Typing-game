'use strict';

import Score from './Score.js';

const startScreen = document.querySelector('.start-screen');
const playButton = document.querySelector('.play-button');
const restartButton = document.querySelector('.restart-button');
const game = document.querySelector('.game');
const end = document.querySelector('.end-screen');
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
const maxTime = 10;
let scores = [];
let chosenWord = '';
let points = 0;
let time = 0;

/************************
 * Event listeners
************************/
playButton.addEventListener('click', () => {
    startScreen.classList.add('hidden'); //hides start screen
    game.classList.remove('hidden'); //brings up game screen
});

restartButton.addEventListener('click', () => {
    resetGame();
});

playerInput.addEventListener('click', () => {
    startGame(...allWords);
    timer();

    let countTime = setInterval(function() { //does this function until told to stop
        timer();
        if (time === 0) {
            updateLeaderBoard();
            game.classList.add('hidden'); //hides game screen
            end.classList.remove('hidden'); //brings up end / leaderboard screen
            clearInterval(countTime); //stops counting
        }
    }, 1000); //every 1 second
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
    let randomWord = words[Math.floor(Math.random() * words.length)];
    currentWord.innerHTML = randomWord;
    chosenWord = randomWord;
}

function resetGame() {
    end.classList.add('hidden'); //hides end / leaderboard screen
    game.classList.remove('hidden'); //shows game screen
    currentWord.innerHTML = '';
    playerInput.value = 'Click here to start';
    points = -1; //resets points
    incrementPoints(); //brings the point counter to 0
}

function incrementPoints() {
    totalPoints.innerHTML = `Points: ${++points}`; //counts points accumulated
}

function verifyWord() {
    let word = chosenWord.split(''); //splits word into an array
    let inputLength = playerInput.value.length; //makes code more readable
    let wrongLet = false; //tracks if at least 1 letter is wrong

    for (let i = 0; i < inputLength; i++) {
        if (playerInput.value.charAt(i) !== word[i] && inputLength <= word.length) { //if the letters dont match
            wrongLet = true;
            word[i] = `<a class="wrong">${word[i]}</a>`; //highlights letter as wrong
            currentWord.innerHTML = word.join(''); //joins the letters together to form the word
        }
    }

    // if there are no wrong letter than the word wont have any highlited letters
    if (!wrongLet && inputLength <= word.length) currentWord.innerHTML = word.join('');

    if(playerInput.value === chosenWord) { //if the player has succesfully typed the word
        startGame(...allWords); //resets the text boxes
        incrementPoints(); //adds one point
    } 
}

function timer() { //tracks time remaining
    if (time === 0) time = maxTime + 1; //resets timer
    timeLimit.innerHTML = `Time left: ${--time}`; //counts time left by 1
}

function updateLeaderBoard() {
    const percentage = (points / allWords.length * 100).toPrecision(2); //gives the percentage of words typed
    const date = new Date().toString().substring(4, 15); // current date. Month/Day/Year
    const score = new Score(date, points, percentage); //creates the new score
    scores.push(score); // adds score to score array
    scores.sort(function compareFn(a, b) { //sorts the array in descending order
        if (a.hits > b.hits) return -1; //brings score foward if its better
        if (a.hits < b.hits) return 1; // moves score down if worse
        return 0; //if score is the same then order isn't changed
    });
    
    // creates the leaderboard table
    leaderboard.innerHTML = `<tr>
                                <th>Hits</th>
                                <th>Percentage</th>
                                <th>Date</th>
                            </tr>`;
    for (let i = 0; i < scores.length; i++) {
        leaderboard.innerHTML = leaderboard.innerHTML + 
                                `<tr>
                                    <td>${scores[i].hits}</td>
                                     <td>${scores[i].percentage}%</td>
                                    <td>${scores[i].date}</td>
                                <tr>`;
    }
}