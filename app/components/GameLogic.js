export const initializeBoard = () => {
    const boardSize = 8;
    const board = Array(boardSize).fill(0).map(row => Array(boardSize).fill(0));
    for (let i = 0; i < boardSize; i++) {
        for (let j = (i + 1) % 2; j < boardSize; j += 2) {
            if (i < 3) board[i][j] = 1; // 1 for white piece
            else if (i > 4) board[i][j] = 2; // 2 for black piece
        }
    }
    return board;
};

export const isValidMove = (board, fromRow, fromCol, toRow, toCol, player) => {
    if (toRow < 0 || toRow >= 8 || toCol < 0 || toCol >= 8) return false; // Out of bounds
    
    const piece = board[fromRow][fromCol];
    if (piece === 0 || piece !== player && piece !== player + 2) return false; // Not the player's piece to move
    
    if (board[toRow][toCol] !== 0) return false; // Destination not empty
    
    const rowDiff = toRow - fromRow;
    const colDiff = toCol - fromCol;
    
    // Simple move
    if (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 1) return true;
    
    // Capture move
    if (Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 2) {
        if (isCaptureMove(board, fromRow, fromCol, toRow, toCol)) return true;
    }
    
    
    return false;
};


export const makeMove = (board, fromRow, fromCol, toRow, toCol) => {
const newBoard = board.map(row => [...row]);

newBoard[toRow][toCol] = newBoard[fromRow][fromCol];
newBoard[fromRow][fromCol] = 0;

if (isCaptureMove(board, fromRow, fromCol, toRow, toCol)) {
    const midRow = Math.floor((fromRow + toRow) / 2);
    const midCol = Math.floor((fromCol + toCol) / 2);
    newBoard[midRow][midCol] = 0;  // Remove the captured piece
}

// If a piece reaches the last row, promote it to a Queen
if (toRow === 0 && newBoard[toRow][toCol] === 2) newBoard[toRow][toCol] = 4;  // Black piece becomes Black Queen
if (toRow === 7 && newBoard[toRow][toCol] === 1) newBoard[toRow][toCol] = 3;  // White piece becomes White Queen

return newBoard;
};


export const isCaptureMove = (board, fromRow, fromCol, toRow, toCol) => {
    const midRow = Math.floor((fromRow + toRow) / 2);
    const midCol = Math.floor((fromCol + toCol) / 2);
    const capturedPiece = board[midRow][midCol];
    if (capturedPiece === 0 || capturedPiece === board[fromRow][fromCol] || capturedPiece === board[fromRow][fromCol] + 2) {
        return false;
    }
    return true;
};