import p5 from 'p5';
import TWEEN from '@tweenjs/tween.js';
// import { createEasyCam } from "Libraries/easycam/p5.easycam.js";

// returns an array of xy coords for a given grid with screen dims
const gridLayout = (rows, cols, w, h) => {
  const coordsArray = [];
  const colW = w / cols;
  const rowH = h / rows;

  for (let i = 0; i < rows * cols; i++) {
    const colIndex = i % cols;
    const rowIndex = ( i > cols && colIndex === 0 ) ? rowIndex + 1 : rowIndex || 0;
    const x = colW * colIndex;
    const endX = x + colW;
    const y = rowH * rowIndex;
    const endY = y + rowH;
    coordsArray.push({ x, y, endX, endY });
  }
  return coordsArray;
}

new p5((sk) => {
  const RECT_TOTAL = 12; //TODO dinamica con rows cols
  const currentRects = [];

  const pattern_w = 400;
  const pattern_h = 400;
  let counter = 0;
  let pattern;

  let angles = [];
  // let recentlyDeadRect;
  let gridCoords;

  sk.setup = () => {
    sk.createCanvas(1200, 400, sk.WEBGL);
    pattern = sk.createGraphics(pattern_w, pattern_h, sk.WEBGL);
    // createEasyCam.bind(sk)();
    for (let i = 0; i < RECT_TOTAL; i++) {
      angles.push(sk.random(0, 100));
    }
    gridCoords = gridLayout(3, 4, sk.width, sk.height);

    console.log(sk.VERSION);
  };

  const drawPattern = (n) => {
    pattern.clear();
    pattern.stroke(255);
    pattern.strokeWeight(3);
    pattern.noFill();

    pattern.push();
    if (n % 2 !== 0) {
      pattern.rotateZ(angles[n] + counter);
    }
  
    const lines = 50;
    for (let i = 0; i < lines; i++) {
      pattern.line(0, i * 10, pattern_w, i * 10);
    }
    pattern.pop();
  }

  const rectProps = (x, y, endX, endY) => {
    return {
      x: sk.random(x, endX),
      y: sk.random(y, endY),
      z: sk.random(-100, 100),
      w: sk.random(100, endX - x),
      h: sk.random(100, endY - y),
      opacity: 1,
      lifeSpan: sk.random(100, 1000),
      isMoving: false
    }
  } 

  const createRect = (index=currentRects.length, {x, y, endX, endY}) => {
    const rect = { 
      ...rectProps(x, y, endX, endY),
      index
    };
    rect.tween = new TWEEN.Tween(rect)
        .to({ z: rect.z + 100 }, 2000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onComplete(() => {
          updateRect(rect);
        }
      );
    return rect;
  }

  const updateRect = (rect) => {
    const coords = gridCoords[rect.index]
    const { x, y, z, w, h } = rectProps(coords.x, coords.y, coords.endX, coords.endY);
    rect.isMoving = false;
    rect.tween.stop();

    rect.tween = new TWEEN.Tween(rect)
      .to({ x, y, z, w, h }, 2000)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .delay(10000)
      .onComplete(() => {
        updateRect(rect);
      }
    );
    // rect.tween.start();
    return rect;
  }



  sk.draw = () => {
    sk.clear();
    counter += .03;
  
    while (currentRects.length < RECT_TOTAL) {
      // let rect;
      // if (recentlyDeadRect) {
      //   rect = updateRect(recentlyDeadRect);
      // } else {
      const rect = createRect(currentRects.length, gridCoords[currentRects.length || 0]);
      //}
      currentRects.push(rect);
    }

    // if (currentRects[0].lifeSpan <= 0 ) { // not lifespan, but if tween ended
    //   const rect = currentRects.shift();
    //   recentlyDeadRect = rect.index;
    // } else {
    //   // currentRects[0].opacity = currentRects[0].opacity === 0 ? 1 : 0;
    //   currentRects[0].lifeSpan -= 1;
    // }

    sk.push();
    sk.translate(-sk.width/2, -sk.height/2);

   
    currentRects.forEach((rect, i) => {
      drawPattern(i);
      // sk.texture(pattern);

      const { x, y, z, w, h, isMoving, tween } = rect;
      // const willMove = sk.random([true, false]);

      // if (!isMoving && willMove) {
        if (!isMoving) {
        rect.isMoving = true;
        // debugger
        tween.start();
      }
      TWEEN.update();
      // sk.fill(0);
      sk.stroke(255);

      sk.beginShape();
      // sk.vertex(x, y, z, x + w, y + y);
      // sk.vertex(x + w, y, z, x + w, y);
      // sk.vertex(x + w, y + h, z, x + w, y + h);
      // sk.vertex(x, y + h, z, x, y + h);
      sk.vertex(x, y, z);
      sk.vertex(x + w, y, z);
      sk.vertex(x + w, y + h, z);
      sk.vertex(x, y + h, z);
      sk.endShape(sk.CLOSE);
    });
    sk.pop();
  };
}, document.querySelector('#animation-container'));

document.querySelector("body").style.backgroundColor = 'red';
