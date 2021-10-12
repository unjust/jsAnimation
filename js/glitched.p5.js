import p5 from 'p5';
import { createEasyCam } from 'Libraries/easycam/p5.easycam.js';

new p5((sk) => {
  const objectVertices = [];
  let counter = 0.0;
  let index = 0;
  let shapeIsFinished = false;

  sk.setup = () =>  {
    sk.createCanvas(800, 400, sk.WEBGL);
    (createEasyCam.bind(sk))();
  };

  const squarePoints = [
    sk.createVector(0, 0, 200),
    sk.createVector(200, 0, 200),
    sk.createVector(200, 0, 0),
    sk.createVector(0, 0, 0),
    sk.createVector(0, 0, 200),
  ];

  const interp = (a, b, currentPercentage) => {
    // could use lerp ?
    const x = (1 - currentPercentage) * a.x + (currentPercentage * b.x);
    const y = (1 - currentPercentage) * a.y + (currentPercentage * b.y);
    const z = (1 - currentPercentage) * a.z + (currentPercentage * b.z);
    return sk.createVector(x, y, z);
  };

  sk.draw = () => {
    sk.background(255);
    sk.noFill();
    sk.strokeWeight(1);
    sk.stroke(0);

    if (counter < 1.0) {
      counter += 0.01;
    } else {
      // reset counter
      counter = 0;
      // flush vertices, because we already drew them
      objectVertices.splice(0, objectVertices.length);

      // if we are up until one before the las vertice
      if (index <= squarePoints.length - 2) {
        index += 1;
      }
    }
    
    if (index <= squarePoints.length - 2) {
      console.log("drawing dynamically");
      objectVertices.push(interp(squarePoints[index], squarePoints[index + 1], counter));
    }

    // if we are after the first index, start drawing with lines
    if (index > 0) {
      sk.beginShape();
      for (let i = 0; i <= index; i++) {
        const { x, y, z } = squarePoints[i];
        sk.vertex(x, y, z);
      }
      sk.endShape();
    }

    // if we have vertices in the buffer, we are still in drawing mode
    for (let v = 0; v < objectVertices.length; v++) {
      if (v === 0) {
        sk.beginShape();
      }
      const vert = objectVertices[v];
      // console.log(vert.x, vert.y);
      sk.vertex(vert.x, vert.y, vert.z);
      if (v === objectVertices.length - 1) {
        sk.endShape();
      }
    }

    // if we are at the last vertex
    if (index === squarePoints.length - 1) {
        shapeIsFinished = true;
    }
  };

}, document.querySelector('#container'));
