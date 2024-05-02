// Sudoku board representation
let board = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
  ];
  
  // Function to generate a new Sudoku puzzle
  function generatePuzzle() {
    // Reset the board
    board = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
  
    // Generate a solved puzzle
    solveSudoku(board);
  
    // Remove some cells to create the puzzle
    let emptyCells = 64; // Adjust the number of empty cells to change the difficulty
    while (emptyCells > 0) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      if (board[row][col] !== 0) {
        board[row][col] = 0;
        emptyCells--;
      }
    }
  
    // Render the puzzle on the board
    renderBoard();
  }
  
  // Function to render the Sudoku board
  function renderBoard() {
    const sudokuBoard = document.getElementById('sudoku-board');
    sudokuBoard.innerHTML = '';
  
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.setAttribute('data-row', row);
        cell.setAttribute('data-col', col);
  
        if (board[row][col] !== 0) {
          cell.className += ' filled';
          cell.textContent = board[row][col];
        } else {
          cell.className += ' empty';
          cell.contentEditable = true; // Make the cell editable
          cell.addEventListener('input', handleCellInput); // Add event listener
        }
  
        sudokuBoard.appendChild(cell);
      }
    }
  }
  
  // Function to handle user input in the cells
  function handleCellInput(event) {
    const cell = event.target;
    const row = parseInt(cell.getAttribute('data-row'));
    const col = parseInt(cell.getAttribute('data-col'));
    const value = parseInt(cell.textContent) || 0; // Get the entered value, or 0 if empty
  
    // Check if the entered value is valid
    if (isValid(board, row, col, value)) {
      board[row][col] = value;
      cell.className = value !== 0 ? 'cell filled' : 'cell empty';
  
      // Check if the puzzle is solved
      if (isSolved(board)) {
        alert('Congratulations! You have solved the Sudoku puzzle!');
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => cell.classList.add('solved'));
      }
    } else {
      cell.textContent = '';
      board[row][col] = 0;
      cell.className = 'cell empty';
    }
  }
  
  // Backtracking algorithm to solve the Sudoku puzzle
  function solveSudoku(board) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(board, row, col, num)) {
              board[row][col] = num;
              if (solveSudoku(board)) {
                return true;
              }
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }
  
  // Function to check if a number is valid in a cell
  function isValid(board, row, col, num) {
    // Check the row
    for (let i = 0; i < 9; i++) {
      if (i !== col && board[row][i] === num) {
        return false;
      }
    }
  
    // Check the column
    for (let i = 0; i < 9; i++) {
      if (i !== row && board[i][col] === num) {
        return false;
      }
    }
  
    // Check the 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if ((boxRow + i) !== row && (boxCol + j) !== col && board[boxRow + i][boxCol + j] === num) {
          return false;
        }
      }
    }
  
    return true;
  }
  
  function isSolved(board) {
    // Check if all cells are filled with valid values
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0 || !isValid(board, row, col, board[row][col])) {
          return false;
        }
      }
    }
    return true;
  }
  
  // Event listener for the "New Game" button
  document.getElementById('new-game').addEventListener('click', generatePuzzle);
  
  // Generate the initial puzzle
  generatePuzzle();

  function showSudokuPopup() {
    document.getElementById('sudokuPopup').classList.add('show');
}

function closePopup(id) {
    document.getElementById(id).classList.remove('show');
}
