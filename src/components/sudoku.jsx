import React from "react";

export default function SudokuSolver() {
  const [grid, setGrid] = React.useState([
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
  ]);

  // Solve Sudoku Function
  function solveSudoku() {
    const solvedGrid = [...grid]; //Copying the grid for not mutating the original.
    if (solve(solvedGrid)) {
      setGrid(solvedGrid);
    } else {
      alert("No solutions exist.");
    }
  }

  // Backtracking Solver Function
  function solve(grid) {
    const emptyPos = findEmptyPos(grid);
    if (!emptyPos) {
      return true; // Puzzle Solved
    }

    const [row, col] = emptyPos;

    // Try numbers 1-9
    for (let num = 1; num <= 9; num++) {
      if (isValidMove(grid, row, col, num)) {
        // Try placing the number
        grid[row][col] = num;

        // Recursively solve
        if (solve(grid)) {
          return true;
        }

        // Backtrack
        grid[row][col] = 0;
      }
    }
    // No solution found
    return false;
  }

  // Function to find empty position
  function findEmptyPos(grid) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          return [row, col];
        }
      }
    }
    return null;
  }

  // Function to find if a move is valid
  function isValidMove(grid, row, col, num) {
    return (
      !usedInRow(grid, row, num) &&
      !usedInColumn(grid, col, num) &&
      !usedInBox(grid, row - (row % 3), col - (col % 3), num)
    );
  }

  // Helper functions for validation
  function usedInRow(grid, row, num) {
    return grid[row].includes(num);
  }

  function usedInColumn(grid, col, num) {
    for (let row = 0; row < 9; row++) {
      if (grid[row][col] === num) {
        return true;
      }
    }
    return false;
  }

  function usedInBox(grid, startRow, startCol, num) {
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (grid[row + startRow][col + startCol] === num) {
          return true;
        }
      }
    }
    return false;
  }

  // Function to handle changes in the Sudoku grid
  function handleChange(row, col, value) {
    const newGrid = [...grid];
    newGrid[row][col] = value;
    setGrid(newGrid);
  }

  return (
    <div className="sudoku-solver">
      <h1>Sudoku Solver</h1>
      <h2>You can change the values.</h2>
      <div className="sudoku-grid">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="sudoku-row">
            {row.map((cell, colIndex) => (
              <input
                key={colIndex}
                data-row={rowIndex}
                data-col={colIndex}
                className="cell"
                type="number"
                value={cell === 0 ? "" : cell}
                onChange={(e) =>
                  handleChange(
                    rowIndex,
                    colIndex,
                    parseInt(e.target.value, 10) || 0
                  )
                }
              />
            ))}
          </div>
        ))}
      </div>
      <button onClick={solveSudoku}>Solve Sudoku</button>
    </div>
  );
}
