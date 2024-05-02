let minefield;

window.onload = function() {
    
    let iCols = document.querySelector("#cols");
    let iRows = document.querySelector("#rows");
    let iMines = document.querySelector("#mines");

    let a1 = document.querySelector("#mines_a");
    let b1 = document.querySelector("#mines_b");
    let c1 = document.querySelector("#mines_c");
    let n1 = new Number(a1, b1, c1);
  
    let a2 = document.querySelector("#timer_a");
    let b2 = document.querySelector("#timer_b");
    let c2 = document.querySelector("#timer_c");
    let n2 = new Number(a2, b2, c2);
    
    let interface = {
        cols: 9, 
        rows: 9,
        mineCount: 10,
        mines: n1,
        timer: n2,
        parent: document.querySelector("#grid")
    }

    let button = document.querySelector("#game_button");

    minefield = new Minefield();   
    minefield.listener = (win)=>{
        button.classList.remove(...button.classList);
        if(win) {
            button.classList.add("tile", "face", "thug-life")
        } else {
            button.classList.add("tile", "face", "dead")
        }
    };

    button.addEventListener('click', (e)=> {
        button.classList.remove(...button.classList);
        button.classList.add("tile", "face", "smile")
        minefield.initialize(interface);
    });

    let changeListener = ()=> {
        let cols = Math.max(7, iCols.value);
        let rows = Math.max(1, iRows.value);
        let mineCount = Math.max(1, Math.min(cols * rows - 1, iMines.value));
        iCols.value = cols;
        iRows.value = rows;
        iMines.value = mineCount;
        interface.cols = cols;
        interface.rows = rows;
        interface.mineCount = mineCount;
        minefield.initialize(interface); // initialize
    };

    iCols.addEventListener('change', changeListener);
    iRows.addEventListener('change', changeListener);
    iMines.addEventListener('change', changeListener);

    changeListener();

}

/* 2021 - Sergio Soriano */

"use strict";
const COVERED    = 0;
const WITH_FLAG  = 1;
const DISCOVERED = 2;

class Minefield {

  constructor() {
    this.listener = null;
  }

  toIndex(i, j) {
      return j * this.cfg.cols + i;
  }
  
  initialize = function (cfg) {
    
    this.cfg = cfg; 
    // data instance
    this.data = []; 
    // clear parent
    cfg.parent.innerHTML = ''; 
    // create grid
    let grid = document.createElement('div');
    grid.classList.add('grid'); // add style
    grid.style.gridTemplateColumns = `repeat(${cfg.cols}, 32px)`; // configure columns
    grid.style.gridTemplateRows    = `repeat(${cfg.rows}, 32px)`; // configure rows
    cfg.parent.appendChild(grid); // append to parent
    // initialize counters
    cfg.mines.set(cfg.mineCount, 0, cfg.mineCount); // mine counter
    cfg.timer.setValue(0); // timer
    if(this.interval) { // stop clock
        clearInterval(this.interval);
        this.interval = null;
    }
    // initialize grid
    for (let j = 0; j < cfg.rows; j++) {
      for (let i = 0; i < cfg.cols; i++) {
      
        let index = this.toIndex(i, j);
        let button = document.createElement("img");
        let cell = {
            info: 0,
            state: COVERED,
            button: button,
        };

        button.addEventListener("mouseup", (e) => {

            if(this.running) {
                if (e.button === 0 && cell.state === COVERED) {

                    if(!this.interval) {                   
                        this.interval = setInterval(()=> {
                            cfg.timer.add(1);
                            if(cfg.timer.value === 999) {
                                this.gameOver(false);
                            }
                        }, 1000);
                    }               
                   
                    if (cell.info === -1) { // has mine
                        cell.state = DISCOVERED;
                        setStyle(button, ["tile", "mine-red"]);
                        this.discoverAll();
                        this.gameOver(false);
                    } else if(cell.info === 0) { // spread empty zone
                        this.floodFill(i, j);
                        this.checkWin();
                    } else { // single cell
                        cell.state = DISCOVERED;
                        setStyle(button, ["tile", "m-" + cell.info]);
                        this.checkWin();        
                    }                
                }
            }

        });

        button.addEventListener('contextmenu', (e)=> {
            e.preventDefault();            
            if(this.running) {
                if (cell.state === COVERED) {                   
                    cell.state = WITH_FLAG;
                    setStyle(button, ["tile", "flag"])
                    cfg.mines.sub(1);
                } else if(cell.state === WITH_FLAG) {
                    cell.state = COVERED;
                    setStyle(button, ["tile", "cover"]);
                    cfg.mines.add(1);
                }  
            }  
        });

        this.data[index] = cell;
        button.classList.add("tile", "cover");
        grid.appendChild(button);
      }
    }
    // Randomize mines
    let n = cfg.mineCount;
    while (n > 0) {
      let index = Math.floor(Math.random() * this.data.length);
      let cell = this.data[index];
      if (!cell.info) {
        cell.info = -1; // set mine
        n--;
      }
    }
    
    for (let j, i = 0; i < cfg.cols; i++) {
      for (j = 0; j < cfg.rows; j++) {
        let index = this.toIndex(i, j);
        let cell = this.data[index];
        if (cell.info === 0) { // no has mine
          // count neighboring mines
          for (let j1, i1 = Math.max(0, i - 1); i1 < Math.min(i + 2, cfg.cols); i1++) {
            for (j1 = Math.max(0, j - 1); j1 < Math.min(j + 2, cfg.rows); j1++) {
                if(this.data[this.toIndex(i1, j1)].info === -1) {
                    cell.info++;                   
                }
            }
          }
        }
      }
    }
   
    this.running = true;

  }

  floodFill(x, y) {   

      let queue = [{x, y}];
      let cell, c;
      do {

        c = queue.shift();
        cell = this.data[this.toIndex(c.x, c.y)];
        if(cell.info > -1 && cell.state != DISCOVERED) { // check visibility

            if(cell.state === WITH_FLAG) {
                this.cfg.mines.add(1);
            }

            cell.state = DISCOVERED;
            setStyle(cell.button, ["tile", "m-" + cell.info])
            
            if(cell.info === 0) { // is empty cell
       
                for (let i1 = Math.max(0, c.x - 1); i1 < Math.min(c.x + 2, this.cfg.cols); i1++) {
                    for (let j1 = Math.max(0, c.y - 1); j1 < Math.min(c.y + 2, this.cfg.rows); j1++) {
                        if(i1 != c.x || j1 != c.y) {
                            queue.push({
                                x: i1, 
                                y: j1
                            });
                        }
                    }
                }

            }
 
        }

      } while(queue.length > 0);
  }

  discoverAll() {
    let n = this.cfg.cols * this.cfg.rows;
    for (let i = 0; i < n; i++) {
      let cell = this.data[i];
      if (cell.state === COVERED || cell.info > 0) {
        cell.state = DISCOVERED;
        let button = cell.button;
        if (cell.info === -1) { // has mine
          setStyle(cell.button, ["tile", "mine"])
        } else {
          setStyle(cell.button, ["tile", "m-0"])
        }
      }
    }
  }

  checkWin() {
    let n = this.cfg.cols * this.cfg.rows;
    for (let i = 0; i < n; i++) {
        if((this.data[i].state === COVERED || this.data[i].state === WITH_FLAG) && this.data[i].info > -1) {
            return;
        }
    }
    this.gameOver(true);
  }

  gameOver(win) {
    this.running = false;
    clearInterval(this.interval);
    this.listener(win);
  }

}

const setStyle = function(el, style) {
    el.classList.remove(...el.classList);
    el.classList.add(...style);
}


class Number {

    constructor(a, b, c) {
        this.a = a;
        this.b = b;
        this.c = c;

        this.set(0, 0, 9999);
    }
   
    add(value) {
        this.setValue(this.value + value);
    }

    sub(value) {
        this.setValue(this.value - value);
    }

    setValue(value) {
        value = Math.max(this.minValue, Math.min(this.maxValue, value))
        this.value = value;

        let s = String(value).padStart(3, "0");
        setStyle(this.a, ["tile", "number", `n-${s.charAt(0)}`]);
        setStyle(this.b, ["tile", "number", `n-${s.charAt(1)}`]);
        setStyle(this.c, ["tile", "number", `n-${s.charAt(2)}`]);

    }

    set(value, minValue, maxValue) {
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.setValue(value);
        return this;
    }

}

function showMinesweeperPopup() {
    document.getElementById('minesweeperPopup').classList.add('show');
  }
  
  function closeMinesweeperPopup() {

    let iCols = document.querySelector("#cols");
    let iRows = document.querySelector("#rows");
    let iMines = document.querySelector("#mines");

    let a1 = document.querySelector("#mines_a");
    let b1 = document.querySelector("#mines_b");
    let c1 = document.querySelector("#mines_c");
    let n1 = new Number(a1, b1, c1);
  
    let a2 = document.querySelector("#timer_a");
    let b2 = document.querySelector("#timer_b");
    let c2 = document.querySelector("#timer_c");
    let n2 = new Number(a2, b2, c2);
    
    let interface = {
        cols: iCols.value, 
        rows: iRows.value,
        mineCount: iMines.value,
        mines: n1,
        timer: n2,
        parent: document.querySelector("#grid")
    }

    let button = document.querySelector("#game_button");
    button.classList.remove(...button.classList);
    button.classList.add("tile", "face", "smile");
    minefield.initialize(interface);

    document.getElementById('minesweeperPopup').classList.remove('show');
  }