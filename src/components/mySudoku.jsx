import React, { useState } from "react";

export default function SudokuSolver() {
  const [grid, setGrid] = useState(
    Array.from({ length: 9 }, () => Array(9).fill(0))
  );
  const [solving, setSolving] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [showSteps, setShowSteps] = useState(false);

  // Load JSON file for different difficulty levels
  async function loadSudokuGrids(difficulty) {
    try {
      const response = await fetch('../sudokuGrids.json');
      const data = await response.json();
      const grids = data[difficulty];
      const randomGrid = grids[Math.floor(Math.random() * grids.length)];
      setGrid(randomGrid);
    } catch (error) {
      console.error("Error loading Sudoku grids:", error);
    }
  }

  // Handle input change in each grid cell
  function handleChange(row, col, value) {
    const updatedGrid = [...grid];
    updatedGrid[row][col] = value;
    setGrid(updatedGrid);
  }

  // Sudoku solving with or without steps visualization
  async function solveSudoku() {
    const solvedGrid = [...grid];
    if (showSteps) {
      setSolving(true);
      const solved = await solveWithVisualization(solvedGrid);
      setSolving(false);
      if (!solved) {
        alert("No solutions exist.");
      }
    } else {
      if (solve(solvedGrid)) {
        setGrid(solvedGrid);
      } else {
        alert("No solutions exist.");
      }
    }
  }

  // Delay function for visualization
  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Solve with visualization using async/await for step-by-step updates
  async function solveWithVisualization(grid) {
    const emptyPos = findEmptyPos(grid);
    if (!emptyPos) {
      return true;
    }

    const [row, col] = emptyPos;

    for (let num = 1; num <= 9; num++) {
      if (isValidMove(grid, row, col, num)) {
        grid[row][col] = num;
        setGrid([...grid]);

        // Add delay to simulate visualization
        await delay(speed);

        if (await solveWithVisualization(grid)) {
          return true;
        }

        grid[row][col] = 0; // Backtrack
        setGrid([...grid]);

        // Add delay for the backtracking step as well
        await delay(speed);
      }
    }
    return false;
  }

  // Backtracking algorithm without visualization
  function solve(grid) {
    const emptyPos = findEmptyPos(grid);
    if (!emptyPos) {
      return true;
    }

    const [row, col] = emptyPos;

    for (let num = 1; num <= 9; num++) {
      if (isValidMove(grid, row, col, num)) {
        grid[row][col] = num;

        if (solve(grid)) {
          return true;
        }

        grid[row][col] = 0; // Backtrack
      }
    }
    return false;
  }

  // Helper functions for validation and empty cell search
  function isValidMove(grid, row, col, num) {
    return (
      !usedInRow(grid, row, num) &&
      !usedInColumn(grid, col, num) &&
      !usedInBox(grid, row - (row % 3), col - (col % 3), num)
    );
  }

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

  // Function to refresh the page
  function refreshPage() {
    window.location.reload();
  }

  return (
    <div className="sudoku-solver">
      <h1>Sudoku Solver</h1>
      <h2>You can change the values.</h2>
      <div className="sudoku-grid">
        {grid.length > 0 &&
          grid.map((row, rowIndex) => (
            <div key={rowIndex} className="sudoku-row">
              {row.map((cell, colIndex) => (
                <input
                  key={colIndex}
                  data-row={rowIndex}
                  data-col={colIndex}
                  className="cell"
                  type="number"
                  min="1"
                  max="9"
                  value={cell === 0 ? "" : cell}
                  onChange={(e) =>
                    handleChange(
                      rowIndex,
                      colIndex,
                      parseInt(e.target.value) || 0
                    )
                  }
                />
              ))}
            </div>
          ))}
      </div>
      <div className="controls">
        <button onClick={() => loadSudokuGrids("easy")}>Easy</button>
        <button onClick={() => loadSudokuGrids("medium")}>Medium</button>
        <button onClick={() => loadSudokuGrids("hard")}>Hard</button>
        <button onClick={solveSudoku}>Solve Sudoku</button>
        <button onClick={refreshPage}>Refresh</button>
        <label>
  Speed:
  <input
    type="range"
    min="100"
    max="1000"
    step="100"
    value={1000 - speed} // Invert the speed value
    onChange={(e) => setSpeed(1000 - Number(e.target.value))} 
  />
</label>

        <label>
          <input
            type="checkbox"
            checked={showSteps}
            onChange={() => setShowSteps(!showSteps)}
          />
          Show Steps
        </label>
      </div>
    </div>
  );
}
