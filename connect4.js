/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])
let gameOver = false;

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

const makeBoard = () => {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  let rowArray = []
  for (let i = 0; i < HEIGHT; i++) {
    for (let j = 0; j < WIDTH; j++) {
      rowArray.push(null);
    }
    board.push(rowArray);
    rowArray = [];
  }
}


/** makeHtmlBoard: make HTML table and row of column tops. */

const makeHtmlBoard = () => {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.querySelector('#board');
  // TODO: add comment for this code
  // this portion of the code creates the row at the top of the table
  // where the player clicks and a piece is added to the board. It
  // also sets the id of the element, and adds an event listener to 
  // determine what happens when a "td" is clicked.
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  //this portion of code creates the individual cells that are added to
  // the above "tr". When these are clicked, the game pieces will fall into
  // place, provided there is space for them. Each cell is appended to the "top" row.
  // Lastly, we append the row with all of its cells to the gameboard.
  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // TODO: add comment for this code
  // here, we iterate through and create six (or HEIGHT) rows
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    // here we create the cells that are then added to each row,
    // similar to what was done on the clickable row above. We then
    // append each cell to the row.
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      cell.style.backgroundColor = 'dodgerblue';
      row.append(cell);
    }
    // After a full turn through each inner loop, we append the row (with its cells) to the game board.
    htmlBoard.append(row);
  };
};

// This function is used to dynamically add a class to the piece
// depending on what row it is in. This determines the starting
// "top" position of the piece, which later plays a part in its
// falling animation to its resting position.
const addClass = (coord) => {
  switch(coord) {
    case null:
      return 'zero';
    case 1:
      return 'one';
    case 2:
      return 'two';
    case 3:
      return 'three';
    case 4:
      return 'four';
    case 5:
      return 'five';
  };
};
/** findSpotForCol: given column x, return top empty y (null if filled) */

const findSpotForCol = (x) => {
  // TODO: write the real version of this, rather than always returning 0
  let columns = document.querySelectorAll('td');
  columns = Array.from(columns)
  .filter(item => item.id.length === 3)
  .filter(item => item.id.split('-')[1] === `${x}`)
  .filter(item => item.childElementCount === 0);
  return columns.length === 0 ? null : columns.length - 1;
}

/** placeInTable: update DOM to place piece into HTML table of board */

const placeInTable = (y, x) => {
  // TODO: make a div and insert into correct table cell
  let chip = document.createElement('div');
  chip.classList.add('piece');
  chip.classList.add(addClass(y));
  currPlayer === 1 ? chip.classList.add('red') : chip.classList.add('blue');
  let correctSpot = document.getElementById(`${y}-${x}`);
  correctSpot.append(chip);
  // I learned that transitions to dynamically appended DOM elements will
  // not work due to something called browser batching. Using set timeout
  // allows a delay in adding the class to another batch, this giving us
  // the transition effect.
  setTimeout(() => {
    chip.classList.add('lower');
  },10);
};

/** endGame: announce game end */

const endGame = (msg) => {
  // TODO: pop up alert message
  const messageDiv = document.querySelector('.message');
  let counter = 0;
  messageDiv.innerText = msg;
  const flashingMessage = setInterval(() => {
    messageDiv.style.display = 'block';
    setTimeout(() => {
      messageDiv.style.display = 'none';
    },500)
    counter++
    if (counter === 5) {
      clearInterval(flashingMessage);
    }
  },1000);
};

/** handleClick: handle click of column top to play piece */

const handleClick = (evt) => {
  if (!gameOver) {
    // get x from ID of clicked cell
    const x = +evt.target.id;
    
    // get next spot in column (if none, ignore click)
    const y = findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    // TODO: add line to update in-memory board
    if (!gameOver) {
      placeInTable(y, x);
      board[y][x] = currPlayer;
    }
    
    // check for win
    if (checkForWin()) {
      gameOver = true;
      return endGame(`Player ${currPlayer} won!`);
    }

    // check for tie
    // TODO: check if all cells in board are filled; if so call, call endGame
    let allSpacesFilled = board.every(row => row.every(cell => cell !== null));
    if (allSpacesFilled) {
      gameOver = true;
      return endGame('You Tied!!!');
    };
    // switch players
    // TODO: switch currPlayer 1 <-> 2
    currPlayer = currPlayer === 1 ? 2 : 1;
  }
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

const checkForWin = () => {
  const _win = (cells) => {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.
  // Here we are looping through each cell in the game board and creating
  // arrays of the possible winning combinations for a vertical win, horizontal
  // win, etc. So, with diagonal left, [y+1, x-1] means to go up a row and back a
  // column. Now that we have these combinations, we call _win on each one, each
  // time through the loop. If any one of them returns as true, we know that the 
  // game has been won, because the _win function assures that every subarray 
  // falls within the legal bounds of the game, and that each [y][x] coordinate in
  // the in-memory game board belongs to the current player.
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
