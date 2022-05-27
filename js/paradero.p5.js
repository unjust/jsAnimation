import p5 from 'p5';
import { init as initMidi, getNoteQueue } from 'Utils/MidiTR8';
import Cube from 'Framework/Cube';
import Cone from 'Framework/Cone';
import { createEasyCam } from 'Libraries/easycam/p5.easycam.js';

const colors = {
  36: 'red',
  38: 'yellow',
  43: 'navy',
  47: 'blue',
  50: 'cyan',
  37: 'orange',
  39: 'pink',
  42: 'white',
  46: 'grey',
  49: 'black',
  51: 'purple',
 }

 const objects = {
  36: Cube,
  38: Cube,
  43: Cone,
  47: Cone,
  50: Cone,
  37: Cone,
  39: Cone,
  42: Cube,
  46: Cone,
  49: Cone,
  51: Cone,
 }

// 185 is control change channel 10
new p5((sk) => {
  
  let cam;

  // for bg
  let bgShader, shaderGraphics;
  let drawShader = true;

  const MODES = {
    CIRCLE: "circle",
    GRID: "grid",
    CONCENTRIC: "concentric",
    SPIRAL: "spiral",
    INDIVIDUAL: "individual"
  };

  // shapes
  let drawFn = () => {};
  const translateZ = 500.0;
  const cellWidth = 90, cellHeight = 90;
  let gridLength = 0, replaceIndex = 0, shapeSize = 100;
  let shapeQueue = [];
  let currentMode;

  // circle
  let radius = 400;
  let radiusDelta = -1;

  const concentricRadii = Object.keys(colors).reduce((obj, noteKey, i) => {
    const baseRadius = 10;
    const ceil = 52;
    obj[noteKey] = baseRadius * ((ceil - noteKey) * 3);
    return obj;
  }, {});
 
  
  // bg shader
  let colorVector = sk.createVector(1.0, 0.0, 0.0);
  let v = 0;

  sk.preload = () => {
    bgShader = sk.loadShader('shaders/standard.vert', 'shaders/noiseGrad2.frag');
  }

  sk.setup = () => {
    sk.createCanvas(sk.windowWidth, sk.windowHeight, sk.WEBGL);
    // const gl = sk.canvas.getContext('webgl')
    // gl.disable(gl.DEPTH_TEST)

    //https://discourse.processing.org/t/draw-on-top-of-shader/20764/2
    shaderGraphics = sk.createGraphics(sk.width, sk.height, sk.WEBGL);
    shaderGraphics.noStroke();

    console.log('hey sound defined?', sk.midiToFreq);
    gridLength = Math.ceil(sk.width/cellWidth) * Math.ceil(sk.height/cellHeight);
    
    initMidi({
      onNoteOn,
      onControlChange,
      noteQueueLimit: Math.max(gridLength, getAllConcentricCirclesCapacity()),
      instHandlers: { onRS, onRC }
    });
    cam = createEasyCam.bind(sk)();
  };

  const onNoteOn = (type, key) => {
    addShapes();
  }

  const onRS = (type) => {
    if (currentMode === MODES.CIRCLE && type === "noteon") {
      if (radius === 400) {
        radiusDelta = -1;
      } else if (radius < 80) {
        radiusDelta = 1;
      }
      radius += (5 * radiusDelta);
    }
  }

  const onRC = onRS;
  
  const onControlChange = (type, key, velocity) => {
    const delay = 16,
      delayTime = 17,
      delayFeedback = 18;
    const master = 19;
    const masterOn = 15;
    const extInLevel = 12;
    switch(key) {
      case extInLevel:
        const modes = 127/3;
        if (velocity < modes) {
          setDrawMode(MODES.CIRCLE);
        } else if (velocity < modes * 2) {
          setDrawMode(MODES.GRID);
        } else {
          setDrawMode(MODES.INDIVIDUAL);
        }
      case delay: 
        colorVector.add(-1.0/127, 1.0/127, 1.0/127);
        break;
      case master:
        colorVector.add(-1.0/127, 0., 1.0/127);
        break;
      case masterOn:
        colorVector = sk.createVector(1.0, 0, 0);
        cam.reset();
        break;
      case delayFeedback:
        cam.rotateY(velocity/127*2);
        break;
    }
  }

  sk.windowResized = () => {}

  const getCircleCapacity = () => Math.floor((Math.PI * 2 * radius)/shapeSize);

  const getAllConcentricCirclesCapacity = () => {
    return Object.values(concentricRadii).reduce((total, cradius) => {
      return total + Math.floor((Math.PI * 2 * cradius)/shapeSize);
    }, 0);
  }

  const getMaxLength = (mode) => {
    switch(mode) {
      case MODES.CIRCLE:
        return getCircleCapacity();
      case MODES.GRID:
        return gridLength;
      case MODES.CONCENTRIC:
        return 30; // getAllConcentricCirclesCapacity();
      case MODES.INDIVIDUAL:
        return 2;
      default:
        return 1;
        break;
    }
  }

  const addShapes = () => {
    const notes = getNoteQueue();
    const maxLength = getMaxLength(currentMode);
    
    let noteValue = 0;
    const queueNotFull = shapeQueue.length < maxLength;
    if (queueNotFull) {
      // when queue not full but notes and shapes are equal length
      noteValue = notes[shapeQueue.length === notes.length ? shapeQueue.length - 1 : shapeQueue.length];
    } else {
      noteValue = notes[notes.length - 1];
    }

    const color = colors[noteValue];
    const shapeFn = objects[noteValue];
    const shape = new shapeFn(sk, { w: cellWidth * .2, h: cellHeight * .8, x: 0, y: 0 }, { fill: color, stroke: 'black' });
    if (currentMode === MODES.INDIVIDUAL) {
      if (!shapeQueue[replaceIndex % maxLength]) {
        const otherIndex = replaceIndex % maxLength ? 1 : 0;
        const otherShape = shapeQueue[otherIndex];
        if (!otherShape || objects[otherShape.noteValue] !== shape) {
          shapeQueue[replaceIndex % maxLength] = { color, noteValue, shape };
        }
      }
    }
    else if (queueNotFull) {
      shapeQueue.push({ color, noteValue, shape });
    } else {
      shapeQueue[replaceIndex % maxLength] = { color, noteValue, shape };
    }
    replaceIndex++;
  }

  const drawGrid = (shape, i) => {
    const cellsX = (sk.width/cellWidth);
    sk.push();
    sk.translate(-sk.width/2, -sk.height/2, 0);
    shapeQueue.forEach((shapeObj, i) => {
      const { shape } = shapeObj;
      shape.pos.x = (i % cellsX) * cellWidth;
      shape.pos.y = Math.floor(i/cellsX) * cellHeight;
      shape.draw({ warp: false, rotate: true });
    });
    sk.pop();
  }

  // const drawConcentricCircles = () => {
  //   if (!shapeQueue.length) {
  //     return;
  //   }
    
  //   sk.push();
    
  //   // when an instrument is at max... 
  //   for (let i = 0; i < shapeQueue.length; i++) {
  //     // console.log(shapeQueue.length);
  //     const { shape, noteValue, color } = shapeQueue[i];
  //     const instRadius = concentricRadii[noteValue];
  //     const cap = Math.floor((Math.PI * 2 * instRadius)/shapeSize);
  //     const tick = (Math.PI*2 * i)/(cap);
  //     const x = instRadius * Math.sin(tick + sk.frameCount/100);
  //     const y = instRadius * Math.cos(tick + sk.frameCount/100);
  //     shape.pos.x = x;
  //     shape.pos.y = y;
      
  //     shape.draw({ warp: false, rotate: true });
  //     // sk.circle(x, y, 20);
  //   }
  //   sk.pop();
  // }

  const drawConcentricCircles = () => {
    const counter = sk.millis()/5000;

    sk.push();
    
    shapeQueue.forEach(s => {
      const shape = s.shape;
      const tw_delta = 1;
      const th_delta = 1;
      const x = shape.pos.x + (tw_delta * shape.dim.w/2);
      const y = shape.pos.y + (th_delta * shape.dim.h);
      const z = shape.pos.x + (tw_delta * shape.dim.w/2);
      // debugger
      sk.rotateY(Math.sin(counter/300));
      shape.setPosEnd({ x, y, z });
      shape.draw();
    });
    
    sk.pop();
  };

  const alphaA = function() { 
    const alpha = 255 * (Math.sin(sk.frameCount/10) + 1)/2;
    // console.log(sk.frameCount/1000);
    if (alpha < 0.01) {
      shapeQueue[0] = null;
    }
    this.fillColor.setAlpha(alpha);
  };
  const alphaB = function() { 
    const alpha = 255 * (Math.sin(Math.PI + sk.frameCount/10) + 1)/2;
    //console.log(alpha);
    if (alpha < 0.01) {
      shapeQueue[1] = null;
    }
    this.fillColor.setAlpha(alpha);
  };

  const drawIndividual = () => {
    sk.push();
    const scale = 10;
    // sk.translate(0, 0);
    sk.scale(scale, scale);
    sk.rotate(sk.millis()/500, [1, 1, 1]);
 
    shapeQueue.forEach((shapeObj, i) => {
      if (!shapeObj) {
        return;
      }
      const { shape } = shapeObj;
      shape.draw({ warp: false, transitionAlpha: (i === 0 ? alphaA : alphaB).bind(shape), rotate: false });
    })
  
    sk.pop();
  }

  const drawCircle = (shape, i) => {
    if (!shapeQueue.length) {
      return;
    }
    const cap = getCircleCapacity();
    const limit = Math.min(shapeQueue.length, cap);
    sk.push();
    for (let i = 0; i < limit; i++) {
      // console.log(shapeQueue.length);
      const { shape } = shapeQueue[i];
      const tick = (Math.PI*2 * i)/(cap);
      const x = radius * Math.sin(tick + sk.frameCount/100);
      const y = radius * Math.cos(tick + sk.frameCount/100);
      shape.pos.x = x;
      shape.pos.y = y;
      shape.draw({ warp: false, rotate: true });
      // sk.circle(x, y, 20);
    }
    sk.pop();
  }

  const modeDrawFns = {
    circle: drawCircle,
    concentric: drawConcentricCircles,
    grid: drawGrid,
    individual: drawIndividual,
    spiral: () => {}
  }

  const setDrawMode = (mode) => {
    if (mode === currentMode) {
      return;
    }
    const max = getMaxLength(mode);
    const len = shapeQueue.length;
    if (max < len) {
      shapeQueue.splice(0, len - max);
    }
    currentMode = mode;
    if (currentMode === MODES.INDIVIDUAL) {
      // sk.clear();
      // sk.background(0);
    }
    drawFn = modeDrawFns[mode];
  }

  sk.draw = () => {
    //if (currentMode !== MODES.INDIVIDUAL) {
      sk.clear();
      sk.background(0);
    //}
    // divide the canvas into a grid
    // with every new note, select a shape and put it in the next spot on the grid
    // when done with last row and last column, restart
    
    if (drawShader) {
      shaderGraphics.shader(bgShader);
      bgShader.setUniform('u_resolution', [sk.width, sk.height]);
      bgShader.setUniform('u_colorVector', [colorVector.x, colorVector.y, colorVector.z]);
      bgShader.setUniform('u_value', v);
      bgShader.setUniform('u_time', sk.frameCount);
      sk.push();
      sk.translate(-sk.width/2, -sk.height/2, -translateZ);
      shaderGraphics.rect(-translateZ/2, -translateZ/2, sk.width + translateZ, sk.height + translateZ);
      sk.image(shaderGraphics, -translateZ * 1.2, -translateZ, sk.width + translateZ * 2.5, sk.height + translateZ * 2);
      sk.pop();
    }
    
    if (shapeQueue.length) {
      drawFn();
    }
  };

  sk.keyTyped = () => {
    switch(sk.key) {
      case 'r':
        const v = colorVector.add(1.0, 0., 0.);
        console.log(v);
        break;
      case 'R':
        colorVector.add(-1.0, 0., 0.);
        break;
      case 'g':
        colorVector.add(0.0, 1., 0.);
        break;
      case 'G':
        colorVector.add(0.0, -1., 0.);
        break;
      case 'b':
        colorVector.add(0.0, 0., 1.);
        break;
      case 'B':
        colorVector.add(0.0, 0., -1.);
        break;
      case 'v':
        v -= 1;
        break;
      case 'V':
        v += 1;
        break;
      case "s":
        drawShader = !drawShader;
        break;
      case "c": 
        setDrawMode(MODES.CIRCLE);
        break;
      case "C": 
        setDrawMode(MODES.CONCENTRIC);
        break;
      case "1": 
        setDrawMode(MODES.INDIVIDUAL);
        break;
      default:
        setDrawMode(MODES.GRID);
        break;
    }
    console.log(colorVector, v);
  }
  
}, document.querySelector('#container'));


