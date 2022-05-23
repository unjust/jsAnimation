import p5 from 'p5';

// https://p5js.org/examples/input-storing-input.html
new p5(sk => {

  const len = 60,
        buffer = Array.from(Array(len), () => ({ x: 0, y: 0 }));

  sk.setup = () => {
    sk.createCanvas(sk.windowWidth, sk.windowHeight);
    sk.fill(255, 153);
    sk.stroke(255, 153);
    // sk.noStroke();
  }

  sk.draw = () => {
    sk.background(237, 34, 93);
    let newest = sk.frameCount % len;
  
    const t = sk.millis()/500;
    // const scale = 2 / (3 - Math.cos(2*t));

    // https://gamedev.stackexchange.com/questions/43691/how-can-i-move-an-object-in-an-infinity-or-figure-8-trajectory
    buffer[newest] = { x: 200 + 200 * Math.cos(t), y: 300 + 200 * Math.sin(2*t) / 2 };
    // buffer[newest] = { x: 200 + 200 * Math.sin(sk.millis()/500), y: 300 + 200 * Math.cos(sk.millis()/500) };
    
    for (let i = 0; i < len; i++) {
      // which+1 is the smallest (the oldest in the array)
      let index = (newest + 1 + i) % len;
      const xy = buffer[index];
      // sk.ellipse(xy.x, xy.y, i, i);
      sk.line(xy.x, xy.y, xy.x + len - 1, xy.y + len - i)
    }
  }

}, document.querySelector('#container'));
