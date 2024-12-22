const board = document.getElementById('board');
const cols = 10; 
const minesPercentage = 0.25; 
const cells = [];
const mines = [];

function generateBoard() 
{
    board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    Array(cols * cols).fill().map((_, i) => 
    {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.row = Math.floor(i / cols);
        cell.dataset.col = i % cols;
        cell.addEventListener('click', handleClick);
        cell.addEventListener('contextmenu', placeflag);
        cells.push(cell);
        board.appendChild(cell);
    });
}

function placeMines(clickedRow, clickedCol) 
{
    const totalMines = Math.floor(cols * cols * minesPercentage);
    const possibleMines = Array(cols * cols).fill().map((_, index) => index).filter(index => index !== cols * clickedRow + clickedCol && !isMine(Math.floor(index / cols), index % cols));
  
    possibleMines.sort(() => 0.5 - Math.random()).slice(0, totalMines).forEach(index => {
        mines.push({ row: Math.floor(index / cols), col: index % cols });
    });
}

function isMine(row, col) 
{
    return mines.some(mine => mine.row === row && mine.col === col);
}

function countMines(row, col) 
{
    return [-1, 0, 1].reduce((count, i) =>
        count + [-1, 0, 1].reduce((subCount, j) =>
            subCount + (isMine(row + i, col + j) ? 1 : 0), 0), 0);
}

function openCell(row, col) 
{
    const cell = cells.find(cell => cell.dataset.row == row && cell.dataset.col == col);

    if (cell.classList.contains('opened')) return;

    cell.classList.add('opened');

    const adjacentMines = countMines(row, col);

    if (adjacentMines === 0) 
    {
        [-1, 0, 1].forEach(i =>
            [-1, 0, 1].forEach(j => 
                {
                const newRow = row + i;
                const newCol = col + j;
                if (newRow >= 0 && newRow < cols && newCol >= 0 && newCol < cols) 
                {
                    openCell(newRow, newCol);
                }
            })
        );
    }

    if (adjacentMines > 0) 
    {
        cell.textContent = adjacentMines;
        cell.classList.add('number');
    }
}

function handleClick(event) 
{
    if (document.getElementById('message').textContent) return; 
    const row = parseInt(event.target.dataset.row, 10);
    const col = parseInt(event.target.dataset.col, 10);

    if (isMine(row, col)) 
    {
        mines.forEach(mine => {
            const cell = cells.find(cell => cell.dataset.row == mine.row && cell.dataset.col == mine.col);
            cell.textContent = '💣'; 
            cell.classList.add('mine'); 
        });
        const messageDiv = document.getElementById('message');
        messageDiv.textContent = 'Игра окончена🙁! Вы наткнулись на мину💥';
        messageDiv.style.display = 'block';
    } else 
    {
        openCell(row, col);
        
        const ifWin = cells.every(cell => cell.classList.contains('opened') || isMine(parseInt(cell.dataset.row), parseInt(cell.dataset.col)));
        const allMinesFlagged = mines.every((mine) => {
            const flaggedCell = cells.find(
                (cell) => cell.dataset.row == mine.row && cell.dataset.col == mine.col
            );
            return (flaggedCell && flaggedCell.classList.contains('flag')) || (!flaggedCell && !isMine(mine.row, mine.col));
        });
        
        if (ifWin && allMinesFlagged) {
            const messageDiv = document.getElementById('message');
            messageDiv.textContent = 'Поздравляем! Вы выиграли😀';
            messageDiv.style.display = 'block';
        }
    }
}
function placeflag(event) 
{
    if (document.getElementById('message').textContent) return; 
    event.preventDefault();

    const row = parseInt(event.target.dataset.row, 10);
    const col = parseInt(event.target.dataset.col, 10);
    const cell = cells.find(cell => cell.dataset.row == row && cell.dataset.col == col);

    if (!cell.classList.contains('opened')) 
    {
        if (cell.classList.contains('flag')) 
        {
            cell.classList.remove('flag');
            cell.textContent = ''; 
        } else 
        {
            cell.classList.add('flag');
            cell.textContent = '🚩'; 
        }
        
        const ifWin = cells.every(cell => cell.classList.contains('opened') || isMine(parseInt(cell.dataset.row), parseInt(cell.dataset.col)));
        const allMinesFlagged = mines.every((mine) => {
            const flaggedCell = cells.find(
                (cell) => cell.dataset.row == mine.row && cell.dataset.col == mine.col
            );
            return (flaggedCell && flaggedCell.classList.contains('flag')) || (!flaggedCell && !isMine(mine.row, mine.col));
        });
        
        if (ifWin && allMinesFlagged) 
        {
            const messageDiv = document.getElementById('message');
            messageDiv.textContent = 'Поздравляем! Вы выиграли😀';
            messageDiv.style.display = 'block';
        }
    }
}
generateBoard();
placeMines(-1, -1); 


