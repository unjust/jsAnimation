import p5 from 'p5';
import { drawCoordinates } from 'Utils/coordinates';
import { createEasyCam } from 'Libraries/easycam/p5.easycam.js';
import { 
  getStepVertices,
  getContinuousVertices,
  drawVertices,
  selectNextRandomVertex
} from 'Framework/verticesHelpers';

new p5((sk) => {

  let counter = 1, // start off at 1 to selectVertices
    step = 1;
  
  // a buffer for the current shape
  let drawingBuffer = [],
    allShapesBuffers = []; // a buffer for all shapes

  let verticesToConnect = [];
  let selectedVertex = 0;

  sk.setup = () => {
    sk.createCanvas(1600, 900, sk.WEBGL);
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

  const getShapeVerticesComplex = () => {
    // const howManyVertices = sk.random(3, 10);
    // some random or patterned mix of solid and step

    // reset the buffer process
    verticesToConnect = getStepVertices(getSelectedVertices());
    selectedVertex = 0;
  }

  const getShapeVertices = () => {
    const prev = verticesToConnect[verticesToConnect.length - 1];
    const nextVertex = selectNextRandomVertex(
      prev,
      120, // make this controlled by input somehow
      true,
      sk);

    // seed if no vertices
    if (!verticesToConnect.length) {
      verticesToConnect.push(nextVertex);
      verticesToConnect.push(selectNextRandomVertex(
        nextVertex,
        120, 
        true,
        sk));
      return;
    }
   
    if (sk.random(10) % 2) { // odd
      verticesToConnect.push(...getStepVertices([prev, nextVertex]));
    } else {
      verticesToConnect.push(nextVertex);
    }
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
        getContinuousVertices(verticesToConnect[selectedVertex], verticesToConnect[selectedVertex+1], counter)
      );
      counter += step;
    } else { // if counter is at 100%
       // increment the selected vertex, if we havent run out
      if (selectedVertex < verticesToConnect.length - 1) {
        selectedVertex++;
        getShapeVertices();
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
