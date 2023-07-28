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

    /*  This is where we would check for a winner and handle that logic,
        such as a win message. */
    // Create win conditions in the console version, and create a way to check if a win condition was met after each round.
    // acho que vai ter que pegar o board e verificar todo ele com o forEach a cada token adicionado.
    // verificar se houve win se preencher algum dos winning combos ou se é um tie com todos preenchidos...
    // lembrando que com todos preenchidos, na última preenchida, pode haver um jogador vencedor

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

        // Update player's turn on each click
        playerTurn.textContent = `${activePlayer.name}'s turn...`;

        // Drop a player's X/O token on the board
        gameBoard.dropToken(selectedColumn, activePlayer.token);

        // Clear the board container and print the newest version of the board
        const updateScreen = () => {
            boardDiv.textContent = "";
            gameBoard.printGameBoard();
        };

        updateScreen();
        gameController.switchPlayerTurn();
    }

    boardDiv.addEventListener("click", clickHandlerBoard);
})();
