"use strict";
const boardDiv = document.querySelector(".board-container");

// Create game board
const gameBoard = (function () {
    // Initialize the board (array) with 9 positions filled with ""
    const board = Array(9).fill("");

    const getBoard = () => board;

    const dropToken = (column, player) => {
        if (board[column] !== "") {
            return;
        }
        board[column] = player;
    };

    const printGameBoard = () => {
        board.forEach((item, index) => {
            const divCell = document.createElement("div");
            divCell.textContent = `${item}`;
            divCell.classList.add("cell");
            divCell.dataset.column = `${index}`; // Create a data attribute to identify the column on the board
            boardDiv.append(divCell);
        });
    };

    printGameBoard();

    return { getBoard, dropToken, printGameBoard };
})();

// Controls the flow and state of the game's turns,
// as well as whether anybody has won the game
const gameController = ((playerOneName = "Player X", playerTwoName = "Player O") => {
    const players = [
        { name: playerOneName, token: "X" },
        { name: playerTwoName, token: "O" },
    ];

    let activePlayer = players[0];

    const getActivePlayer = () => activePlayer;

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    // Define all possible winning combinations for the Tic Tac Toe game
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    // Handle the logic that checks for a winner or a tie
    const isThereAWinner = () => {
        // Get the current state of the game board
        const board = gameBoard.getBoard();

        // This function checks if either X/O marks has any of the winning combinations on the board
        const checkWinner = (mark) => {
            // Initialize a variable to keep track of whether there is a winning combination
            let winCombination = false;

            // Iterate over each combination in the winningCombinations array
            winningCombinations.forEach((combination) => {
                // Check if all positions in the combination are filled with the same mark
                const allPositionsMatch = combination.every((index) => board[index] === mark);
                // If all positions match, then there is a winning combination
                if (allPositionsMatch) {
                    winCombination = true;
                    // Add the "winning-cell" css class to the cells in the winning combination
                    combination.forEach((index) => boardDiv.childNodes[index].classList.add("winning-cell"));
                }
            });

            // Return true or false (whether there is a winning combination or not)
            return winCombination;
        };

        // Define a function to display the winner
        const displayWinnerMessage = (player) => {
            document.querySelector(".turn").textContent = `Player ${player} wins!`;
        };

        // Check if either player has won or if it's a tie
        switch (true) {
            case checkWinner("X"):
                displayWinnerMessage("X");
                return true;
            case checkWinner("O"):
                displayWinnerMessage("O");
                return true;
            case board.every((item) => item !== ""):
                document.querySelector(".turn").textContent = "It's a draw!";
                return true;
        }
    };

    return { getActivePlayer, switchPlayerTurn, isThereAWinner };
})();

const screenController = (function () {
    const board = gameBoard.getBoard();
    const playerTurn = document.querySelector(".turn");
    const playRestartButton = document.getElementById("play-restart-button");

    // Function to handle clicks on the game board
    function clickHandlerBoard(e) {
        const activePlayer = gameController.getActivePlayer();
        const selectedColumn = e.target.dataset.column;

        // Make sure I've clicked a cell and not the gaps in between
        if (!selectedColumn) return;

        // Prevents switching players if I click on a cell that already have a mark
        if (board[selectedColumn] !== "") return;

        // Drop a player's X/O token on the board
        gameBoard.dropToken(selectedColumn, activePlayer.token);

        // Switch to the other player's turn
        gameController.switchPlayerTurn();

        // Update the screen to reflect the new game state
        updateScreen();

        // Check if there is a winner
        // In case isThereAWinner() returns true, the game is over and the "click"
        // EventListener is removed, preventing interaction with the board
        if (gameController.isThereAWinner()) {
            boardDiv.removeEventListener("click", clickHandlerBoard);
        }
    }

    // Function to update the screen to reflect the current game state
    const updateScreen = () => {
        // Clear the board container
        boardDiv.textContent = "";
        // Print the newest version of the board
        gameBoard.printGameBoard();
        // Update player's turn on each click
        playerTurn.textContent = `${gameController.getActivePlayer().name}'s turn...`;

        // Give a specific color to each mark
        boardDiv.childNodes.forEach((item) => {
            if (item.textContent === "X") {
                item.classList.add("x-mark");
            } else {
                item.classList.add("o-mark");
            }
        });
    };

    // Function to reset the game state when the "Restart" button is clicked
    const resetGame = () => {
        if (playRestartButton.textContent === "RESTART") {
            // Clear all cells on the board container
            boardDiv.childNodes.forEach((cell) => {
                cell.textContent = "";
                cell.classList.remove("winning-cell");
            });

            // Clear the board array
            board.fill("");
        }
    };

    playRestartButton.addEventListener("click", () => {
        resetGame();
        playerTurn.textContent = `${gameController.getActivePlayer().name}'s turn...`;
        boardDiv.addEventListener("click", clickHandlerBoard);
        playRestartButton.textContent = "RESTART";
    });
})();
