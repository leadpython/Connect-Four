window.Connect4Game = {
  turn: 1,
  board: [],
  hasWon: false,
  startGame () {
    this.initializeBoard();
    this.renderBoard();
  },
  initializeBoard () {
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
    const checkHorizontals = function() {
      let count = 0;
      for (let row = 0; row < self.board.length; row++) {
        count = 0;
        for (let column = 0; column < self.board[row].length; column++) {
          if (self.board[row][column] === self.turn) {
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
      return false;
    }
    const checkVerticals = function() {
      let count = 0;
      for (let column = 0; column < self.board[0].length; column++) {
        count = 0;
        for (let row = 0; row < self.board.length; row++) {
          if (self.board[row][column] === self.turn) {
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
      return false;
    }
    const checkDiagonalsLeftToRight = function() {
      let count = 0;
      for (let row = 0; row < self.board.length; row++) {
        for (let column = 0; column < self.board[row].length; column++) {
          count = 0;
          for (let row2 = row, column2 = column; row2 < self.board.length; row2++, column2++) {
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
    const state = this.board;
    const board = document.getElementById('board');
    const createBox = function(x, y, whoseTurn) {
      const box = document.createElement('div');
      box.className = 'box';
      box.onclick = function() {
        if (self.hasWon) {
          return;
        }
        let didCoinDrop = self.dropCoin(x);
        if (didCoinDrop) {
          self.checkWinner();
          self.switchTurn();
          self.renderBoard();
        }
      }
      const coin = document.createElement('span');
      coin.className = 'coin';
    
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
    
      box.appendChild(coin);
      return box;
    }
    
    // destroy contents of board, if there ara any
    while (board.firstChild) {
      board.removeChild(board.firstChild);
    }
  
    // using x, y variables to represent the current position in the matrix
    for (let y = 0; y < state.length; y++) {
      const row = document.createElement('div');
      row.className = 'row';
      for (let x = 0; x < state[y].length; x++) {
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