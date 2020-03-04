// paper js waveform sound responsive
import { paper, Path, Point, Shape } from 'paper';
import AudioDetect from 'Utils/AudioDetect.js';

(function soundSpring() {

  // paper js
  let pathWidth,
    pathHeight, 
    center,
    mousePos,
    path,
    smooth = true;


  paper.setup(document.getElementById("myCanvas"));
  const view = paper.view;
  let viewWidth = view.size.width;
  let viewHeight = view.size.height;
  const MIN = view.size.height * .01; // 0 starts at top
  const MAX = view.size.height * .99; 

  // spring
  const MASS = 2.8,
    K = 0.2,
    DAMP = 0.92,
    REST = view.size.height / 2; // halfway
 
  let acc = 0.,
    vel = 0,
    pos = REST, // halfway
    watchedPos = 0,
    force = 0.;

  let released = false, active = false;

  initializePath();
  AudioDetect.init();

  function initializePath() {
    path = new Path();
    path.fillColor = 'black';

    pathHeight = REST;
    pathWidth = view.size.width / 5;
    center = view.center;

    const pathLeft = { x: center.x - pathWidth / 2, y: view.size.height };
    path.add(pathLeft);

    let point = new Point(pathLeft.x, pathHeight);
    path.add(point);
    
    point = new Point(pathLeft.x + pathWidth, pathHeight);
    path.add(point);

    path.add(pathLeft.x + pathWidth, view.size.height);
    path.fullySelected = true;
  }

  function update() {
    if (released) {
      force = - 1 * K * (pos - REST);
      acc = force / MASS;
      vel = DAMP * (vel + acc);
      // console.log(`pos ${pos} vel ${vel} acc ${acc} force ${force}`);
      pos = pos + vel;

      if(Math.abs(vel) < 0.1) {
        vel = 0.0;
      }
      if (Math.abs(pos - REST) < .1) {
        released = false; // at rest
      }
    }
  }

  function draw() {
    if (smooth) {
      path.smooth({ type: 'continuous' });
    }
    for (let i = 1; i < path.segments.length - 1; i++) {
      path.segments[i].point.y = pos;
    }
  }

  function watchValue(val) {
    // console.log(val);
    // pos = val - pathHeight/2;
    watchedPos = Math.max(MIN, Math.min(val, MAX));
  }

  paper.view.onFrame = (event) => {

    const audioArray = AudioDetect.updateAudio();
    // const active = (!!audioArray && released == false);
    const active = (!!audioArray);

    if (active) {
      // watchValue(audioVal);

      if (AudioDetect.beatDetect()) {
        pos = pos + 100;
        released = true;
      }
    }
    update();
    draw();

    //AudioDetect.drawOscilloscope(viewWidth, viewHeight);
    AudioDetect.drawFFT(viewWidth, viewHeight);
  }

  paper.view.onMouseMove = (event) => {
    mousePos = event.point;
    // console.log(mousePos);
    if (active) {
      watchValue(mousePos.y);
    }
  }

  paper.view.onMouseDown = (event) => {
    smooth = !smooth;
    if (!smooth) {
      // If smooth has been turned off, we need to reset
      // the handles of the path:
      for (var i = 0, l = path.segments.length; i < l; i++) {
        var segment = path.segments[i];
        segment.handleIn = segment.handleOut = null;
      }
    }
    active = true;
    released = false;
  }

  paper.view.onMouseUp = (event) => {
    active = false;
    released = true;
  }

  // Reposition the path whenever the window is resized:
  paper.view.onResize = (event) => {
    initializePath();
    viewHeight = paper.view.height;
    viewWidth = paper.view.width;
  }

}());
