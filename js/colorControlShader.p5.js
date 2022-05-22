import p5 from 'p5';

/**
 * shader with background of undulating color
 * controllable with keyboard
 */
new p5((sk) => {

  let theShader;
  const colorVector = sk.createVector(105.0, 0.0, 0.0);
  let v = 0;

  sk.preload = () => {
    theShader = sk.loadShader('shaders/standard.vert', 'shaders/noiseGrad2.frag');
  }

  sk.setup = () => {
    sk.pixelDensity(1);
    sk.createCanvas(400, 400, sk.WEBGL);
  };

  sk.keyPressed = () => {
    switch(sk.key) {
      case 'r':
        const v = colorVector.add(1.0, 0., 0.);
        console.log(v);
        break;
      case 'R':
        colorVector.add(-1.0, 0., 0.);
        break;
      case 'g':
        colorVector.add(0.0, 1., 0.);
        break;
      case 'G':
        colorVector.add(0.0, -1., 0.);
        break;
      case 'b':
        colorVector.add(0.0, 0., 1.);
        break;
      case 'B':
        colorVector.add(0.0, 0., -1.);
        break;
      case 'v':
        v -= 1;
        break;
      case 'V':
        v += 1;
        break;
    }
    console.log(colorVector, v);
  }

  sk.draw = () => {
    theShader.setUniform('u_resolution', [sk.width, sk.height]);
    theShader.setUniform('u_colorVector', [colorVector.x/255.0, colorVector.y/255.0, colorVector.z/255.0]);
    theShader.setUniform('u_value', v);
    theShader.setUniform('u_time', sk.frameCount);
    sk.shader(theShader);

    sk.rect(0,0,sk.width, sk.height);
  };

}, document.querySelector('#container'));


