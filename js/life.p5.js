
import p5 from 'p5';
/*
  x| | | | 
   | | | |

*/

new p5((sk) => {
  const cells = [];
  const cellStates = [];

  const size = 5;
  const w = 140,
        h = 100;
  const gridSize = w * h;
  const seedLimit = 200;

  // set neighbors
  const setNeighbors = () => {
    for (let i = 0; i < gridSize; i++) {
      const ul = i - w - 1,
            u = i - w,
            ur = i - w + 1,
            l = i - 1,
            r = i + 1,
            bl = i + w - 1,
            b = i + w,
            br = i + w + 1;

      let possibleNeighbors = [ul, u, ur, l, r, bl, b, br];

      if (i % w === 0) { // first col
        possibleNeighbors = [u, ur, r, b, br];
      } else if (i + 1 % w === 0) {
        possibleNeighbors = [u, ul, l, bl, b];
      }
      possibleNeighbors = possibleNeighbors.filter(n => n < gridSize && n >= 0);

      cells.push(possibleNeighbors);

      const isAlive = (cellStates.length > seedLimit) ? false : !!(Math.floor(Math.random() * 100) % 3 === 0);
      // console.log(isAlive);
      cellStates.push(isAlive);
    }
  }
  sk.setup = () => {
    sk.createCanvas(size * w, size * h);
    sk.background(255);
    setNeighbors();
  }

  sk.draw = () => {
    sk.background('blue');
    sk.fill(0);
    
    sk.push();
    sk.stroke(155);
    sk.line(0, sk.height/2, sk.width, sk.height/2); // x
    sk.line(sk.width/2, 0, sk.width/2, sk.height);
    sk.pop();
    
    // Any live cell with fewer than two live neighbours dies, as if by underpopulation.
    // Any live cell with two or three live neighbours lives on to the next generation.
    // Any live cell with more than three live neighbours dies, as if by overpopulation.
    // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
    cells.forEach((neighbors, i) => {
      let isAlive = cellStates[i];

      if (isAlive) {
        let x = (i % w);
        let y = Math.floor(i / w);
        console.log(x, y);
        sk.square(x * size, y * size, size);
      }
      const livingNeighbors = (neighbors.filter(n => cellStates[n] === true)).length;
  
      if (livingNeighbors < 2 || livingNeighbors > 3) {
        isAlive = false;
      } else if (livingNeighbors === 3) {
        isAlive = true
      }
      cellStates[i] = isAlive;
    });
  }
});
