import p5 from 'p5';
import { init as initMidi, getNoteQueue } from 'Utils/MidiTR8';
import Cube from 'Framework/Cube';
import Cone from 'Framework/Cone';

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
  
  // for bg
  let bgShader, shaderGraphics;
  let drawShader = true;

  // shapes
  let drawFn = () => {};
  const translateZ = 500.0;
  const cellWidth = 60, cellHeight = 60;
  let gridLength = 0, replaceIndex = 0;
  const shapeQueue = [];


  // bg shader
  const colorVector = sk.createVector(105.0, 0.0, 0.0);
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
    gridLength = sk.width/cellWidth * sk.height/cellHeight;
    
    initMidi({ onNoteOn, noteQueueLimit: gridLength });
    //const cells = Array.from(Array(queueLength), x => 0);
    //shapeQueue.push(...cells);
    // Array.prototype.eventPush = function(item, cb) {
    //   this.push(item);
    //   cb(this);
    // }
  };

  const onNoteOn = (type, key) => {
    addShapes();
  }

  sk.keyTyped = () => {
    const c = sk.key;
    if (c === "s") {
      drawShader = !drawShader;
      return;
    } 
    if (c === "c") {
      drawFn = drawCircle;
    } else {
      drawFn = drawGrid;
    }
  }

  sk.windowResized = () => {}

  const addShapes = () => {
    const notes = getNoteQueue();

    if (shapeQueue.length < gridLength) {
      // while there are spaces to fill, fill up our shapes
      while (notes.length > shapeQueue.length) {
        // determine shape
        // console.log('while');
        const note = notes[shapeQueue.length];
        const color = colors[note];
        const shape = objects[note]
        shapeQueue.push(new shape(sk, { w: cellWidth * .2, h: cellHeight * .8, x: 0, y: 0 }, { fill: color, stroke: 'black' }));
      }
    } else {
      const lastNote = notes[notes.length - 1];
      const color = colors[lastNote];
      const shape = objects[lastNote];
      // console.log('shift')
      // shapeQueue.unshift(value);
      shapeQueue[replaceIndex] = new shape(sk,  { w: cellWidth * .2, h: cellHeight * .8, x: 0, y: 0 }, { fill: color, stroke: 'black' });
      replaceIndex = replaceIndex < gridLength ? replaceIndex + 1 : 0;
    }
  }

  const drawGrid = (shape, i) => {
    const cellsX = (sk.width/cellWidth);
    sk.push();
    sk.translate(-sk.width/2, -sk.height/2, 0);
    shapeQueue.forEach((shape, i) => {
      shape.pos.x = (i % cellsX) * cellWidth;
      shape.pos.y = Math.floor(i/cellsX) * cellHeight;
      // shape.setPosition({ x: (i % cellsX) * cellWidth, y: Math.floor(i/cellsX) * cellHeight });
      shape.draw({ warp: false, rotate: true });
    });
    sk.pop();
  }

  const drawCircle = (shape, i) => {
    sk.push();
    shapeQueue.forEach((shape, i) => {
      shape.pos.x = 400 * Math.sin(i + sk.frameCount/100);
      shape.pos.y = 400 * Math.cos(i + sk.frameCount/100);
      shape.draw({ warp: false, rotate: true });
    });
    sk.pop();
  }

  sk.draw = () => {
    sk.clear();
    sk.background(0);
    
    // divide the canvas into a grid
    // with every new note, select a shape and put it in the next spot on the grid
    // when done with last row and last column, restart
    
    if (drawShader) {
      // bgShader.setUniform('u_resolution', [sk.width, sk.height]);
      // bgShader.setUniform('u_time', sk.frameCount/ 100.0);
    
      // shaderGraphics.shader(bgShader);
      // sk.push();
      // sk.translate(-sk.width/2, -sk.height/2, -translateZ);
      // shaderGraphics.rect(-translateZ/2, -translateZ/2, sk.width + translateZ, sk.height + translateZ);
      // sk.image(shaderGraphics, -translateZ * 1.2, -translateZ, sk.width + translateZ * 2.5, sk.height + translateZ * 2);
      // sk.pop();
      shaderGraphics.shader(bgShader);
      bgShader.setUniform('u_resolution', [sk.width, sk.height]);
      bgShader.setUniform('u_colorVector', [colorVector.x/255.0, colorVector.y/255.0, colorVector.z/255.0]);
      bgShader.setUniform('u_value', v);
      bgShader.setUniform('u_time', sk.frameCount);
      sk.push();
      sk.translate(-sk.width/2, -sk.height/2, -translateZ);
      shaderGraphics.rect(-translateZ/2, -translateZ/2, sk.width + translateZ, sk.height + translateZ);
      sk.image(shaderGraphics, -translateZ * 1.2, -translateZ, sk.width + translateZ * 2.5, sk.height + translateZ * 2);
      sk.pop();
    }
    
    // sk.fill('blue');
    // sk.quad(0, 0, sk.width, 0, sk.width, sk.height, 0, sk.height);
    
    drawFn();
    
  };


  sk.keyPressed = () => {
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
    }
    console.log(colorVector, v);
  }
  
}, document.querySelector('#container'));


