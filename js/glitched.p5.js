import p5 from 'p5';
import { createEasyCam } from 'Libraries/easycam/p5.easycam.js';

new p5((sk) => {
  const objectVertices = [];
  let counter = 0.0;
  let index = 0;

  sk.setup = () =>  {
    sk.createCanvas(800, 400, sk.WEBGL);
    (createEasyCam.bind(sk))();
  };

  const squarePoints = [
    sk.createVector(0, 200, 200),
    sk.createVector(200, 200, 0),
    sk.createVector(200, 0, 200),
    sk.createVector(0, 0, 200)
  ];

  const interp = (a, b, currentPercentage) => {
    const x = (1 - currentPercentage) * a.x + (currentPercentage * b.x);
    const y = (1 - currentPercentage) * a.y + (currentPercentage * b.y);
    const z = (1 - currentPercentage) * a.z + (currentPercentage * b.z);
    objectVertices.push(sk.createVector(x, y, z));
  };

  sk.draw = () => {
    sk.background(255);
    sk.strokeWeight(1);
    sk.stroke(0);

    if (counter < 1.0) {
      counter += 0.01;
    } else {
      counter = 0;
    }
    interp(squarePoints[index], squarePoints[index + 1], counter);

    if (index < squarePoints.length - 2) {
      index += 1;
    } else {
      // debugger
      index = 0;
    }
    
    sk.beginShape();
    for (let v = 0; v < objectVertices.length; v++) {
      const vert = objectVertices[v];
      // console.log(vert.x, vert.y);
      sk.vertex(vert.x, vert.y, vert.z);
    }
    sk.endShape();
  };

}, document.querySelector('#container'));
