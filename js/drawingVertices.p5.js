import p5 from 'p5';
import { createRandomVertices, getContinuousVertices, drawVertices } from './myLib/verticesHelpers';
import { createEasyCam } from 'Libraries/easycam/p5.easycam.js';

new p5((sk) => {

  let randomVertices,
  colorValuesArray = [];

  const vertexCount = 10,
    step = .01;

  let drawingBuffer = [],
    allBuffers = [],
    colorBuffers = [];

  let selectedVertice = 0,
    counter = 0;
  
  let stopDrawing = false;

  sk.setup = () => {
    sk.createCanvas(600, 500, sk.WEBGL);
    (createEasyCam.bind(sk))();
    sk.background(255);

    randomVertices = createRandomVertices(vertexCount, sk, true);
    colorValuesArray = chooseColors();

    // drawCoordinates(sk);
    console.log('press any key to stop the vectors drawing. can manipulate with easy cam');
  };

  // const drawVertices = (verticesArray) => {
  //   sk.beginShape();
  //   verticesArray.forEach((v) => sk.vertex(v.x, v.y, v.z));
  //   sk.endShape();
  // }

  sk.keyPressed = () => {
    if (sk.keyCode === 'c') {
      //clear buffers
    }
    stopDrawing = !stopDrawing;
  };

  const chooseColors = function() {
    const colorValues = [sk.random(0, 255), sk.random(0, 255), sk.random(0, 255)];
    colorBuffers.push(colorValues);
    return colorValues;
  }

  sk.draw = () => {
    sk.clear();
    sk.background(255);
    sk.strokeWeight(2);

    if ( counter > 1 ) {
      // change vertice and restart counter
      if (selectedVertice < vertexCount - 2) {
        selectedVertice++;
        counter = 0;
      } else { // out of vertices select new ones       
        allBuffers.push([...drawingBuffer]);    
        randomVertices = createRandomVertices(vertexCount, sk, true);
        colorValuesArray = chooseColors();
        selectedVertice = 0;
        counter = 0;
        drawingBuffer = [];
      }
    } else {
      if (!stopDrawing) counter += step;
    }
    
    allBuffers.forEach((arr, i) => {
      sk.stroke(...colorBuffers[i]);
      sk.fill(...colorBuffers[i], 50);
      sk.push();
      drawVertices(arr, sk);
      sk.pop();
    });

    drawingBuffer.push(
      getContinuousVertices( 
        randomVertices[selectedVertice], 
        randomVertices[selectedVertice+1],
        counter)
    );

    if (selectedVertice < vertexCount - 1) {
      sk.stroke(...colorValuesArray);
      sk.fill(...colorValuesArray, 50);
      drawVertices(drawingBuffer, sk);
    }
  };
});
