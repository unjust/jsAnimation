import p5 from 'p5';
import { drawCoordinates } from 'Utils/coordinates';
import { createEasyCam } from 'Libraries/easycam/p5.easycam.js';
import { 
  getStepVertices,
  getContinuousVertices,
  createRandomVertices,
  drawVertices 
} from 'Framework/verticesHelpers';

new p5((sk) => {

  let counter = 1, // start off at 1 to selectVertices
    step = 1;
  
  // a buffer for the current shape
  let drawingBuffer = [],
    allShapesBuffers = []; // a buffer for all shapes

  let verticesStepped = [];
  let selectedVertex = 0;

  sk.setup = () => {
    sk.createCanvas(600, 500, sk.WEBGL);
    sk.background(255);
    drawCoordinates(sk);
    
    (createEasyCam.bind(sk))();
    console.log("same as steppedDrawing but organized code slightly differently")
  };


  const resetBuffers = () => {
    // out of vertices, push the shape to the buffer
    allShapesBuffers.push(drawingBuffer);
    drawingBuffer = [];
  }

  const getShapeVertices = () => {
    // reset the buffer process
    verticesStepped = getStepVertices(selectFourVertices());
    selectedVertex = 0;
  }

  const selectFourVertices = () => {
    const amt = sk.random(-sk.width, sk.width);
    return [ 
      sk.createVector(-1 * amt, 0, amt),
      sk.createVector(0, -1 * amt, amt),
      sk.createVector(amt, 0, amt),
      sk.createVector(0, amt, amt),
      sk.createVector(0, amt, amt),
      sk.createVector(-1 * amt, 0, amt)
    ];
  }

  sk.draw = () => {
    sk.strokeWeight(2);
    sk.stroke(0);
    sk.noFill();
    sk.background(255);
   
    drawBuffers();
  };

  const drawBuffers = function() {

    // push new vertices
    if (counter < 1) {
      drawingBuffer.push(
        getContinuousVertices(verticesStepped[selectedVertex], verticesStepped[selectedVertex+1], counter)
      );
      counter += step;
    } else { // if counter is at 100%
       // increment the selected vertex, if we havent run out
      if (selectedVertex < verticesStepped.length - 1) {
        selectedVertex++;
      } else {
        resetBuffers();
        getShapeVertices();
      }
      counter = 0;
    }
    
    // draw
    allShapesBuffers.forEach((vArr) => drawVertices(vArr, sk));
    drawVertices(drawingBuffer, sk);
  }
});
