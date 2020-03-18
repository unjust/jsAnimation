import p5 from 'p5';
import { drawCoordinates } from 'Utils/coordinates';
import { createRandomVertices, getContinuousVertices } from './myLib/verticesHelpers';
new p5((sk) => {

  let randomVertices;
  let drawingBuffer = [];
  let selectedVertice = 0;
  let counter = 0,
    step = .01;
  const vertexCount = 10;

  sk.setup = () => {
    sk.createCanvas(600, 500, sk.WEBGL);
    sk.background(255);
    drawCoordinates(sk);
    
    randomVertices = createRandomVertices(vertexCount, sk);
  };

  sk.drawVertices = (verticesArray) => {
    sk.beginShape();
    verticesArray.forEach((v) => sk.vertex(v.x, v.y));
    sk.endShape();
  }

  sk.draw = () => {
    sk.strokeWeight(2);
    sk.stroke(0);
    // comment noFill to have weird textures
    sk.noFill();

    drawingBuffer.push(
      getContinuousVertices( 
        randomVertices[selectedVertice], 
        randomVertices[selectedVertice+1],
        counter)
    );

    console.log("drawingBuffer", drawingBuffer[drawingBuffer.length - 1], drawingBuffer.length);

    if ( counter > 1 ) {
      // change vertice
      debugger
      console.log( "vertice index is now", selectedVertice );
      if (selectedVertice < vertexCount - 2) {
        selectedVertice++;
        counter = 0;
      } 
    } else {
      counter += step;
    }
    sk.drawVertices(drawingBuffer);
  };
});
