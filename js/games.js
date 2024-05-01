function showCoinTossPopup() {
    document.getElementById('coinPopup').classList.add('show');
}

function showDiceRollPopup() {
    document.getElementById('dicePopup').classList.add('show');
}

function showRPSPopup() {
    document.getElementById('rpsPopup').classList.add('show');
}

function closePopup(popupId) {
    document.getElementById(popupId).classList.remove('show');
}

function tossCoins() {
    let numberOfCoins = document.getElementById('numCoins').value;
    numberOfCoins = parseInt(numberOfCoins, 10); // Convert input to a number

    // Check for valid input
    if (isNaN(numberOfCoins) || numberOfCoins < 1 || numberOfCoins > 5) {
        document.getElementById('coinTossResult').innerText = 'Please enter a valid number of coins (1-5).';
        return;
    }

    // Perform the coin toss
    let results = [];
    for (let i = 0; i < numberOfCoins; i++) {
        results.push(Math.random() < 0.5 ? 'Heads' : 'Tails');
    }
    document.getElementById('coinTossResult').innerText = 'Results: ' + results.join(' ');
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

