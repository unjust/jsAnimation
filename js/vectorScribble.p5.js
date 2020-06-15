import p5 from 'p5';
import { drawCoordinates } from 'Utils/coordinates';
import { createRandomVertices, getContinuousVertices } from 'Framework/verticesHelpers';
new p5((sk) => {

  let randomVertices;
  let drawingBuffer = [];
  let selectedVertice = 0;
  let counter = 0,
    step = .01;
  const vertexCount = 10;

  sk.setup = () => {
    sk.createCanvas(1600, 800, sk.WEBGL);
    sk.background(255);
    drawCoordinates(sk);
    
    randomVertices = createRandomVertices(vertexCount, sk);
  };

  const drawCross = (x, y, r, stepNum) => {
    const stepSize = r/stepNum;
    const leftX = x - r;
    let vectorArray = [];

    for (let i = 0; i < stepNum; i++) {
      vectorArray.push(sk.createVector(leftX + (stepSize * i), y + (stepSize * i)));
      vectorArray.push(sk.createVector(leftX + (stepSize * i), y + (stepSize * (i + 1))));
    }
   sk.beginShape();
    vectorArray.forEach((v) => sk.vertex(v.x, v.y));
    sk.endShape();
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


  sk.drawVertices = (verticesArray) => {
    sk.beginShape();
    verticesArray.forEach((v) => sk.vertex(v.x, v.y));
    sk.endShape();
  }

  sk.draw = () => {
    sk.strokeWeight(2);
    sk.stroke(0);
    
    // sk.stroke((counter % 2 == 0) ? 255 : 0);
    // drawCross(center.x, center.y, thickness, (counter * thickness) + radius);
    // drawCross(center.x, center.y, radius, steps);


    // this works as well :
    // drawStepsBetweenTwoPoints(
    //   sk.createVector(-100, 0),
    //   sk.createVector(0, -100),
    //   5
    // );
   
    // drawStepsBetweenTwoPoints(
    //   sk.createVector(0, -100),
    //   sk.createVector(100, 0),
    //   5
    // );

    // let vArrayStepped = getStepVertices(
    //   [ sk.createVector(-100, 0),
    //     sk.createVector(0, -100),
    //     sk.createVector(100, 0),
    //     sk.createVector(0, 100),
    //     sk.createVector(0, 100),
    //     sk.createVector(-100, 0)
    //   ], 5, sk);

    // sk.drawVertices(vArrayStepped);
   

    drawingBuffer.push(
      getContinuousVertices( 
        randomVertices[selectedVertice], 
        randomVertices[selectedVertice+1],
        counter)
    );

    console.log("drawingBuffer", drawingBuffer[drawingBuffer.length - 1], drawingBuffer.length);

    if ( counter > 1 ) {
      // change vertice
      console.log( "vertice index is now", selectedVertice );
      if (selectedVertice < vertexCount - 2) {
        selectedVertice++;
        counter = 0;
      } 
      // else {
      //   selectedVertice = 0;
      // }
    } else {
      counter += step;
    }
    sk.drawVertices(drawingBuffer);
  };
});
