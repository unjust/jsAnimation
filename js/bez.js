import { paper, Point, Path } from 'paper';

(function myApp() {

  let segmentPoints = 8,
    segmentVerts = [],
    counter = 0;

  let isCurved = false;
  let baseSpacing = 20;
  let lineSpacing = baseSpacing;

  paper.setup(document.getElementById("myCanvas"));
  
  paper.project.view.viewSize.set(800, 400);
  let { height: canvasHeight, width: canvasWidth } = paper.project.view.size;

  const view_center = paper.view.center;

  paper.view.onMouseDown = (event) => {
      // interaction here
      console.log('clicked');
  };

  const paths = [];
  const initPaths = () => {
    for (let i = 0; i < canvasHeight / (baseSpacing * .5); i++) {
      const aPath = new Path({ strokeColor: 'black' });
      for (let i = 0; i <= segmentPoints; i++) {
        aPath.add(new Point(0, 0));
      }
      paths.push(aPath);
    }
    
  };
  initPaths();

  const segmentMotion = (counter, i) => {
    const sinSeed = counter + (i + i % 10) * 100;
    const sinWidth = Math.sin(sinSeed / 200);
    const sinHeight = Math.sin(sinSeed / 100);
    const dx = Math.sin(sinSeed / 100) * sinWidth * lineSpacing * 5;
    const dy = Math.sin(sinSeed / 100) * sinHeight * lineSpacing * 5;
    
    // const c = 3 * Math.cos(counter/10);
    return { dx, dy };
  }

  paper.view.onMouseDown = (e) => {
    isCurved = !isCurved;
  }

  paper.view.onFrame = (e) => {
    // animation here
    // console.log('hello world', view_center);

    counter += .5;
    segmentMotion(counter);

    const baseXDistance = canvasWidth/segmentPoints;
    
    lineSpacing = baseSpacing + (Math.cos(counter/100) * 10);

    paths.forEach((aPath, p) => {
      if (isCurved) {
        aPath.smooth({ type: 'continuous' });
      } 
      const y = lineSpacing * p;
      for ( let i = 0; i <= segmentPoints; i++ ) {
        const x = baseXDistance * i;
        
        const segment = aPath.segments[i],
          p = segment.point;
        const { dx, dy } = segmentMotion(counter, i);
        p.x = x + dx;
        p.y = y + dy;

        if (!isCurved) {
          segment.handleIn = segment.handleOut = null;
        }
      }
    });
  };
})();
