"use strict";
const boardDiv = document.querySelector(".board-container");

// Create game board
const gameBoard = (function () {
    const board = ["", "", "", "", "", "", "", "", ""];

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
const gameController = ((playerOneName = "Player One", playerTwoName = "Player Two") => {
    const players = [
        { name: playerOneName, token: "X" },
        { name: playerTwoName, token: "O" },
    ];

    let activePlayer = players[0];

    const getActivePlayer = () => activePlayer;

    // PRINT NEW ROUND ("PLAYER X TURN) VAI AQUI

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    return { getActivePlayer, switchPlayerTurn };
})();

const screenController = (function () {
    const board = gameBoard.getBoard();

    function clickHandlerBoard(e) {
        const activePlayer = gameController.getActivePlayer();

        const selectedColumn = e.target.dataset.column;

        // Make sure I've clicked a cell and not the gaps in between
        if (!selectedColumn) return;

        // Prevents switching players if I click on a cell that already have a mark
        if (board[selectedColumn] !== "") return;

        gameBoard.dropToken(selectedColumn, activePlayer.token);

        const updateScreen = () => {
            // Clear the board container
            boardDiv.textContent = "";
            // Get the updated array containing the newest version of the board
            gameBoard.printGameBoard();
        };

        updateScreen();
        gameController.switchPlayerTurn();
    }

    boardDiv.addEventListener("click", clickHandlerBoard);
})();
