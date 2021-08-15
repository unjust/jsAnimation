import p5 from 'p5';
import TWEEN from '@tweenjs/tween.js';
import { createEasyCam } from "Libraries/easycam/p5.easycam.js";

const containerEl = document.querySelector('[data-animation-container="true"]');

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

  const pattern_w = 800;
  const pattern_h = 500;
  let counter = 0;
  let pattern;
  const patternAngles = [];
  
  let gridCoords;

  sk.setup = () => {
    sk.createCanvas(containerEl.clientWidth, containerEl.clientHeight, sk.WEBGL);
    pattern = sk.createGraphics(pattern_w, pattern_h, sk.WEBGL);
    pattern.angleMode(sk.DEGREES);
    createEasyCam.bind(sk)();
    for (let i = 0; i < RECT_TOTAL; i++) {
      patternAngles.push(sk.random(90, 270));
    }
    gridCoords = gridLayout(3, 4, sk.width, sk.height);
    console.log('hello world', sk.VERSION);

    for (let r = 0; r < RECT_TOTAL; r++) {
      const rect = createRect(currentRects.length, gridCoords[currentRects.length || 0]);
      currentRects.push(rect);
    }
  };

  sk.windowResized = () => {
    sk.resizeCanvas(containerEl.clientWidth, containerEl.clientHeight);
  }

  const rectProps = (x, y, endX, endY) => {
    return {
      x: sk.random(x, endX),
      y: sk.random(y, endY),
      z: sk.random(-100, 100),
      w: sk.random(100, 600),
      h: sk.random(100, 400),
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
    return rect;
  }

  const drawPattern = (n, counter) => {
    pattern.clear();
    pattern.stroke(255);
    pattern.strokeWeight(2);
    pattern.noFill();

    pattern.push();
    if (n % 2 !== 0) {
      // pattern.push();
      // pattern.translate(0, 0);
      pattern.rotateZ(patternAngles[n] + counter);
    } else {
      // pattern.rotateZ(sk.random([0, 90]));
    }

    pattern.translate(-pattern.width/2, -pattern.height/2);
    const lines = 100;
    for (let i = 0; i < lines; i++) {
      const y = i * 10;
      pattern.line(0, y, pattern_w, y);
    }
    pattern.pop();
  }
  
  sk.draw = () => {
    sk.clear();
    counter += .3;
  
    sk.push();
    sk.translate(-sk.width/2, -sk.height/2);

    currentRects.forEach((rect, i) => {
      const { x, y, z, w, h, isMoving, tween } = rect;

      if (!isMoving) {
        rect.isMoving = true;
        // debugger
        tween.start();
      }
      TWEEN.update();

      // sk.fill(0);
      // sk.stroke(255);

      // sk.beginShape();
      // sk.vertex(x, y, z);
      // sk.vertex(x + w, y, z);
      // sk.vertex(x + w, y + h, z);
      // sk.vertex(x, y + h, z);
      // sk.endShape(sk.CLOSE);

      drawPattern(i, counter);
      sk.texture(pattern);

      sk.beginShape();
      sk.vertex(x, y, z, x, y);
      sk.vertex(x + w, y, z, x + w, y);
      sk.vertex(x + w, y + h, z, x + w, y + h);
      sk.vertex(x, y + h, z, x, y + h);
      sk.endShape(sk.CLOSE);

    });
    sk.pop();
  };
}, containerEl);

// document.querySelector("body").style.backgroundColor = 'red';
