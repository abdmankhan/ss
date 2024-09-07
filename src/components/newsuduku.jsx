import React from "react";

export default function SudokuSolver() {
  const [grid, setGrid] = React.useState([]);
  const [solving, setSolving] = React.useState(false);
  const [speed, setSpeed] = React.useState(500);
  const [showSteps, setShowSteps] = React.useState(true);

  // Load JSON file
  async function loadSudokuGrids(difficulty) {
    try {
      const response = await fetch("./sudokuGrids.json");
      const data = await response.json();
      const grids = data[difficulty];
      const randomGrid = grids[Math.floor(Math.random() * grids.length)];
      setGrid(randomGrid);
    } catch (error) {
      console.error("Error loading Sudoku grids:", error);
    }
  }

  // Other functions remain unchanged...

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
        <button onClick={() => setSolving(!solving)}>
          {solving ? "Stop" : "Visualize Solving"}
        </button>
        <label>
          Speed:
          <input
            type="range"
            min="100"
            max="1"
            step="100"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
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
