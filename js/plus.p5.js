import p5 from 'p5';
import { drawCoordinates } from 'Utils/coordinates';

new p5((sk) => {
  const center = sk.createVector(0, 0);
  const radius = 80;
  let counter = 0;
  let steps = 4;

  sk.setup = () => {
    sk.createCanvas(600, 500, sk.WEBGL);
    sk.background(255);
    drawCoordinates(sk);
    
    
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

  const drawSteps = (pointsArray, stepResolution) => {
    let vectorArray = [];
    const pLength = pointsArray.length;

    for (let p = 0; p < pLength; p++) {
      const p1 = pointsArray[p];
      const p2 = pointsArray[(p == pLength - 1) ? 0 : p + 1];
      const stepSizeX = (p2.x - p1.x) / stepResolution;
      const stepSizeY = (p2.y - p1.y) / stepResolution;

      for (let i = 0; i < stepResolution; i++) {
        vectorArray.push(sk.createVector(p1.x + (stepSizeX * i), p1.y + (stepSizeY * i)));
        vectorArray.push(sk.createVector(p1.x + (stepSizeX * i), p1.y + (stepSizeY * (i + 1))));
      }
    }

    sk.beginShape();
    vectorArray.forEach((v) => sk.vertex(v.x, v.y));
    sk.endShape();
  }

  sk.draw = () => {
    sk.strokeWeight(2);
    sk.stroke(0);
    
    // sk.stroke((counter % 2 == 0) ? 255 : 0);
    // drawCross(center.x, center.y, thickness, (counter * thickness) + radius);
    // drawCross(center.x, center.y, radius, steps);


    drawStepsBetweenTwoPoints(
      sk.createVector(-100, 0),
      sk.createVector(0, -100),
      5
    );
   
    drawStepsBetweenTwoPoints(
      sk.createVector(0, -100),
      sk.createVector(100, 0),
      5
    );

    drawSteps(
      [ sk.createVector(-100, 0),
        sk.createVector(0, -100),
        sk.createVector(100, 0),
        sk.createVector(0, 100),
        sk.createVector(0, 100),
        sk.createVector(-100, 0)
      ], 5);

    // drawStepsBetweenTwoPoints(
    //   sk.createVector(100, 0),
    //   sk.createVector(0, 100),
    //   5
    // );
   
    // drawStepsBetweenTwoPoints(
    //   sk.createVector(0, 100),
    //   sk.createVector(-100, 0),
    //   5
    // );
    
  };
});
