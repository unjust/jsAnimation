import p5 from 'p5';
import { drawCoordinates } from 'Utils/coordinates';
import { createEasyCam } from 'Libraries/easycam/p5.easycam.js';
import { 
  createRandomVertices, 
  getStepVertices,
  getContinuousVertices,
  drawVertices 
} from 'Framework/verticesHelpers';
new p5((sk) => {

  let randomVertices, verticesStepped;
  let drawingBuffer = [], allBuffers = [];
  let selectedVertex = 0;
  let counter = 0,
    step = 1;
  // const vertexCount = 10;

  sk.setup = () => {
    sk.createCanvas(600, 500, sk.WEBGL);
    sk.background(255);
    drawCoordinates(sk);
    
    (createEasyCam.bind(sk))();
    //vertices = createRandomVertices(vertexCount, sk );

    let vertices = selectFourVertices();
    verticesStepped = getStepVertices(vertices);
  };

  // const drawCross = (x, y, r, stepNum) => {
  //   const stepSize = r/stepNum;
  //   const leftX = x - r;
  //   let vectorArray = [];

  //   for (let i = 0; i < stepNum; i++) {
  //     vectorArray.push(sk.createVector(leftX + (stepSize * i), y + (stepSize * i)));
  //     vectorArray.push(sk.createVector(leftX + (stepSize * i), y + (stepSize * (i + 1))));
  //   }
  //  sk.beginShape();
  //   vectorArray.forEach((v) => sk.vertex(v.x, v.y));
  //   sk.endShape();
  // }

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

  const drawStepsBetweenTwoPoints = (p1, p2, numSteps) => {
    const stepSizeX = (p2.x - p1.x) / numSteps;
    const stepSizeY = (p2.y - p1.y) / numSteps;
    let vectorArray = [];

    for (let i = 0; i < numSteps; i++) {
      vectorArray.push(sk.createVector(p1.x + (stepSizeX * i), p1.y + (stepSizeY * i)));
      vectorArray.push(sk.createVector(p1.x + (stepSizeX * i), p1.y + (stepSizeY * (i + 1))));
    }
    vectorArray.push(sk.createVector(p1.x + (stepSizeX * numSteps), p1.y + (stepSizeY * numSteps)));
    console.log("Vector Array: ", vectorArray);
    
    sk.beginShape();
    vectorArray.forEach((v) => sk.vertex(v.x, v.y));
    sk.endShape();
  };

  sk.draw = () => {
    sk.strokeWeight(2);
    sk.stroke(0);
    sk.noFill();
    sk.background(255);
  
    // sk.stroke((counter % 2 == 0) ? 255 : 0);
    // drawCross(center.x, center.y, thickness, (counter * thickness) + radius);
    // drawCross(center.x, center.y, radius, steps);

    // this works as well :
    /*
    drawStepsBetweenTwoPoints(
      sk.createVector(-300, 0),
      sk.createVector(0, -300),
      5
    );
   
    drawStepsBetweenTwoPoints(
      sk.createVector(0, -180),
      sk.createVector(180, 0),
      5
    );
    */

    let vArrayStepped = getStepVertices(
      [ sk.createVector(-100, 0),
        sk.createVector(0, -100),
        sk.createVector(100, 0),
        sk.createVector(0, 100),
        sk.createVector(0, 100),
        sk.createVector(-100, 0)
      ], 5, sk);

    drawVertices(vArrayStepped, sk);
   
    // drawingBuffer.push(
    //   getContinuousVertices(
    //     verticesStepped[selectedVertex], 
    //     verticesStepped[selectedVertex+1],
    //     counter)
    // );
    
    // if ( counter >= 1 ) {
    //   // change vertice
    //   if (selectedVertex < verticesStepped.length - 2) {
    //     // debugger
    //     selectedVertex++;
    //     counter = 0;
    //   } 
    // } else {
    //   counter += step;
    // }

    // drawVertices(drawingBuffer, sk);  
    drawBuffers();
  };

  const drawBuffers = function() {
    drawingBuffer.push(
      getContinuousVertices(verticesStepped[selectedVertex], verticesStepped[selectedVertex+1], counter)
    );
    if (counter >= 1) {
      if (selectedVertex < verticesStepped.length - 1) {
        selectedVertex++;
      } else {
        // out of vertices
        allBuffers.push(drawingBuffer);
        verticesStepped = getStepVertices(selectFourVertices());
        selectedVertex = 0;
        drawingBuffer = [];
      }
      counter = 0;
    } else {
      counter += step;
    }
    

    allBuffers.forEach((vArr) => drawVertices(vArr, sk));
    drawVertices(drawingBuffer, sk);
  }
});
