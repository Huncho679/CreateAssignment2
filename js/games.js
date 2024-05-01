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
