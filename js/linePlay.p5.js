import p5 from 'p5';

new p5((sk) => {
  let canvasHeight,
    canvasWidth;

  let segmentPoints = 8,
    segmentVerts = [],
    counter = 0;

  let isCurved = false;

  let baseSpacing = 20;
  let lineSpacing = baseSpacing;

  sk.setup = () => {
    sk.createCanvas(sk.windowWidth + 200, 500, sk.WEBGL);
    canvasHeight = sk.height;
    canvasWidth = sk.width;
    sk.background('white');
    chooseVertices();
  };

  sk.windowResized = function() {
    sk.resizeCanvas(sk.windowWidth + 200, 500);
    canvasHeight = sk.height;
    canvasWidth = sk.width;
  }

  const chooseVertices = () => {
    for (let i = 0; i <= segmentPoints; i++) {
      segmentVerts.push(new p5.Vector(0, 0));
    }
  };

  const segmentMotion = (counter) => {
    segmentVerts.forEach((vect, i) => {
      const sinSeed = counter + (i + i % 10) * 100;
      const sinWidth = Math.sin(sinSeed / 200);
      const sinHeight = Math.sin(sinSeed / 100);
      const dx = Math.sin(sinSeed / 100) * sinWidth * lineSpacing * 5;
      const dy = Math.sin(sinSeed / 100) * sinHeight * lineSpacing * 5;
      // const dy = Math.sin(sinSeed / 200) * (lineSpacing * 5);
      vect.x = dx;
      vect.y = dy;
    });

    const c = 3 * Math.cos(counter/10);
    lineSpacing = baseSpacing + (Math.cos(counter/100) * 10);
  }
  
  sk.mouseClicked = () => {
    isCurved = !!isCurved;
  }

  sk.draw = () => {
    sk.background(255);
    counter += .5;
    segmentMotion(counter);

    sk.push();
    sk.translate(-canvasWidth/2, -canvasHeight/2);
    
    const baseXDistance = canvasWidth/segmentPoints;

    for (
        let y = 0, j = 1;
        y < canvasHeight - 200;
        y += lineSpacing,
        j++) {

      sk.stroke(100 + (5 * j));
      segmentVerts.forEach((vect, i, arr) => {
        const x = baseXDistance * i;
        sk.beginShape(sk.LINES);
        sk.vertex(x + vect.x, y + vect.y);
        // console.log(vect, x + vect.y, y + vect.y);
        if (arr[i + 1]) { // if next array point exists
          const nextVect = arr[i + 1];
          sk.vertex(x + baseXDistance + nextVect.x, y + nextVect.y);
        }
        sk.endShape();
      });
    }
    sk.pop();
  };
}, window.document.getElementById('container'));
