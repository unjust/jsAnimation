import p5 from 'p5';
// import 'p5/lib/addons/p5.sound';

new p5((sk) => {
  
  let sphereShader1, sphereShader2;
  let sphereTexture1, sphereTexture2;
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
    sphereShader1 = sk.loadShader('shaders/standard.vert', 'shaders/colorClouds.frag');
    sphereShader2 = sk.loadShader('shaders/standard.vert', 'shaders/colorClouds.frag');
  }
  sk.setup = () => {
     // disables scaling for retina screens which can create inconsistent scaling between displays
    sk.pixelDensity(1);
    sk.createCanvas(400, 400, sk.WEBGL);
    sk.noStroke();
    sphereTexture1 = sk.createGraphics(400, 400, sk.WEBGL);
    sphereTexture1.noStroke();
    sphereTexture2 = sk.createGraphics(400, 400, sk.WEBGL);
    sphereTexture2.noStroke();
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
    sk.background(0);
    sphereTexture1.shader(sphereShader1); 
    sphereTexture2.shader(sphereShader2); 
    // sk.shader(sphereShader1); 
    sphereShader1.setUniform('u_time', shot > 0.0 ? incrementShot() : 0.0 );
    sphereShader2.setUniform('u_time', shot > 0.0 ? incrementShot() : 0.0 );
    // theShader.setUniform('u_time', sk.frameCount/100);
    (counter < 1.0) ? counter += 0.01 : counter = 1.0;
    const originA = p5.Vector.lerp(origin1, origin2, counter);
    const originB = p5.Vector.lerp(origin3, origin4, counter);
    sphereShader1.setUniform('u_originA', [originA.x, originA.y]);
    sphereShader1.setUniform('u_originB', [originB.y, originB.y]);

    sphereShader2.setUniform('u_originA', [originA.x, originA.y]);
    sphereShader2.setUniform('u_originB', [originB.y, originB.y]);
    
    sphereShader1.setUniform('u_resolution', [sk.width, sk.height]);
    sphereShader2.setUniform('u_resolution', [sk.width, sk.height]);

    sphereShader1.setUniform('u_vector1', v3);
    sphereShader1.setUniform('u_vector2', v3_2);

    sphereShader2.setUniform('u_vector1', v3_3);
    sphereShader2.setUniform('u_vector2', v3_4);

    // CRUCIAL STEP THAT I DONT UNDERSTAND
    sphereTexture1.rect(0,0,sk.width,sk.height);
    sphereTexture2.rect(0,0,sk.width,sk.height);
     /* when you put a texture or shader on an ellipse it is rendered in 3d,
     so a fifth parameter that controls the # vertices in it becomes necessary,
     or else you'll have sharp corners. setting it to 100 is smooth. */
    // let ellipseFidelity = int(map(mouseX, 0, width, 8, 100));
    sk.push();
    sk.translate(-sk.width/2, -sk.height/2);
    sk.texture(sphereTexture1);
    sk.ellipse(56, 46, 90, 90, 50);
    
    sk.texture(sphereTexture2);
    sk.ellipse(300, 226, 105, 105, 100);
    // sk.rect(0,0,sk.width, sk.height);
    sk.pop();
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


