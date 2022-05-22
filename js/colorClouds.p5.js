import p5 from 'p5';
// import 'p5/lib/addons/p5.sound';

new p5((sk) => {

  let theShader;
  let shot = 0.0, 
    origin1 = sk.createVector(0.0, 0.0),
    origin2 = sk.createVector(0.0, 0.0),
    origin3 = sk.createVector(0.0, 0.0),
    origin4 = sk.createVector(0.0, 0.0),
    counter = 0.0,
    v3 = sk.createVector(0.0, 0.0, 0.0),
    v3_2 = sk.createVector(0.0, 0.0, 0.0),
    v3_3 = sk.createVector(0.0, 0.0, 0.0),
    v3_4 = sk.createVector(0.0, 0.0, 0.0);

  sk.preload = () => {
    theShader = sk.loadShader('shaders/standard.vert', 'shaders/colorClouds.frag');
  }
  sk.setup = () => {
     // disables scaling for retina screens which can create inconsistent scaling between displays
    sk.pixelDensity(1);
    sk.createCanvas(400, 400, sk.WEBGL);
    console.info('press s to generate a color at a random origin');
  };

  const incrementShot = () => {
    if (shot < sk.PI) {
      shot += 0.05;
    } else {
      shot = 0.0;
    }
    return Math.sin(shot);
  }

  sk.draw = () => {
    sk.background(255);
    theShader.setUniform('u_time', shot > 0.0 ? incrementShot() : 0.0 );
    // theShader.setUniform('u_time', sk.frameCount/100);
    (counter < 1.0) ? counter += 0.01 : counter = 1.0;
    const originA = p5.Vector.lerp(origin1, origin2, counter);
    const originB = p5.Vector.lerp(origin3, origin4, counter);
    theShader.setUniform('u_originA', [originA.x, originA.y]);
    theShader.setUniform('u_originB', [originB.y, originB.y]);
    theShader.setUniform('u_resolution', [sk.width, sk.height]);
    theShader.setUniform('u_vector1', v3);
    theShader.setUniform('u_vector2', v3_2);
    theShader.setUniform('u_vector3', v3_3);
    theShader.setUniform('u_vector4', v3_4);
    sk.shader(theShader); 
    //sk.fill('white');
    sk.rect(0,0,sk.width, sk.height);
  };

  sk.keyPressed = function () {
    if (sk.key === 's') {
      origin1 = sk.createVector(sk.random(0.0, 0.5), sk.random(0.0, 0.5));
      origin2 = sk.createVector(sk.random(0.0, 0.5), sk.random(0.0, 0.5));
      origin3 = sk.createVector(sk.random(0.5, 1.0), sk.random(0.5, 1.0));
      origin4 = sk.createVector(Math.random(), Math.random());
      v3   = p5.Vector.random3D().array().map(v => Math.abs(v));
      v3_2 = p5.Vector.random3D().array().map(v => Math.abs(v));
      v3_3 = p5.Vector.random3D().array().map(v => Math.abs(v));
      v3_4 = p5.Vector.random3D().array().map(v => Math.abs(v));
      console.log(v3_2, origin3);
      counter = 0.0;
      incrementShot();
    }
  }

  sk.mousePressed = function() {
  }
}, document.querySelector('#container'));


