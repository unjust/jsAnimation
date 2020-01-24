import p5 from "p5";
import Objekt from "Framework/Objekt";
import Cube from "Framework/Cube";
import Cone from "Framework/Cone";
import { createEasyCam } from "Libraries/easycam/p5.easycam.js";

new p5((sk) => {
  let shapeNum = 0;
  let objects = [];
  let counter = 0;
  const objectTypes = 3;

  const instanceNum = 300;

  sk.setup = () => {
    console.log("press any key to cycle the shape");
    sk.createCanvas(1280, 720, sk.WEBGL);
    createEasyCam.bind(sk)();

    for (let i = 0; i < instanceNum; i++) {
      objects.push(new Cube(sk, { side: 40 }));
      objects.push(new Cone(sk, { w:20, h:40 }));
      objects.push(new Objekt(sk, "sphere", { w:20, h:20 }, { stroke: 'white', fill: 'white' }));
    }
    sk.changeShape();
  };

  sk.keyPressed = () => {
    sk.changeShape();
  };

  sk.changeShape = () => {
    if (shapeNum == objectTypes - 1) {
      shapeNum = 0;
    } else {
      shapeNum++;
    }
  };

  sk.update = () => {
    counter+=0.5;
  };

  sk.draw = () => {
    sk.angleMode(sk.DEGREES);

    sk.clear();
    sk.translate(-sk.width/2, -sk.height/2);
    sk.noStroke();
    sk.rotate(10, sk.createVector(1, 0, 0));
   
    sk.update();

    const DIM = 80;

    let y = 0;
    for (
      let i = shapeNum, rowCount = 0;
      i < objects.length; 
      i+=3, rowCount++) {
      let x = DIM * rowCount;
      
      if (x > sk.width) {
        y += DIM;
        rowCount = 0;
      }
      // console.log(x, y);
      sk.push();
      sk.translate(x, y);
      sk.rotate(counter, sk.createVector(0, 1, 0));
      
      objects[i].draw();
      
      sk.pop();
    }
  };
});
