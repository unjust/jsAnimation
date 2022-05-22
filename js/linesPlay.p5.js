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
    // buffer[newest] = { x: sk.mouseX, y : sk.mouseY };

    const t = sk.millis()/500;
    const scale = 2 / (3 - Math.cos(2*t));

    // https://gamedev.stackexchange.com/questions/43691/how-can-i-move-an-object-in-an-infinity-or-figure-8-trajectory
    buffer[newest] = { x: 200 + 200 * Math.cos(t), y: 300 + 200 * Math.sin(2*t) / 2 };
    
    // buffer[newest] = { x: 200 + 200 * Math.sin(sk.millis()/500), y: 300 + 200 * Math.cos(sk.millis()/500) };
    for (let i = 0; i < len; i++) {
      // which+1 is the smallest (the oldest in the array)
      let index = (newest + 1 + i) % len;
      console.log(index);
      const xy = buffer[index];
      // sk.ellipse(xy.x, xy.y, i, i);
      sk.line(xy.x, xy.y, xy.x + len - 1, xy.y + len - i)
    }
    // for (let i = len - 1; i >=0 ; i--) {
    //   const xy = buffer[i];
    //   sk.ellipse(xy.x, xy.y, i, i);
    // };
  }

// let num = 60;
// let mx = [];
// let my = [];

// sk.setup = function() {
//   sk.createCanvas(720, 400);
//   sk.noStroke();
//   sk.fill(255, 153);
//   for (let i = 0; i < num; i++) {
//     mx.push(i);
//     my.push(i);
//   }
// }

// sk.draw = function() {
//   sk.background(237, 34, 93);

//   // Cycle through the array, using a different entry on each frame.
//   // Using modulo (%) like this is faster than moving all the values over.
//   let which = sk.frameCount % num;
//   mx[which] = sk.mouseX;
//   my[which] = sk.mouseY;

//   for (let i = 0; i < num; i++) {
//     // which+1 is the smallest (the oldest in the array)
//     let index = (which + 1 + i) % num;
//     sk.ellipse(mx[index], my[index], i, i);
//   }
// }


}, document.querySelector('#container'));
