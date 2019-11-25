import p5 from "p5";
import Cone from "./myLib/Cone.js";
import Cube from "./myLib/Cube.js";
import OrbitMixin from "./myLib/mixins/orbit.js";
import { createEasyCam } from "Libraries/easycam/p5.easycam.js";

const SET_COUNT = 3;
let shapeSets = [];

window.$p5 = new p5((sk) => {

  let point1,
    point2,
    orbitPoint,
    canvas;

  const orbitDiameter = 50,
    SPACING = orbitDiameter*2 + 30;

  sk.setup = () => {
    canvas = sk.createCanvas(1200, 800, sk.WEBGL);
    createEasyCam.bind(sk)();
    
    const speed = .01;
    let id = 0;

    for (let x = 0; x <= sk.width; x+= SPACING) {
      for (let y = 0; y <= sk.height; y+= SPACING) {
   
        point1 = sk.createVector(x, y, 0);
        point2 = new p5.Vector(point1.x, point1.y + orbitDiameter, point1.z);
        orbitPoint = p5.Vector.lerp(point1, point2, 0.5);
    
        const cone = new Cone(12, 25, 0, 0, 0);
        Object.assign(cone, OrbitMixin);
        cone.initOrbit(0, speed, point1, orbitPoint);
        cone.id = id++;
  
        const cube = new Cube(20, 0, 0, 0);
        Object.assign(cube, OrbitMixin);
        cube.initOrbit(0, speed, point2, orbitPoint);
        cube.id = id++;

        shapeSets.push({ cone, cube });
      }
    }
  }

  sk.update = () => {}

  sk.draw = () => {
    //$p5.clear();

    $p5.background(88);
    $p5.push();
    $p5.translate(-sk.width/2, -sk.height/2);

    shapeSets.forEach((set, i) => {
      const { cone, cube } = set;

      //sk.update(set);
      let outsideCanvas = (cone.orbitPoint.x - cone.distanceVector.x) > canvas.width;

      if (outsideCanvas) {
        cone.orbitPoint.x = -1 * SPACING;
        cube.orbitPoint.x = -1 * SPACING;
      }
      cone.drawOrbit();
      cube.drawOrbit();
    });

    $p5.pop();
  }

});
