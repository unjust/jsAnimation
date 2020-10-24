import p5 from 'p5';

new p5((sk) => {
  sk.setup = () => {
    sk.pixelDensity(1);
    sk.createCanvas(1000, 500, sk.WEBGL);
  };

  const counter = () => sk.millis() / 1000;
  
  const drawLines = (x1, x2) => [...new Array(20)].forEach((v, i) =>
    sk.line(x1, 20 * i, x2, 20 * i)
  );

  sk.draw = () => {
    sk.clear();
    
    

    // for every block of width 
    // canvas width / BLOCKS = width   next 
    const BLOCKS = 80;
    const WIDTH = sk.canvas.width/BLOCKS;
    for (let i = 0; i < BLOCKS; i++) {
      sk.push();
      sk.rotateX(counter() / (i/20 + 1));
      sk.stroke('blue');
      const x1 = -sk.canvas.width/2 + (WIDTH * i);
      const x2 =  x1 + WIDTH;
      drawLines(x1, x2);
      sk.pop();
    }
    // drawLines();
  };
});
