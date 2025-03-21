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
    
    // Solutions to the 8 queens puzzle (first 10 of the 92 solutions)
    const solutions = [
      [0,4,7,5,2,6,1,3],
      [0,5,7,2,6,3,1,4],
      [0,6,3,5,7,1,4,2],
      [0,6,4,7,1,3,5,2],
      [1,3,5,7,2,0,6,4],
      [1,4,6,0,2,7,5,3],
      [1,4,6,3,0,7,5,2],
      [1,5,0,6,3,7,2,4],
      [1,5,7,2,0,3,6,4],
      [1,6,2,5,7,4,0,3]
    ];
    
});
