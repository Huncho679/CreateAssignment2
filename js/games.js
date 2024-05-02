// Function to close any open popups
function closeAllPopups() {
    const popups = document.querySelectorAll('.popup');
    popups.forEach(popup => {
        if (popup.classList.contains('show')) {
            popup.classList.remove('show');
        }
    });
}

// Modified function to show coin toss popup
function showCoinTossPopup() {
    closeAllPopups(); // Close any open popups first
    document.getElementById('coinPopup').classList.add('show');
}

// Modified function to show dice roll popup
function showDiceRollPopup() {
    closeAllPopups(); // Close any open popups first
    document.getElementById('dicePopup').classList.add('show');
}

// Modified function to show rock paper scissors popup
function showRPSPopup() {
    closeAllPopups(); // Close any open popups first
    document.getElementById('rpsPopup').classList.add('show');
}

// Function to close a specific popup by ID
function closePopup(popupId) {
    document.getElementById(popupId).classList.remove('show');
}


function tossCoins() {
    let numberOfCoins = document.getElementById('numCoins').value;
    numberOfCoins = parseInt(numberOfCoins, 10); // Ensure input is a number

    if (isNaN(numberOfCoins) || numberOfCoins < 1 || numberOfCoins > 5) {
        document.getElementById('coinTossResult').innerText = 'Please enter a valid number of coins (1-5).';
        return;
    }

    // Clear previous results
    const resultContainer = document.getElementById('coinTossResult');
    resultContainer.innerHTML = '';

    // Generate results and corresponding images
    for (let i = 0; i < numberOfCoins; i++) {
        const result = Math.random() < 0.5 ? 'heads' : 'tails';
        const coinImg = document.createElement('img');
        coinImg.src = `./images/${result}.jpg`;
        coinImg.alt = `${result.toUpperCase()}`;
        coinImg.style.width = '50px'; // Set the image size as needed
        resultContainer.appendChild(coinImg);
    }
}

function rollDice() {
    let numberOfDice = document.getElementById('numDice').value;
    numberOfDice = parseInt(numberOfDice, 10); // Ensure input is a number

    if (isNaN(numberOfDice) || numberOfDice < 1 || numberOfDice > 5) {
        document.getElementById('diceRollResult').innerText = 'Please enter a valid number of dice (1-5).';
        return;
    }

    // Clear previous results
    const resultContainer = document.getElementById('diceRollResult');
    resultContainer.innerHTML = '';

    // Generate results and corresponding images
    for (let i = 0; i < numberOfDice; i++) {
        const result = Math.floor(Math.random() * 6) + 1;
        const diceImg = document.createElement('img');
        diceImg.src = `./images/dice${result}.png`;
        diceImg.alt = `Dice showing ${result}`;
        diceImg.style.width = '50px'; // Set the image size as needed
        resultContainer.appendChild(diceImg);
    }
}

let player1Score = 0;
let player2Score = 0;
let gameTarget = 2;  // Default for best of 3

document.getElementById('gameMode').addEventListener('change', function() {
    gameTarget = this.value === 'bestOf3' ? 2 : 3;
    resetGame();
});

function playRPSGame() {
    const choices = ['rock', 'paper', 'scissors'];
    const player1Choice = choices[Math.floor(Math.random() * 3)];
    const player2Choice = choices[Math.floor(Math.random() * 3)];

    updateChoices(player1Choice, player2Choice);
    const result = determineWinner(player1Choice, player2Choice);
    updateScores(result);
    checkForWinner();
}

function updateChoices(player1Choice, player2Choice) {
    document.getElementById('player1Choice').src = `./images/${player1Choice}.jpg`;
    document.getElementById('player2Choice').src = `./images/${player2Choice}.jpg`;
}

function determineWinner(choice1, choice2) {
    if (choice1 === choice2) return 0;
    if ((choice1 === "rock" && choice2 === "scissors") ||
        (choice1 === "paper" && choice2 === "rock") ||
        (choice1 === "scissors" && choice2 === "paper")) {
        return 1;  // Player 1 wins
    } else {
        return -1; // Player 2 wins
    }
}

function updateScores(result) {
    if (result === 1) {
        player1Score++;
        document.getElementById('player1Score').textContent = player1Score;
    } else if (result === -1) {
        player2Score++;
        document.getElementById('player2Score').textContent = player2Score;
    }
}

function checkForWinner() {
    if (player1Score >= gameTarget || player2Score >= gameTarget) {
        let winner = player1Score >= gameTarget ? 'Player 1' : 'Player 2';
        setTimeout(function() {
            alert(`${winner} wins the game!`);
            resetGame();
        }, 800); 
    }
}

function resetGame() {
    player1Score = 0;
    player2Score = 0;
    document.getElementById('player1Score').textContent = '0';
    document.getElementById('player2Score').textContent = '0';
}

