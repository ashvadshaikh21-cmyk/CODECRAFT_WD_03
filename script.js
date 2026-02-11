let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let mode = "player";

let xScore = 0;
let oScore = 0;
let drawScore = 0;

const boardElement = document.getElementById("board");
const statusElement = document.getElementById("status");

const winningConditions = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

function createBoard() {
    boardElement.innerHTML = "";
    board.forEach((cell, index) => {
        const cellDiv = document.createElement("div");
        cellDiv.classList.add("cell");
        cellDiv.innerText = cell;
        cellDiv.addEventListener("click", () => handleClick(index));
        boardElement.appendChild(cellDiv);
    });
}

function handleClick(index) {
    if (board[index] !== "" || !gameActive) return;

    board[index] = currentPlayer;
    updateGame();

    if (mode === "ai" && gameActive && currentPlayer === "O") {
        setTimeout(aiMove, 300);
    }
}

function updateGame() {
    createBoard();
    let winner = checkWinner();

    if (winner) {
        highlightWinning(winner);
        statusElement.innerText = `Player ${currentPlayer} Wins!`;
        updateScore(currentPlayer);
        gameActive = false;
        return;
    }

    if (!board.includes("")) {
        statusElement.innerText = "It's a Draw!";
        drawScore++;
        document.getElementById("drawScore").innerText = drawScore;
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusElement.innerText = `Player ${currentPlayer}'s Turn`;
}

function checkWinner() {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return condition;
        }
    }
    return null;
}

function highlightWinning(cells) {
    const allCells = document.querySelectorAll(".cell");
    cells.forEach(index => {
        allCells[index].classList.add("winning");
    });
}

function updateScore(player) {
    if (player === "X") {
        xScore++;
        document.getElementById("xScore").innerText = xScore;
    } else {
        oScore++;
        document.getElementById("oScore").innerText = oScore;
    }
}

/* ===== Minimax AI ===== */

function aiMove() {
    let bestMove = minimax(board, "O").index;
    board[bestMove] = "O";
    updateGame();
}

function minimax(newBoard, player) {
    let emptySpots = newBoard
        .map((val, idx) => val === "" ? idx : null)
        .filter(val => val !== null);

    if (checkWin(newBoard, "X")) return { score: -10 };
    if (checkWin(newBoard, "O")) return { score: 10 };
    if (emptySpots.length === 0) return { score: 0 };

    let moves = [];

    for (let i = 0; i < emptySpots.length; i++) {
        let move = {};
        move.index = emptySpots[i];
        newBoard[emptySpots[i]] = player;

        let result;
        if (player === "O") {
            result = minimax(newBoard, "X");
            move.score = result.score;
        } else {
            result = minimax(newBoard, "O");
            move.score = result.score;
        }

        newBoard[emptySpots[i]] = "";
        moves.push(move);
    }

    let bestMove;
    if (player === "O") {
        let bestScore = -10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = 10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

function checkWin(board, player) {
    return winningConditions.some(condition =>
        condition.every(index => board[index] === player)
    );
}

function restartGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;
    statusElement.innerText = "Player X's Turn";
    createBoard();
}

function setMode(selectedMode) {
    mode = selectedMode;
    restartGame();
}

statusElement.innerText = "Player X's Turn";
createBoard();
