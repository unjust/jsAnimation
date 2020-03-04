import p5 from 'p5';
import { createEasyCam, EasyCamLib } from 'Libraries/easycam/p5.easycam.js';

new p5((sk) => {
  let m, n1, n2, n3;

  const r = 200.0;
  const detail = 50;
  let offset = 0;

  sk.setup = () => {
    sk.createCanvas(sk.windowWidth, sk.windowHeight - 200, sk.WEBGL);
    createEasyCam.bind(sk)({ distance: 1000, center:[20, 20, 20] });
    
  };

  const a = 1;
  const b = 1;

  //http://paulbourke.net/geometry/supershape/
  function supershape(theta, m, n1, n2, n3) {
    let t1 = Math.abs(1/a * Math.cos(m * theta / 4));
    t1 =  Math.pow(t1, n2);

    let t2 = Math.abs(1/b * Math.sin(m * theta /4));
    t2 = Math.pow(t2, n3);

    let result = Math.pow(t1 + t2, -1 /n1);
    return result;
  };

  sk.draw = () => {
    sk.background(0);
    sk.noStroke();
    //sk.lights();
    //sk.circle(0, 10, 10);

    const m = sk.map(sk.mouseX, 0, sk.width, 0, 7);
    let globe = []; // 2 dimenstional array

    for (let x = 0; x <= detail; x++ ) {
      let lonArray = [];
      const lat = sk.map(x, 0, detail, -sk.HALF_PI, sk.HALF_PI); 
      const r1 = supershape(lat, m, .2, 1.7, 1.7);
      // const r1 = supershape(lat, 2, 10, 10, 10);
      for (let y = 0; y <= detail; y++) {
        
        let lon = sk.map(y, 0, detail, -sk.PI, sk.PI); 
        const r2 = supershape(lon, m, .2, 1.7, 1.7);
        // const r2 = supershape(lon, 8, 60, 100, 30);

        const px = r * r1 * Math.cos(lon) * r2 * Math.cos(lat);
        const py = r * r1 * Math.sin(lon) * r2 * Math.cos(lat);
        const pz = r * r2 * Math.sin(lat);
        lonArray.push(new p5.Vector(px, py, pz));
      }
      globe[x] = lonArray;

      
    }
    
    offset += 6;
    for (let x = 0; x < detail; x++ ) {
      sk.beginShape(sk.TRIANGLE_STRIP);
      // sk.stroke(255);
      const hu = sk.map(x, 0, detail, 0, 255 * 6);
      sk.fill((hu + offset) % 255, 255, 255);

      for (let y = 0; y < detail+1; y++) {
        sk.colorMode(sk.HSB, 255);
    
        
        const v1 = globe[x][y];
        // const rando = p5.Vector.random3D().mult(10);
        // v1.add(rando);
        sk.vertex(v1.x, v1.y, v1.z);
        const v2 = globe[x+1][y];
        sk.vertex(v2.x, v2.y, v2.z);
      }

      sk.endShape();
    }
  }
});