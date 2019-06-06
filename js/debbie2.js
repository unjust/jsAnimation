import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import loadSVG from './loadSVG';
import Confetti from './Confetti';

/*
  confetti fall
  shoe centered
  world turning
  confetti breaks
  color change - black light mode

*/
const PIECES_COUNT = 10;
let confettiPieces = [];
let skateGroup;

const skatePath = './img/SVG/Skate.svg';
const dPath = './img/SVG/D_Pink.svg';
const d2Path = './img/SVG/D_Top.svg';


let renderer, 
  scene, 
  camera,
  dims, 
  pivot,
  yRotate = 0;

function init() {
  camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.set( 0, 0, 200 );
  
  renderer = new THREE.WebGLRenderer( 
    { canvas: document.getElementById( 'myCanvas' ), antialias: true } 
  );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );

  dims = new THREE.Vector2();
  setDims();
  // container.appendChild( renderer.domElement );

  window.addEventListener( 'resize', onWindowResize, false );
  // document.addEventListener( 'mousemove', onMouseMove, false );

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xb0b0b0 );

  loadConfetti();

  pivot = new THREE.Group();
  loadSkate(pivot);
  startRotateTween();
}

function loadConfetti() {
  for (let c = 0; c < PIECES_COUNT; c++) {
    const confetti = new Confetti();
    positionConfetti(confetti);
    confettiPieces.push(confetti);
    scene.add(confetti.getGroup());
  }
}

function loadSkate(pivot) {
  skateGroup = new THREE.Group();
  loadSVG(skatePath, skateGroup, false, () => {
    var box = new THREE.Box3().setFromObject(skateGroup);
    box.getCenter(skateGroup.position); // this re-sets the mesh position
   
    let v = new THREE.Vector3();
    box.getSize(v)
    skateGroup.position.set(-v.x/3, v.y/2, 0);
    pivot.add(skateGroup);
    scene.add(pivot);
  });

  // loadSVG('./img/SVG/DD.svg', skateGroup, true);
  skateGroup.scale.multiplyScalar(.1);
}

function positionConfetti(confetti) {
  confetti.setPosition(
    THREE.Math.randFloat(-dims.x/2, dims.x/2),
    THREE.Math.randFloat(dims.y/4, dims.y/4 + 10),
    THREE.Math.randFloat(-10., 10.)
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
  TWEEN.update();
  // console.log(yRotate);

  confettiPieces.forEach((c) => {
    c.group.rotation.y += .01;
    c.fall();
  });

  pivot.rotateY(yRotate);
  renderer.render( scene, camera );
}

init();
draw();
