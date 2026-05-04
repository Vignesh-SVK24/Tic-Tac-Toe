// Game State
let gameState = {
    currentScreen: 'home',
    mode: 'offline', // 'offline' or 'online'
    board: Array(9).fill(null),
    turn: 'X',
    players: {
        X: 'Player 1',
        O: 'Player 2'
    },
    mySymbol: 'X',
    roomCode: '',
    isGameOver: false,
    winner: null,
    scores: { matches: 0, draws: 0, myWins: 0, opponentWins: 0, myName: '', opponentName: '', p1Wins: 0, p2Wins: 0 }
};

let socket;

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    initDust();
    changeScreen('splash');
    
    // Simulate splash loading
    setTimeout(() => {
        changeScreen('home');
    }, 2000);
});

// Dust Particles
function initDust() {
    const app = document.getElementById('app');
    for (let i = 0; i < 15; i++) {
        const dust = document.createElement('div');
        dust.className = 'dust';
        dust.style.left = `${Math.random() * 100}%`;
        dust.style.top = `${Math.random() * 100}%`;
        dust.style.animationDelay = `${Math.random() * 10}s`;
        dust.style.opacity = Math.random() * 0.3;
        app.appendChild(dust);
    }
}

// Screen Management
function changeScreen(screenId) {
    gameState.currentScreen = screenId;
    const container = document.getElementById('screen-container');
    const template = document.getElementById(`tpl-${screenId}`);
    
    if (template) {
        container.innerHTML = '';
        container.appendChild(template.content.cloneNode(true));
        lucide.createIcons();
        
        // Post-render logic
        if (screenId === 'game') {
            updateBoardUI();
            updateScoreboardUI();
        }
    }
}

// Mode Selection
function setMode(mode) {
    gameState.mode = mode;
    if (mode === 'offline') {
        gameState.players = { X: 'Player 1', O: 'Player 2' };
        startGame();
    } else {
        changeScreen('online-lobby');
    }
}

// Game Logic
function startGame() {
    gameState.board = Array(9).fill(null);
    gameState.turn = 'X';
    gameState.isGameOver = false;
    gameState.winner = null;
    changeScreen('game');
    
    const roomInfo = document.getElementById('room-info');
    if (gameState.mode === 'online') {
        roomInfo.style.display = 'block';
        document.getElementById('display-room-code').innerText = gameState.roomCode;
        document.getElementById('p1-name').innerText = gameState.players.X;
        document.getElementById('p2-name').innerText = gameState.players.O;
    } else {
        roomInfo.style.display = 'none';
        document.getElementById('p1-name').innerText = 'Player 1';
        document.getElementById('p2-name').innerText = 'Player 2';
    }
    updateRoomPlayersUI();
}

function handleCellClick(index) {
    if (gameState.isGameOver || gameState.board[index]) return;
    
    if (gameState.mode === 'online') {
        if (gameState.players.O === 'Waiting...') return;
        if (gameState.turn !== gameState.mySymbol) return;
        socket.emit('make_move', { 
            roomCode: gameState.roomCode, 
            index: index, 
            symbol: gameState.mySymbol 
        });
    } else {
        makeMove(index, gameState.turn);
    }
}

function makeMove(index, symbol) {
    gameState.board[index] = symbol;
    updateBoardUI();
    
    const winnerData = checkWinner(gameState.board);
    if (winnerData) {
        if (gameState.mode === 'offline') {
            if (winnerData.winner === 'X') gameState.scores.p1Wins++;
            else gameState.scores.p2Wins++;
            gameState.scores.matches++;
        }
        endGame(winnerData);
    } else if (gameState.board.every(cell => cell !== null)) {
        if (gameState.mode === 'offline') {
            gameState.scores.draws++;
            gameState.scores.matches++;
        }
        endGame('draw');
    } else {
        gameState.turn = symbol === 'X' ? 'O' : 'X';
        updateTurnUI();
    }
}

function updateBoardUI() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, i) => {
        cell.innerText = gameState.board[i] || '';
        cell.className = 'cell' + (gameState.board[i] ? ` symbol-${gameState.board[i].toLowerCase()}` : '');
    });
    updateTurnUI();
}

function updateTurnUI() {
    const p1 = document.getElementById('p1-info');
    const p2 = document.getElementById('p2-info');
    if (p1 && p2) {
        p1.classList.toggle('active', gameState.turn === 'X');
        p2.classList.toggle('active', gameState.turn === 'O');
    }
}

function updateScoreboardUI() {
    const total = document.getElementById('total-matches');
    const xWins = document.getElementById('score-p1-wins');
    const oWins = document.getElementById('score-p2-wins');
    const draws = document.getElementById('score-draws');
    const p1Name = document.getElementById('score-p1-name');
    const p2Name = document.getElementById('score-p2-name');

    if (total) total.innerText = gameState.scores.matches || 0;
    if (draws) draws.innerText = gameState.scores.draws || 0;

    if (gameState.mode === 'online') {
        if (p1Name) p1Name.innerText = `YOU: ${gameState.scores.myName ? gameState.scores.myName.substring(0, 5) : 'P1'}`;
        if (xWins) xWins.innerText = gameState.scores.myWins || 0;
        
        if (p2Name) p2Name.innerText = gameState.scores.opponentName ? gameState.scores.opponentName.substring(0, 5) : 'Opp';
        if (oWins) oWins.innerText = gameState.scores.opponentWins || 0;
    } else {
        if (p1Name) p1Name.innerText = gameState.players.X ? gameState.players.X.substring(0, 5) : 'P1';
        if (xWins) xWins.innerText = gameState.scores.p1Wins || 0;
        if (p2Name) p2Name.innerText = gameState.players.O ? gameState.players.O.substring(0, 5) : 'P2';
        if (oWins) oWins.innerText = gameState.scores.p2Wins || 0;
    }
}

function updateRoomPlayersUI() {
    const list = document.getElementById('room-players-list');
    const sidebar = document.querySelector('.room-sidebar');
    if (!list) return;

    if (gameState.mode === 'online') {
        sidebar.style.display = window.innerWidth >= 900 ? 'block' : 'none';
        list.innerHTML = '';
        Object.keys(gameState.players).forEach(symbol => {
            const name = gameState.players[symbol];
            if (name && name !== 'Waiting...') {
                const div = document.createElement('div');
                div.className = 'player-entry';
                const isYou = symbol === gameState.mySymbol;
                div.innerText = isYou ? `YOU: ${name}` : `${name} (${symbol})`;
                list.appendChild(div);
            }
        });
    } else {
        sidebar.style.display = 'none';
    }
}

function checkWinner(board) {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
        [0, 4, 8], [2, 4, 6]             // diags
    ];
    for (let line of lines) {
        const [a, b, c] = line;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return { winner: board[a], line };
        }
    }
    return null;
}

function endGame(result) {
    gameState.isGameOver = true;
    
    // Highlight winning cells if not a draw
    if (result !== 'draw') {
        const cells = document.querySelectorAll('.cell');
        result.line.forEach(idx => cells[idx].classList.add('winning-cell'));
    }

    if (gameState.mode === 'online') {
        // Since we prevent double counting on server, we can just emit it
        socket.emit('game_ended', { roomCode: gameState.roomCode, result: result });
    }

    setTimeout(() => {
        changeScreen('results');
        const title = document.getElementById('result-text');
        const sub = document.getElementById('result-subtext');
        
        if (result === 'draw') {
            title.innerText = "It's a Draw!";
            sub.innerText = "Solid defense from both sides.";
        } else {
            const winnerName = gameState.mode === 'online' 
                ? (result.winner === 'X' ? gameState.players.X : gameState.players.O)
                : (result.winner === 'X' ? 'Player 1' : 'Player 2');
            title.innerText = `${winnerName} Wins!`;
            sub.innerText = "Masterfully played.";
        }
    }, 1000);
}

function restartGame() {
    if (gameState.mode === 'online') {
        socket.emit('request_restart', { roomCode: gameState.roomCode });
        const btn = document.getElementById('restart-btn');
        if (btn) {
            btn.innerText = 'Waiting...';
            btn.disabled = true;
        }
    } else {
        const tempName = gameState.players.X;
        gameState.players.X = gameState.players.O;
        gameState.players.O = tempName;
        startGame();
    }
}

function confirmQuit() {
    if (confirm('Are you sure you want to quit?')) {
        if (socket) socket.disconnect();
        changeScreen('home');
    }
}

// Online Functionality
function initSocket() {
    if (socket) return;
    // For local dev, use localhost. For production, use current window origin or environment variable.
    const serverUrl = window.location.hostname === 'localhost' ? 'http://localhost:3001' : window.location.origin;
    socket = io(serverUrl);

    socket.on('room_created', ({ roomCode, symbol }) => {
        gameState.roomCode = roomCode;
        gameState.mySymbol = symbol;
        gameState.players.X = document.getElementById('player-name-input').value || 'Player 1';
        gameState.players.O = 'Waiting...';
        startGame();
    });

    socket.on('room_joined', ({ roomCode, symbol, opponentName }) => {
        gameState.roomCode = roomCode;
        gameState.mySymbol = symbol;
        gameState.players.O = document.getElementById('player-name-input').value || 'Player 2';
        gameState.players.X = opponentName;
        startGame();
    });

    socket.on('player_joined', ({ players }) => {
        players.forEach(p => {
            gameState.players[p.symbol] = p.name;
        });
        if (gameState.currentScreen === 'game') {
            document.getElementById('p1-name').innerText = gameState.players.X;
            document.getElementById('p2-name').innerText = gameState.players.O;
            updateRoomPlayersUI();
            updateScoreboardUI();
        }
    });

    socket.on('move_made', ({ index, symbol, nextTurn }) => {
        gameState.board[index] = symbol;
        updateBoardUI();
        const winnerData = checkWinner(gameState.board);
        if (winnerData) endGame(winnerData);
        else if (gameState.board.every(c => c !== null)) endGame('draw');
        else {
            gameState.turn = nextTurn;
            updateTurnUI();
        }
    });

    socket.on('game_restarted', (data) => {
        if (data && data.players) {
            data.players.forEach(p => {
                if (p.id === socket.id) {
                    gameState.mySymbol = p.symbol;
                }
                gameState.players[p.symbol] = p.name;
            });
        }
        startGame();
    });

    socket.on('score_updated', ({ players, totalMatches }) => {
        gameState.scores.matches = totalMatches;
        players.forEach(p => {
            if (p.id === socket.id) {
                gameState.scores.myWins = p.wins;
                gameState.scores.draws = p.draws;
                gameState.scores.myName = p.name;
            } else {
                gameState.scores.opponentWins = p.wins;
                gameState.scores.opponentName = p.name;
            }
        });
        if (gameState.currentScreen === 'game') updateScoreboardUI();
    });

    socket.on('opponent_disconnected', () => {
        alert('Opponent disconnected');
        changeScreen('home');
    });

    socket.on('error', (msg) => alert(msg));
}

function createRoom() {
    const name = document.getElementById('player-name-input').value;
    if (!name) return alert('Please enter your name');
    initSocket();
    socket.emit('create_room', { playerName: name });
}

function joinRoom() {
    const name = document.getElementById('player-name-input').value;
    const code = document.getElementById('room-code-input').value;
    if (!name || !code) return alert('Please enter name and room code');
    initSocket();
    socket.emit('join_room', { roomCode: code, playerName: name });
}
