window.Connect4Game = {
  // tells the game whose turn is it
  // 1 = BLUE Player, 2 = RED Player
  turn: 1, 
  // board is initially empty
  board: [],
  // tells the game whether or not the game is over, this will prevent any user from dropping coins in a column if set to true
  hasWon: false,
  startGame () {
    this.initializeBoard();
    this.renderBoard();
  },
  initializeBoard () {
    // initialize board to be 7 boxes wide, 6 boxes tall
    // all boxes will have a value of 0, meaning they're empty
    // if a 1 is inside a box, that means BLUE player's coin is in it
    // if a 2 is inside a box, that means RED player's coin is in it
    this.board = [
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0]
    ];
  },
  checkWinner () {
    const self = this;

    // For checking for horizontal connections, checking one row at a time from top to bottom, we check each box in each row one at a time, from left to right
    const checkHorizontals = function() {
      let count = 0;
      // for every row...
      for (let row = 0; row < self.board.length; row++) {
        count = 0;
        // check each box of current row
        for (let column = 0; column < self.board[row].length; column++) {
          // if the coin inside the current box belongs to the player whose turn it is...
          if (self.board[row][column] === self.turn) {
            // start counting... variable "count" will measure how long the connection is
            count++;
          } else {
            // if the coin inside the box does not belong to the player whose turn it is...
            // then reset variable "count" to zero, the connection is broken and start counting again
            count = 0;
          }
          // if connection remains unbroken and it reaches a length of at least 4, then player whose turn it is, wins
          if (count >= 4) {
            console.log(`${self.turn} wins!`)
            return true;
          }
        }
      }
      return false;
    }

    // For checking for vertical connections, checking one column at a time from left to right, we check each box in each column one at a time, from top to bottom
    const checkVerticals = function() {
      let count = 0;
      // for every row...
      for (let column = 0; column < self.board[0].length; column++) {
        count = 0;
        // check each box of current row
        for (let row = 0; row < self.board.length; row++) {
          // if the coin inside the current box belongs to the player whose turn it is...
          if (self.board[row][column] === self.turn) {
            // start counting... variable "count" will measure how long the connection is
            count++;
          } else {
            // if the coin inside the box does not belong to the player whose turn it is...
            // then reset variable "count" to zero, the connection is broken and start counting again
            count = 0;
          }
          if (count >= 4) {
            // if connection remains unbroken and it reaches a length of at least 4, then player whose turn it is, wins
            console.log(`${self.turn} wins!`)
            return true;
          }
        }
      }
      return false;
    }

    // For checking diagonal connections that go top-left to bottom-right, we must iterate through every box in the board...
    // ...and then using each box as a starting point, and start moving diagonally and check the coin inside each box
    const checkDiagonalsLeftToRight = function() {
      let count = 0;
      // for every row...
      for (let row = 0; row < self.board.length; row++) {
        // for every nox in that row
        for (let column = 0; column < self.board[row].length; column++) {
          count = 0;
          // start counting diagonally from starting point...
          // ...in this case, if starting point was Point(0,0), next point to check is Point(1,1)
          // traverse the board this way until you hit the border
          for (let row2 = row, column2 = column; row2 < self.board.length; row2++, column2++) {
            // continue the same logic from previous algorithms here...
            if (self.board[row2][column2] === self.turn) {
              count++;
            } else {
              count = 0;
            }
            if (count >= 4) {
              console.log(`${self.turn} wins!`)
              return true;
            }
          }
        }
      }
      return false;
    }
    
    // For checking diagonal connections that go top-right to bottom-left, it's almost exactly the same as the function checkDiagonalsLeftToRight()
    // BUT we start from the right side of the board, and we traverse to the bottom-left direction
    const checkDiagonalsRightToLeft = function() {
      let count = 0;
      for (let row = 0; row < self.board.length; row++) {
        for (let column = self.board[row].length; column >= 0; column--) {
          count = 0;
          for (let row2 = row, column2 = column; row2 < self.board.length; row2++, column2--) {
            if (self.board[row2][column2] === self.turn) {
              count++;
            } else {
              count = 0;
            }
            if (count >= 4) {
              console.log(`${self.turn} wins!`)
              return true;
            }
          }
        }
      }
      return false;
    }

    let didSomeoneWin = checkHorizontals() || checkVerticals() || checkDiagonalsLeftToRight() || checkDiagonalsRightToLeft();

    if (didSomeoneWin) {
      self.declareWinner(self.turn);
    }
  },
  declareWinner(turn) {
    this.hasWon = true;
    let whoseturn = document.getElementById('whoseturn');
    let win = document.getElementById('win');
    if (turn === 1) {
      win.innerText = 'BLUE PLAYER WINS!!!';
    } else {
      win.innerText = 'RED PLAYER WINS!!!';
    }
    whoseturn.style.display = 'none';
  },
  dropCoin (column) {
    for (let row = this.board.length-1; row >= 0; row--) {
      if (this.board[row][column] === 0) {
        this.board[row][column] = this.turn;
        // return true meaning a coin as dropped successfully
        return true;
      }
    }
    // return false if that column is full, meaning coin was not dropped successfully. This will prevent the game from switching turns
    return false;
  },
  renderBoard () {
    const self = this;

    // board's current state that was represented by a 6x7 matrix
    const state = this.board;

    // take the board
    const board = document.getElementById('board');

    // define function that creates a box
    const createBox = function(x, y, whoseTurn) {
      // make a box
      const box = document.createElement('div');
      box.className = 'box';

      // box's click event
      box.onclick = function() {
        // do nothing if game is over
        if (self.hasWon) {
          return;
        }
        
        // attempt to drop coin in the chosen column
        let didCoinDrop = self.dropCoin(x);

        // if a coin was successfully dropped... check winner, switch turns, and re-render the board
        if (didCoinDrop) {
          self.checkWinner();
          self.switchTurn();
          self.renderBoard();
        }
      }

      // make a coin
      const coin = document.createElement('span');
      coin.className = 'coin';
    
      // based on whose turn it is, coin will have a specific color.
      // 1 = BLUE Player, 2 = RED Player, and 0 = empty
      switch (whoseTurn) {
        case 0:
          coin.style.background = 'white';
          break;
        case 1:
          coin.style.background = 'blue';
          break;
        case 2:
          coin.style.background = 'red';
          break;
      }
    
      // add coin into box
      box.appendChild(coin);
      return box;
    }
    
    // destroy contents of board, if there ara any
    while (board.firstChild) {
      board.removeChild(board.firstChild);
    }
  
    // using x, y variables to represent the current position in the matrix
    // for every row that exists in the board...
    for (let y = 0; y < state.length; y++) {
      // create a div that represents a row
      const row = document.createElement('div');
      row.className = 'row';

      // for every box of the row that was created
      for (let x = 0; x < state[y].length; x++) {
        // create and add a box unto row which may or may not have a coin in it...
        row.appendChild(createBox(x, y, state[y][x]));
      }
      board.appendChild(row);
    }
  },
  switchTurn () {
    let whoseturn = document.getElementById('whoseturn');

    switch (this.turn) {
      case 1:
        this.turn = 2;
        whoseturn.innerText = 'RED Player\'s turn!'
        break;
      case 2:
        this.turn = 1;
        whoseturn.innerText = 'BLUE Player\'s turn!'
        break;
    }
  }
}

window.Connect4Game.startGame();