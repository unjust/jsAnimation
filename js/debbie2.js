import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';

/*
  confetti fall
  shoe centered
  world turning
  confetti breaks
  color change - black light mode

*/
const PIECES_COUNT = 5;
let confettiPieces = [];
let skateGroup;

const confettiSVGs = [
  './img/SVG/Confetti_Blue.svg',
  './img/SVG/Confetti_Green.svg',
  './img/SVG/Confetti_Pink.svg',
  './img/SVG/Confetti_Yello.svg'
];

const skatePath = './img/SVG/Skate.svg';
const dPath = './img/SVG/D_Pink.svg';
const d2Path = './img/SVG/D_Top.svg';

class Confetti {
  group;
  pos;
  posEnd;

  constructor(group, position=new THREE.Vector3(0, 0, 0)) {
    this.pos = position;
    this.posEnd = new THREE.Vector3(this.pos.x, 1000, this.pos.z)
    this.group = group;
    group.scale.multiplyScalar(THREE.Math.randFloat(0.05, 0.1));
    this.rate = THREE.Math.randFloat(0.08, 0.3)
  }

  setPosition(x, y, z) {
    this.group.position.set(x, y, z);
  }

  fall() {
    this.pos.y -= this.rate;
    this.group.position.y = this.pos.y;

    console.log(this.group.position);
  }

  break() {}
}

let renderer, 
  scene, 
  camera,
  loader,
  dims, 
  pivot;

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

  container.appendChild( renderer.domElement );

  window.addEventListener( 'resize', onWindowResize, false );
  document.addEventListener( 'mousemove', onMouseMove, false );

  pivot = new THREE.Group();
    
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xb0b0b0 );

  loader = new SVGLoader();
  loadConfetti();
  loadSkate();
}

function loadConfetti() {
  for (let c = 0; c < PIECES_COUNT; c++) {
    const file = confettiSVGs[THREE.Math.randInt(0, confettiSVGs.length - 1)];

    const group = new THREE.Group();
    loadSVG(file, group);

    const confetti = new Confetti(group);
    positionConfetti(confetti);
    confettiPieces.push(confetti);

    scene.add(group);
  }
}

function loadSkate() {
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
  // scene.add(skateGroup);
}

function positionConfetti(confetti) {
  confetti.setPosition(
    THREE.Math.randFloat(-dims.x/2, dims.x/2),
    THREE.Math.randFloat(dims.y/4, dims.y/4 + 10),
    THREE.Math.randFloat(-10., 10.)
  );
};

function loadSVG( url, group, doNotFlip=false, loadedCallback= () => {} ) {
  
  // const helper = new THREE.GridHelper( 160, 10 );
  // helper.rotation.x = Math.PI / 2;
  // scene.add( helper );

  loader.load( url, function ( data ) {

    console.log("loaded");

    const paths = data.paths;

    paths.forEach((path) => {
      const fillColor = path.userData.style.fill;
      const fillMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setStyle( fillColor ),
        opacity: path.userData.style.fillOpacity,
        transparent: path.userData.style.fillOpacity < 1,
        side: THREE.DoubleSide,
        depthWrite: false,
        wireframe: false
      });

      var shapes = path.toShapes(true);
      shapes.forEach((shape, i, arr) => {
        const geometry = new THREE.ShapeBufferGeometry( shape );
        const mesh = new THREE.Mesh( geometry, fillMaterial );
        // geometry.center();
        group.add( mesh );
      });
      
      const strokeColor = path.userData.style.stroke;
      
      if (strokeColor) {
        const strokeMaterial = new THREE.MeshBasicMaterial( {
          color: new THREE.Color().setStyle( strokeColor ),
          opacity: path.userData.style.strokeOpacity,
          transparent: path.userData.style.strokeOpacity < 1,
          side: THREE.DoubleSide,
          depthWrite: false,
          wireframe: false
        } );

        path.subPaths.forEach((subPath) => {
          const geometry = SVGLoader.pointsToStroke(subPath.getPoints(), path.userData.style);
          if ( geometry ) {
            const mesh = new THREE.Mesh( geometry, strokeMaterial );
            group.add( mesh );
          }
        });
      }
    });
   
    if (!doNotFlip) {
      group.scale.y *= -1;
    }

    loadedCallback();
    return group;
  });
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  setDims();
}

function onMouseMove(e) {
  const mx = e.clientX - dims.x/2;
  const my = (dims.y - e.clientY) - dims.y/2;
  //console.log(mx, my);
}

function setDims() {
  renderer.getSize(dims);
  //console.log(dims);
}

function draw() {
  requestAnimationFrame( draw );
  confettiPieces.forEach((c) => {
    c.group.rotation.y += .01;
    c.fall();
  });
  pivot.rotateY(.01);
  renderer.render( scene, camera );
}

init();
draw();
