document.addEventListener('DOMContentLoaded', () => {
    const backgroundMusic = document.getElementById('background-music');
    const moveSound = document.getElementById('move-sound');
    const playButton = document.getElementById('play-button');
    const playAgainButton = document.getElementById('play-again-button');

    if (playButton) {
        playButton.addEventListener('click', () => {
            // Hide splash screen and show game container
            document.getElementById('splash-screen').style.display = 'none';
            document.getElementById('game-container').style.display = 'block';
            
            // Start background music
            backgroundMusic.play().catch(error => {
                console.error('Failed to play background music:', error);
            });
            
            // Initialize the game
            setGame();
        });
    } else {
        console.error('Play button element not found.');
    }

    // Enter to play again
    if (playAgainButton) {
        playAgainButton.addEventListener('click', () => {
            document.getElementById('game-over-screen').style.display = 'none';
            document.getElementById('board').style.display = 'flex'; // Show the game board
            resetGame(); // Reset the game
        });
    } else {
        console.error('Play Again button element not found.');
    }

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Enter') {
            if (document.getElementById('game-over-screen').style.display === 'flex') {
                playAgainButton.click(); // Simulate click on Play Again button
            }
        }
    });
    function playMoveSound() {
        moveSound.currentTime = 0; // Rewind to the start
        moveSound.play();
    }
});
//for phone players
document.addEventListener('touchstart', (e) => {
    // Handle touch input
});

let startX, startY;

document.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    startX = touch.pageX;
    startY = touch.pageY;
});

document.addEventListener('touchend', (e) => {
    const touch = e.changedTouches[0];
    const endX = touch.pageX;
    const endY = touch.pageY;

    const diffX = endX - startX;
    const diffY = endY - startY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (diffX > 0) {
            slideRight(); // Swipe right
        } else {
            slideLeft(); // Swipe left
        }
    } else {
        // Vertical swipe
        if (diffY > 0) {
            slideDown(); // Swipe down
        } else {
            slideUp(); // Swipe up
        }
    }

    setRandomElement(); // Add a new element after the move
});


let board;
let score = 0;
const rows = 5;
const columns = 5;

function setGame() {
    board = Array.from({ length: rows }, () => Array(columns).fill(''));
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = ''; // Clear existing tiles

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            const tile = document.createElement('div');
            tile.id = `${r}-${c}`;
            tile.className = 'tile';
            boardElement.appendChild(tile);
        }
    }

    setRandomElement();
    setRandomElement();
}

function mergeElements(element1, element2) {
    let newElement = null;

    switch (element1 + '+' + element2) {
        case 'water+water':
            newElement = 'sea';
            break;
        case 'fire+fire':
            newElement = 'flame';
            break;
        case 'air+air':
            newElement = 'wind';
            break;
        case 'earth+earth':
            newElement = 'rock';
            break;

        case 'sea+sea':
            newElement = 'ocean';
            break;
        case 'flame+flame':
            newElement = 'inferno';
            break;
        case 'wind+wind':
            newElement = 'hurricane';
            break;
        case 'rock+rock':
            newElement = 'mountain';
            break;

        case 'ocean+mountain':
        case 'mountain+ocean':
            newElement = 'island';
            break;

        case 'ocean+hurricane':
        case 'hurricane+ocean':
            newElement = 'tsunami';
            break;

        case 'hurricane+inferno':
        case 'inferno+hurricane':
            newElement = 'desert';
            break;

        case 'mountain+inferno':
        case 'inferno+mountain':
            newElement = 'earthquake';
            break;

        case 'island+desert':
        case 'desert+island':
            newElement = 'continent';
            break;
        case 'earthquake+tsunami':
        case 'tsunami+earthquake':
            newElement = 'tectonicsurge';

        case 'continent+tectonicsurge':
        case 'tectonicsurge+continent':
            newElement = 'world';

       
    }

    return newElement;
}

function slide(row) {
    let newRow = filterZero(row.slice());
    for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] !== '' && newRow[i + 1] !== '') {
            let merged = mergeElements(newRow[i], newRow[i + 1]);
            if (merged) {
                newRow[i] = merged;
                newRow[i + 1] = '';
                score += getElementScore(merged);
            }
        }
    }
    newRow = filterZero(newRow);
    while (newRow.length < columns) {
        newRow.push('');
    }
    return newRow;
}

function getElementScore(element) {
    const scores = {
        'sea': 10,
        'flame': 10,
        'wind': 10,
        'rock': 10,
        'ocean': 20,
        'inferno': 20,
        'hurricane': 20,
        'mountain': 20,
        'island': 50,
        'tsunami': 50,
        'desert': 50,
        'earthquake': 50,
        'continent': 100,
        'tectonicsurge': 100,
        'world': 200
    };
    return scores[element] || 0;
}

function hasEmptyTile() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] === '') {
                return true;
            }
        }
    }
    return false;
}

function setRandomElement() {
    if (!hasEmptyTile()) {
        return;
    }
    let found = false;
    while (!found) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        if (board[r][c] === '') {
            let elements = ['fire', 'water', 'earth', 'air', 'sea', 'flame', 'rock', 'wind'];
            board[r][c] = elements[Math.floor(Math.random() * elements.length)];
            let tile = document.getElementById(`${r}-${c}`);
            updateTile(tile, board[r][c], true);
            found = true;
        }
    }
}

document.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowLeft') {
        slideLeft();
        setRandomElement();
    } else if (e.code === 'ArrowRight') {
        slideRight();
        setRandomElement();
    } else if (e.code === 'ArrowUp') {
        slideUp();
        setRandomElement();
    } else if (e.code === 'ArrowDown') {
        slideDown();
        setRandomElement();
    }
    document.getElementById('score').innerText = score;

    if (checkWin()) {
        setTimeout(displayGameOverScreen, 100); // Show win screen
    } else if (isGameOver()) {
        setTimeout(displayGameOverScreen, 100); // Show game over screen
    }
});

function slideLeft() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row = slide(row);
        board[r] = row;
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(`${r}-${c}`);
            let element = board[r][c];
            updateTile(tile, element);
            playMoveSound();
        }
    }
}

function slideRight() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row.reverse();
        row = slide(row);
        row.reverse();
        board[r] = row;
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(`${r}-${c}`);
            let element = board[r][c];
            updateTile(tile, element);
            playMoveSound();
        }
    }
}

function slideUp() {
    for (let c = 0; c < columns; c++) {
        let column = [];
        for (let r = 0; r < rows; r++) {
            column.push(board[r][c]);
        }
        column = slide(column);
        for (let r = 0; r < rows; r++) {
            board[r][c] = column[r];
            let tile = document.getElementById(`${r}-${c}`);
            let element = board[r][c];
            updateTile(tile, element);
            playMoveSound();
        }
    }
}

function slideDown() {
    for (let c = 0; c < columns; c++) {
        let column = [];
        for (let r = 0; r < rows; r++) {
            column.push(board[r][c]);
        }
        column.reverse();
        column = slide(column);
        column.reverse();
        for (let r = 0; r < rows; r++) {
            board[r][c] = column[r];
            let tile = document.getElementById(`${r}-${c}`);
            let element = board[r][c];
            updateTile(tile, element);
            playMoveSound();
        }
    }
}

function filterZero(row) {
    return row.filter(element => element !== '');
}

function isGameOver() {
    if (checkWin()) {
        return false; // Game is not over, show win screen
    }
    if (hasEmptyTile()) {
        return false;
    }
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let element = board[r][c];
            if ((c < columns - 1 && mergeElements(element, board[r][c + 1])) ||
                (r < rows - 1 && mergeElements(element, board[r + 1][c]))) {
                return false;
            }
        }
    }
    return true; // Game over
}

function checkWin() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] === 'world') {
                return true; // Win condition met
            }
        }
    }
    return false; // Win condition not met
}

function resetGame() {
    score = 0;
    document.getElementById('score').innerText = score;
    document.getElementById('board').innerHTML = '';
    setGame();
}

function playMoveSound() {
    const sound = document.getElementById('move-sound');
    sound.currentTime = 0; // Rewind to the start
    sound.play();
}

function updateTile(tile, element, isNew = false) {
    tile.innerText = ""; // Remove any text content
    tile.classList.value = ""; // Clear existing classes
    tile.classList.add("tile");

    if (element) {
        tile.style.backgroundImage = `url('assets/images/${element}.png')`; 
        tile.style.backgroundSize = 'cover';
        tile.style.backgroundPosition = 'center';
        tile.style.backgroundRepeat = 'no-repeat';
        tile.classList.add(element); 

        if (isNew) {
            tile.classList.add("tile-spawn"); // Animation for spawning
            setTimeout(() => tile.classList.remove("tile-spawn"), 200);
        } else {
            tile.classList.add("tile-merge"); // Animation for merging
            setTimeout(() => tile.classList.remove("tile-merge"), 200);
        }
    } else {
        tile.style.backgroundImage = ''; // Clear background image if no element
    }
}

function displayGameOverScreen() {
    document.getElementById('game-over-screen').style.display = 'flex';
    document.getElementById('final-score').innerText = `Your Score: ${score}`;
    document.getElementById('board').style.display = 'none'; // Hide the game board
}


function enterFullscreen() {
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    }
}