document.addEventListener('DOMContentLoaded', function() {
    const board = document.getElementById('chessboard');
    const statusElement = document.getElementById('gameStatus');
    const queensCountElement = document.getElementById('queensCount');
    const checkButton = document.getElementById('checkButton');
    const clearButton = document.getElementById('clearButton');
    const hintButton = document.getElementById('hintButton');
    const solutionButton = document.getElementById('solutionButton');
    const solutionContainer = document.getElementById('solutionContainer');
    let queensPlaced = 0;
    const boardState = Array(8).fill().map(() => Array(8).fill(0));
    let attackedCells = new Set();
    let lastHintCell = null;
    
    // All 92 solutions to the 8 queens puzzle
    const solutions = [
        [0,4,7,5,2,6,1,3], [0,5,7,2,6,3,1,4], [0,6,3,5,7,1,4,2], [0,6,4,7,1,3,5,2],
        [1,3,5,7,2,0,6,4], [1,4,6,0,2,7,5,3], [1,4,6,3,0,7,5,2], [1,5,0,6,3,7,2,4],
        [1,5,7,2,0,3,6,4], [1,6,2,5,7,4,0,3], [1,6,4,7,0,3,5,2], [1,7,5,0,2,4,6,3],
        [2,0,6,4,7,1,3,5], [2,4,1,7,0,6,3,5], [2,4,1,7,5,3,6,0], [2,4,6,0,3,1,7,5],
        [2,4,7,3,0,6,1,5], [2,5,1,4,7,0,6,3], [2,5,1,6,0,3,7,4], [2,5,1,6,4,0,7,3],
        [2,5,3,0,7,4,6,1], [2,5,3,1,7,4,6,0], [2,5,7,0,3,6,4,1], [2,5,7,0,4,6,1,3],
        [2,5,7,1,3,0,6,4], [2,6,1,7,4,0,3,5], [2,6,1,7,5,3,0,4], [2,7,3,6,0,5,1,4],
        [3,0,4,7,1,6,2,5], [3,0,4,7,5,2,6,1], [3,1,4,7,5,0,2,6], [3,1,6,2,5,7,0,4],
        [3,1,6,2,5,7,4,0], [3,1,6,4,0,7,5,2], [3,1,7,4,6,0,2,5], [3,1,7,5,0,2,4,6],
        [3,5,0,4,1,7,2,6], [3,5,7,1,6,0,2,4], [3,5,7,2,0,6,4,1], [3,6,0,7,4,1,5,2],
        [3,6,2,7,1,4,0,5], [3,6,4,1,5,0,2,7], [3,6,4,2,0,5,7,1], [3,7,0,2,5,1,6,4],
        [3,7,0,4,6,1,5,2], [3,7,4,2,0,6,1,5], [4,0,3,5,7,1,6,2], [4,0,7,3,1,6,2,5],
        [4,0,7,5,2,6,1,3], [4,1,3,5,7,2,0,6], [4,1,3,6,2,7,5,0], [4,1,5,0,6,3,7,2],
        [4,1,7,0,3,6,2,5], [4,2,0,5,7,1,3,6], [4,2,0,6,1,7,5,3], [4,2,7,3,6,0,5,1],
        [4,6,0,2,7,5,3,1], [4,6,0,3,1,7,5,2], [4,6,1,3,7,0,2,5], [4,6,1,5,2,0,3,7],
        [4,6,1,5,2,0,7,3], [4,6,3,0,2,7,5,1], [4,7,3,0,2,5,1,6], [4,7,3,0,6,1,5,2],
        [5,0,4,1,7,2,6,3], [5,1,6,0,2,4,7,3], [5,1,6,0,3,7,4,2], [5,2,0,6,4,7,1,3],
        [5,2,0,7,3,1,6,4], [5,2,0,7,4,1,3,6], [5,2,4,6,0,3,1,7], [5,2,4,7,0,3,1,6],
        [5,2,6,1,3,7,0,4], [5,2,6,1,7,4,0,3], [5,2,6,3,0,7,1,4], [5,3,0,4,7,1,6,2],
        [5,3,1,7,4,6,0,2], [5,3,6,0,2,4,1,7], [5,3,6,0,7,1,4,2], [5,7,1,3,0,6,4,2],
        [6,0,2,7,5,3,1,4], [6,1,3,0,7,4,2,5], [6,1,5,2,0,3,7,4], [6,2,0,5,7,4,1,3],
        [6,2,7,1,4,0,5,3], [6,3,1,4,7,0,2,5], [6,3,1,7,5,0,2,4], [6,4,2,0,5,7,1,3],
        [7,1,3,0,6,4,2,5], [7,1,4,2,0,6,3,5], [7,2,0,5,1,4,6,3], [7,3,0,2,5,1,6,4]
    ];
    // Create the chess board
    function createBoard() {
        board.innerHTML = '';
        for (let row = 0; row < 8; row++) {
          for (let col = 0; col < 8; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.classList.add((row + col) % 2 === 0 ? 'white' : 'black');
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            cell.addEventListener('click', () => toggleQueen(row, col, cell));
            
            board.appendChild(cell);
          }
        }
      }

 // Toggle queen placement
 function toggleQueen(row, col, cell) {
    if (boardState[row][col] === 1) {
      // Remove queen
      boardState[row][col] = 0;
      cell.innerHTML = '';
      queensPlaced--;
      
      // Update attacked cells
      updateAttackedCells();
    } else {
      // Add queen if the cell is not under attack and we haven't placed 8 queens yet
      if (!attackedCells.has(`${row},${col}`) && queensPlaced < 8) {
        boardState[row][col] = 1;
        cell.innerHTML = '<span class="queen">♛</span>';
        queensPlaced++;
        
        // Update attacked cells
        updateAttackedCells();
      }
    }
    
    queensCountElement.textContent = queensPlaced;
    
    // Clear any previous status
    statusElement.textContent = '';
    statusElement.classList.remove('highlight', 'wrong');
    
    // Remove any previous hint
    if (lastHintCell) {
      lastHintCell.style.backgroundColor = '';
      lastHintCell = null;
    }
  }
  
  // Update the cells that are under attack
  function updateAttackedCells() {
    // Clear all attacked markers
    document.querySelectorAll('.attacked').forEach(cell => {
      cell.classList.remove('attacked');
    });
    
    // Recalculate attacked cells
    attackedCells = new Set();
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (boardState[row][col] === 1) {
          markAttackedCells(row, col);
        }
      }
    }
    
    // Visually mark attacked cells that don't have queens
    attackedCells.forEach(cellCoord => {
      const [r, c] = cellCoord.split(',').map(Number);
      if (boardState[r][c] === 0) {
        const cellIndex = r * 8 + c;
        const cell = board.children[cellIndex];
        cell.classList.add('attacked');
      }
    });
  }
  
  // Mark cells that are under attack from a queen at (row, col)
  function markAttackedCells(row, col) {
    // Mark all cells in the same row
    for (let c = 0; c < 8; c++) {
      if (c !== col) attackedCells.add(`${row},${c}`);
    }
    
    // Mark all cells in the same column
    for (let r = 0; r < 8; r++) {
      if (r !== row) attackedCells.add(`${r},${col}`);
    }
    
    // Mark all cells in diagonal top-left to bottom-right
    let r = row - 1;
    let c = col - 1;
    while (r >= 0 && c >= 0) {
      attackedCells.add(`${r},${c}`);
      r--;
      c--;
    }
    
    r = row + 1;
    c = col + 1;
    while (r < 8 && c < 8) {
      attackedCells.add(`${r},${c}`);
      r++;
      c++;
    }
    
    // Mark all cells in diagonal top-right to bottom-left
    r = row - 1;
    c = col + 1;
    while (r >= 0 && c < 8) {
      attackedCells.add(`${r},${c}`);
      r--;
      c++;
    }
    
    r = row + 1;
    c = col - 1;
    while (r < 8 && c >= 0) {
      attackedCells.add(`${r},${c}`);
      r++;
      c--;
    }
  }
  
  // Check if the current board is a valid solution
  function checkSolution() {
    if (queensPlaced !== 8) {
      statusElement.textContent = 'You need to place exactly 8 queens!';
      statusElement.classList.add('wrong');
      return false;
    }
    
    // Check if any queen is under attack
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (boardState[row][col] === 1) {
          // Temporarily remove this queen to check if it's under attack
          boardState[row][col] = 0;
          let tempAttacked = new Set();
          
          // Check all other queens
          for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
              if (boardState[r][c] === 1) {
                // Mark attacked cells from this queen
                markAttackedCellsTemp(r, c, tempAttacked);
              }
            }
          }
          
          // If the original position is attacked, the solution is invalid
          if (tempAttacked.has(`${row},${col}`)) {
            // Put the queen back
            boardState[row][col] = 1;
            statusElement.textContent = 'Invalid solution! Some queens are attacking each other.';
            statusElement.classList.add('wrong');
            return false;
          }
          
          // Put the queen back
          boardState[row][col] = 1;
        }
      }
    }
    
    statusElement.textContent = 'Congratulations! Valid solution found!';
    statusElement.classList.add('highlight');
    return true;
  }
  
  // Mark cells that are under attack (temporary version for solution checking)
  function markAttackedCellsTemp(row, col, attackedSet) {
    // Mark all cells in the same row
    for (let c = 0; c < 8; c++) {
      if (c !== col) attackedSet.add(`${row},${c}`);
    }
    
    // Mark all cells in the same column
    for (let r = 0; r < 8; r++) {
      if (r !== row) attackedSet.add(`${r},${col}`);
    }
    
    // Mark all cells in diagonal top-left to bottom-right
    let r = row - 1;
    let c = col - 1;
    while (r >= 0 && c >= 0) {
      attackedSet.add(`${r},${c}`);
      r--;
      c--;
    }
    
    r = row + 1;
    c = col + 1;
    while (r < 8 && c < 8) {
      attackedSet.add(`${r},${c}`);
      r++;
      c++;
    }
    
    // Mark all cells in diagonal top-right to bottom-left
    r = row - 1;
    c = col + 1;
    while (r >= 0 && c < 8) {
      attackedSet.add(`${r},${c}`);
      r--;
      c++;
    }
    
    r = row + 1;
    c = col - 1;
    while (r < 8 && c >= 0) {
      attackedSet.add(`${r},${c}`);
      r++;
      c--;
    }
  }
  
  // Clear the board
  function clearBoard() {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        boardState[row][col] = 0;
      }
    }
    
    // Remove all queen elements
    document.querySelectorAll('.queen').forEach(queen => {
      queen.parentElement.innerHTML = '';
    });
    
    // Remove attacked markers
    document.querySelectorAll('.attacked').forEach(cell => {
      cell.classList.remove('attacked');
    });
    
    attackedCells.clear();
    queensPlaced = 0;
    queensCountElement.textContent = queensPlaced;
    
    statusElement.textContent = '';
    statusElement.classList.remove('highlight', 'wrong');
    
    // Remove any previous hint
    if (lastHintCell) {
      lastHintCell.style.backgroundColor = '';
      lastHintCell = null;
    }
  }
  
  // Show a hint by highlighting a valid position
  function showHint() {
    // Get a random solution
    const solution = solutions[Math.floor(Math.random() * solutions.length)];
    
    // Find a position in the solution where the user hasn't placed a queen yet
    let hintFound = false;
    const possibleHints = [];
    
    for (let col = 0; col < 8; col++) {
      const row = solution[col];
      if (boardState[row][col] === 0 && !attackedCells.has(`${row},${col}`)) {
        possibleHints.push([row, col]);
      }
    }
    
    if (possibleHints.length > 0) {
      const [hintRow, hintCol] = possibleHints[Math.floor(Math.random() * possibleHints.length)];
      const cellIndex = hintRow * 8 + hintCol;
      lastHintCell = board.children[cellIndex];
      
      // Highlight the hint cell
      const originalColor = lastHintCell.classList.contains('white') ? '#f0d9b5' : '#b58863';
      lastHintCell.style.backgroundColor = '#90ee90'; // Light green hint
      
      // Reset hint after 2 seconds
      setTimeout(() => {
        if (lastHintCell) {
          lastHintCell.style.backgroundColor = '';
          lastHintCell = null;
        }
      }, 2000);
      
      hintFound = true;
    }
    
    if (!hintFound) {
      statusElement.textContent = 'No valid hint available. Try clearing some queens.';
      statusElement.classList.add('wrong');
    }
  }
  
  // Show a complete solution
  function showSolution() {
    clearBoard();
    
    // Pick a random solution
    const solution = solutions[Math.floor(Math.random() * solutions.length)];
    
    // Place queens according to the solution
    for (let col = 0; col < 8; col++) {
      const row = solution[col];
      const cellIndex = row * 8 + col;
      const cell = board.children[cellIndex];
      
      // Add queen
      boardState[row][col] = 1;
      cell.innerHTML = '<span class="queen">♛</span>';
      queensPlaced++;
    }
    
    // Update attacked cells visualization
    updateAttackedCells();
    
    queensCountElement.textContent = queensPlaced;
    statusElement.textContent = 'Solution displayed!';
    statusElement.classList.add('highlight');
  }
  
  // Show solution buttons
  function showSolutionButtons() {
    solutionContainer.innerHTML = '<h3>Try different solutions:</h3><div class="solution-grid"></div>';
    const grid = solutionContainer.querySelector('.solution-grid');
    
    for (let i = 1; i <= 10; i++) {
      const btn = document.createElement('button');
      btn.textContent = `Solution ${i}`;
      btn.classList.add('solution-button');
      btn.addEventListener('click', () => {
        clearBoard();
        
        // Place queens according to the solution
        const solution = solutions[i-1];
        for (let col = 0; col < 8; col++) {
          const row = solution[col];
          const cellIndex = row * 8 + col;
          const cell = board.children[cellIndex];
          
          // Add queen
          boardState[row][col] = 1;
          cell.innerHTML = '<span class="queen">♛</span>';
          queensPlaced++;
        }
        
        // Update attacked cells visualization
        updateAttackedCells();
        
        queensCountElement.textContent = queensPlaced;
        statusElement.textContent = `Solution ${i} displayed!`;
        statusElement.classList.add('highlight');
      });
      grid.appendChild(btn);
    }
  }
  
  // Add event listeners to buttons
  checkButton.addEventListener('click', checkSolution);
  clearButton.addEventListener('click', clearBoard);
  hintButton.addEventListener('click', showHint);
  solutionButton.addEventListener('click', () => {
    showSolution();
    showSolutionButtons();
  });
  
  // Initialize the game
  createBoard();
});