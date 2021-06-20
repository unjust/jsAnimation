import p5 from 'p5';

export const createRandomVertices = function(num, sk, withZ=false) {
  const anArray = [...Array(num).keys()];

  return anArray.reduce((verts) => {
    verts.push(
      new p5.Vector(
        sk.random(-sk.width/2, sk.width/2),
        sk.random(-sk.height/2, sk.height/2),
        (withZ) ? sk.random(-sk.height/2, sk.height/2) : undefined // TODO: find the fovi depth instead of height ?
    ))
    return verts;
  }, []);
}

export const selectNextRandomVertex = function(prev, constraint, withZ, sk ) {
  let v;
  if (constraint) {
    v = new p5.Vector(
      sk.random(-constraint, constraint),
      sk.random(-constraint, constraint),
      (withZ) ? sk.random(-constraint, constraint): undefined
    );
  } else {
    v =  new p5.Vector(sk.random(-sk.width/2, sk.width/2),
      sk.random(-sk.height/2, sk.height/2),
      (withZ) ? sk.random(-sk.height/2, sk.height/2) : undefined
    );
  }
  return (prev) ? p5.Vector.add(v, prev) : v
};

export const getStepVertices = (pointsArray, stepResolution=5) => {
  let vectorArray = [];
  const pLength = pointsArray.length;

  for (let p = 0; p < pLength; p++) {
    const p1 = pointsArray[p];
    const p2 = pointsArray[(p == pLength - 1) ? 0 : p + 1];
    const stepSizeX = (p2.x - p1.x) / stepResolution;
    const stepSizeY = (p2.y - p1.y) / stepResolution;

    for (let i = 0; i < stepResolution; i++) {
      vectorArray.push(new p5.Vector(p1.x + (stepSizeX * i), p1.y + (stepSizeY * i), p1.z));
      vectorArray.push(new p5.Vector(p1.x + (stepSizeX * i), p1.y + (stepSizeY * (i + 1)), p1.z));
    }
  }

  return vectorArray;
}

export const drawVertices = (verticesArray, sk) => {
  sk.beginShape();
  verticesArray.forEach((v) => sk.vertex(v.x, v.y, v.z));
  sk.endShape();
}

export const getContinuousVertices = function(v1, v2, pct) {
  const vertice = p5.Vector.lerp(v1, v2, pct);
  // console.log("getContinuousVertices", v1, v2, pct, vertice);
  return vertice;
}