import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';

const NUM = 30;

let renderer, 
  scene, 
  camera,
  dims,
  videoTexture,
  pivot,
  yRotate = 0,
  shapes = [];

function init() {
  const rendererWidth = 1280,
        rendererHeight = 720;
  
  const canvasEl = document.getElementById( 'myCanvas' );
  renderer = new THREE.WebGLRenderer( 
    { canvas: canvasEl } 
  );
  canvasEl.style.width = rendererWidth;
  canvasEl.style.height = rendererHeight;

  camera = new THREE.PerspectiveCamera( 75, rendererWidth / rendererHeight, 1, 1000 );
  camera.position.set( 0, 0, 200 );

  renderer.setPixelRatio( window.devicePixelRatio );
  // renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setSize( rendererWidth, rendererHeight );
  
  dims = new THREE.Vector2();
  setDims();

  window.addEventListener( 'resize', onWindowResize, false );
  // document.addEventListener( 'mousemove', onMouseMove, false );

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x000000 );

  createVideoTexture();
  loadOctahedrons();

  // startRotateTween();
}

function createVideoTexture() {
  const video = document.createElement( 'video' );
  video.src = "img/sky.mov";
  video.loop = true;
  video.load();
  video.play();
  const videoImage = document.createElement( 'videoCanvas' );
  videoImage.width = 480;
  videoImage.height = 204;
  videoTexture = new THREE.VideoTexture(video);
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;
  videoTexture.format = THREE.RGBFormat;
}

function loadOctahedrons() {
  for (let i = 0; i < NUM; i++) {
    const oct = new THREE.OctahedronGeometry(10, 0);
    let material;
    
    if ( i % 6 == 0) {
      material = new THREE.MeshBasicMaterial({ map: videoTexture });
    } else {
      material = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,
        wireframe: true,
        wireframeLinewidth: 20
      });
    }

    const mesh = new THREE.Mesh(oct, material);
    scene.add(mesh);
    shapes.push(mesh);
    positionShape(mesh);
  }
}

function positionShape(shape) {
  shape.position.set(
    THREE.Math.randFloat(-dims.x/2, dims.x/2),
    THREE.Math.randFloat(-dims.y/4, dims.y/4),
    THREE.Math.randFloat(-200, 20),
  );
};


function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  setDims();
}

// function onMouseMove(e) {
//   const mx = e.clientX - dims.x/2;
//   const my = (dims.y - e.clientY) - dims.y/2;
//   console.log(mx, my);
// }

function setDims() {
  renderer.getSize(dims);
  //console.log(dims);
}

function startRotateTween() {
  return new TWEEN.Tween({ x: 0, y: 0 })
    .to({ x: 0, y: 0.1 }, 10000.)
    .delay(1000)
    .repeat(Infinity)
    .easing(TWEEN.Easing.Exponential.InOut)
    .onUpdate(function(object) {
      yRotate = object.y;
    })
    .start();
}

function draw() {
  requestAnimationFrame( draw );
  // TWEEN.update();
  // // console.log(yRotate);

  shapes.forEach((mesh) => {
    if (mesh.position.z > 180) {
      positionShape(mesh);
    } else {
      mesh.rotation.y += .01;
      mesh.position.z += .5;
    }
  });

  // pivot.rotateY(yRotate);
  renderer.render( scene, camera );
}

init();
draw();
