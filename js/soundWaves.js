// paper js waveform sound responsive
import { paper, Path, Point } from 'paper';

(function soundWaves() {

  let width,
    height, 
    center;

  const points = 8;

  let path, 
    mousePos, 
    pathHeight, 
    smooth = true;

  paper.setup(document.getElementById("myCanvas"));
  const view = paper.view;

  let analyzer, dataArray;

  initializePath();
  initAudioAnalyzer();

  window.navigator.mediaDevices.enumerateDevices().then((devices) => {
    console.log(devices);
    devices = devices.filter((d) => d.kind === 'audioinput');
  });

  function initAudioAnalyzer() {
    window.navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then((stream) => {
        const size = 1024;
        const context = new (window.AudioContext || window.webkitAudioContext);
        const src = context.createMediaStreamSource(stream);
        const processor = context.createScriptProcessor(size, 1, 1);

        // src.connect(processor);
        // processor.connect(context.destination);

        analyzer = context.createAnalyser();
        src.connect(analyzer);

        analyzer.fftSize = size * 2;
        const bufferLength = analyzer.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);

        processor.onaudioprocess = (e) => {
          // console.log(e.inputBuffer);
        }
      });
  }

  function initializePath() {
   
    path = new Path();

    mousePos = { x: view.center.x / 2, y: view.center.y /2 };
    pathHeight = mousePos.y;
    path.fillColor = 'black';

    center = view.center;
    width = view.size.width;
    height = view.size.height / 2;
    path.segments = [];
    path.add(view.bounds.bottomLeft);

    for (var i = 1; i < points; i++) {
      var point = new Point(width / points * i, center.y);
      path.add(point);
    }

    path.add(view.bounds.bottomRight);
    path.fullySelected = true;
  }

  paper.view.onFrame = (event) => {
    let volume = 0;
    if (analyzer) {
      analyzer.getByteTimeDomainData(dataArray);
    }
    pathHeight += (center.y - mousePos.y - pathHeight) / 10;

    for (var i = 1; i < points; i++) {
      

      if (analyzer) {
        const index = i - 1;
        const section = dataArray.length / points;
        const arr = dataArray.slice(index * section, index * section + section);
        volume = arr.reduce((total, v) => total + v);
      }
      var sinSeed = event.count + (i + i % 10) * 100;
      var sinHeight = Math.sin(sinSeed / 200) * pathHeight;
      var yPos = Math.sin(sinSeed / 100) * sinHeight - volume/200 + height;

      ///console.log(volume);
      path.segments[i].point.y = yPos;
    }
    if (smooth) {
      path.smooth({ type: 'continuous' });
    }
  }

  paper.view.onMouseMove = (event) => {
    mousePos = event.point;
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
  }

  // Reposition the path whenever the window is resized:
  paper.view.onResize = (event) => {
    initializePath();
  }

}());
