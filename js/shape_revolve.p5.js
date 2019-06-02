import p5 from "p5";
import Cone from "./myLib/Cone.js";
import Cube from "./myLib/Cube.js";
import OrbitMixin from "./myLib/mixins/orbit.js";
import { createEasyCam } from "Libraries/easycam/p5.easycam.js";


const SET_COUNT = 3;
let shapeSets = [];

window.$p5 = new p5((sk) => {

  let point1, point2, orbitPoint;

  sk.setup = () => {
    sk.createCanvas(400, 400, sk.WEBGL);
    createEasyCam.bind(sk)();
    
    const speed = .01;
    const orbitDiameter = 50;
    
    for (let x = 0; x <= sk.width; x+=orbitDiameter*2 + 30) {
      for (let y = 0; y <= sk.height; y+=orbitDiameter*2 + 30) {   
        // point1 = sk.createVector(sk.random(sk.width), sk.random(sk.height), 0);
        point1 = sk.createVector(x, y, 0);
        point2 = p5.Vector.add(point1, p5.Vector.mult(sk.createVector(1, 1, 0), orbitDiameter));
        orbitPoint = p5.Vector.lerp(point1, point2, 0.5);
    
        const cone = new Cone(12, 25, 0, 0, 0);
        Object.assign(cone, OrbitMixin);
        cone.initOrbit(0, speed, point1, orbitPoint);
        // cone.stopped = true;

        const cube = new Cube(20, 0, 0, 0);
        Object.assign(cube, OrbitMixin);
        cube.initOrbit(0, speed, point2, orbitPoint);
        // cube.stopped = true;

        shapeSets.push({ cone, cube });
      }
    }
  }

  sk.update = () => {
   // cone.position();
   // cube.position();
  }

  sk.draw = () => {
    $p5.clear();
    $p5.push();
  
    $p5.translate(-sk.width/2, -sk.height/2);
    $p5.stroke('purple');
    sk.box(10, 10);

    shapeSets.forEach((set, i) => {
      const { cone, cube } = set;
      // $p5.push();
      // this will jitter $p5.translate(point.x, point.y, 0);
      
      cone.drawOrbit();
      cube.drawOrbit();
    });

    $p5.pop();
  }

});