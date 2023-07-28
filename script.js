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

    return { getActivePlayer, switchPlayerTurn };
})();

const screenController = (function () {
    const board = gameBoard.getBoard();
    const playerTurn = document.querySelector(".turn");
    playerTurn.textContent = `${gameController.getActivePlayer().name}'s turn...`;

    function clickHandlerBoard(e) {
        const activePlayer = gameController.getActivePlayer();
        const selectedColumn = e.target.dataset.column;

        // Make sure I've clicked a cell and not the gaps in between
        if (!selectedColumn) return;

        // Prevents switching players if I click on a cell that already have a mark
        if (board[selectedColumn] !== "") return;

        // Drop a player's X/O token on the board
        gameBoard.dropToken(selectedColumn, activePlayer.token);

        const updateScreen = () => {
            // Clear the board container
            boardDiv.textContent = "";
            // Print the newest version of the board
            gameBoard.printGameBoard();
            // Update player's turn on each click
            playerTurn.textContent = `${gameController.getActivePlayer().name}'s turn...`;
        };

        gameController.switchPlayerTurn();
        updateScreen();
    }

    boardDiv.addEventListener("click", clickHandlerBoard);
})();
