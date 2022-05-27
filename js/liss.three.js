import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import Liss from 'Framework/Lissajous.js';
import { accessMIDI } from "Utils/Midi.js"

let renderer, scene, camera, controls; 
let liss, drawCount, line;
let rotate = false, rotateXX = false;
const MAX_POINTS = 600;

function init() {
  accessMIDI(onMidi);
  const canvas = document.getElementById("myCanvas");
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio)
  // renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
  camera.position.set( 0, 0, 100 );
  camera.lookAt( 0, 0, 0 );

  controls = new OrbitControls( camera, renderer.domElement );

  scene = new THREE.Scene();
  // scene.background = new THREE.Color( 0xffffff );

  const geometry = new THREE.BufferGeometry();

  const vpositions = new Float32Array( MAX_POINTS * 3 )
  const vcolors = new Float32Array( MAX_POINTS * 4 );
  const color = new THREE.Color(0x0000ff);
  for ( let j = 0, l = 0; l < MAX_POINTS; l++) {
    const [ r, g, b ] = color.lerp(color, l/MAX_POINTS).toArray();
    // console.log(l/MAX_POINTS);
    vcolors[ j ++ ] = r;
    vcolors[ j ++ ] = g;
    vcolors[ j ++ ] = b;
    // vcolors[ j ++ ] = (Math.pow(l/MAX_POINTS, 2).toFixed(2) < 0.1) ? 0.1 : Math.pow(l/MAX_POINTS, 2).toFixed(2);
    // console.log(vcolors);
	}

  // console.log(vcolors[1]);
  geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vpositions, 3 ) );
  geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( vcolors, 3 ) );
  // geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( vcolors, 4 ) ); // change this for alpha and also item size
  geometry.attributes.color.itemSize = 3;
  // drawcalls
	drawCount = MAX_POINTS; // draw the first 2 points, only
	geometry.setDrawRange( 0, drawCount );

	// material
  // const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
	const material = new THREE.MeshBasicMaterial( { vertexColors: true, transparent: true } );
  const matLine = new LineMaterial( {

    color: 0x0000ff,
    linewidth: 5, // in world units with size attenuation, pixels otherwise
    vertexColors: true,

    //resolution:  // to be set by renderer, eventually
    dashed: false,
    alphaToCoverage: true,
    transparent: true
  } );
  line = new THREE.Line( geometry,  material );
  // line = new THREE.Line( geometry,  matLine );
	scene.add( line );

  liss = new Liss();
  liss.verticesTail = MAX_POINTS;
  liss.xFactor = 8;
  liss.yFactor = 3;
  liss.drawZ = true;
  liss.speed = 2.4;

	// update positions
	updatePositions();
  controls.update();
}

function updatePositions() {

	const positions = line.geometry.attributes.position.array;
  const colors = line.geometry.attributes.color.array;

  liss.update();
  const vertices = liss.vertices;
 
	// let x, y, z, index;
	// x = y = z = index = 0;
  //const color = new THREE.Color(0x0000ff);
  const points = Math.min(vertices.length, MAX_POINTS);
  
	for ( let i = 0, j = 0, l = 0; l < points; l ++ ) {
    const { x, y, z } = vertices[l];
    //const [ r, g, b ] = color.lerp(color, l/points).toArray();
		positions[ i ++ ] = x;
		positions[ i ++ ] = y;
		positions[ i ++ ] = z;
    // colors[ j ++ ] = r;
    // colors[ j ++ ] = g;
    // colors[ j ++ ] = b;
	}

}

function render() {
	renderer.render( scene, camera );
}

function animate() {

  if (rotateXX) {
    runCamera();
  }
	requestAnimationFrame( animate );
  // if (drawCount === MAX_POINTS) {
  //   drawCount 
  // }
	// drawCount = ( drawCount + 1 ) % MAX_POINTS;

	line.geometry.setDrawRange( 0, drawCount );

	//if ( drawCount === 0 ) {
		// periodically, generate new data
		updatePositions();
		line.geometry.attributes.position.needsUpdate = true; // required after the first render
		//line.material.color.setHSL( Math.random(), 1, 0.5 );
	//}
  controls.update();
	render();
}

const rotateX = new THREE.Matrix4().makeRotationX( 0.005 );

const runCamera = () => {
  camera.applyMatrix4( rotateX );
}

const onMidi = function(msg) {
  const [ type, key, velocity ] = msg.data;
  
  if (!key) {
    return;
  }
  // const [ type, key, velocity ] = msg.data;
  // console.log(msg.data)
  // https://code.tutsplus.com/tutorials/introduction-to-web-midi--cms-25220
  // 144 is note on
  // 176 - 191 is control change https://www.midi.org/specifications-old/item/table-2-expanded-messages-list-status-bytes

  console.log('midi: ', type, key, velocity);
 
  // if (key % 3 === 0) {
  //   liss.xFactor = velocity/3;
  // } else if (key % 2 === 0) {
  //   liss.yFactor = velocity/2.0;
  // } else {
  //   liss.setSpeed(velocity/100);
  // }
  
  if (key % 3 === 0) {
    liss.xFactor = key/3;
  } else if (key % 2 === 0) {
    liss.yFactor = key/2.0;
  } else {
    liss.setSpeed(velocity/100);
  }
  
}


document.addEventListener('keydown', (e) => {
  switch(e.key) {
    case 'x':
      liss.xFactor = (liss.xFactor - 1) % 16;
      break;
    case 'X':
      liss.xFactor = (liss.xFactor + 1) % 16;
      break;
    case 'y':
      liss.yFactor = (liss.yFactor - 1);
      break;
    case 'Y':
      liss.yFactor = (liss.yFactor + 1);
      break;
    case 's':
      liss.speed = liss.speed + 0.1;
      break;
    case 'R':
      liss.radius = liss.radius + 1.0;
      break;
    case 'c':
      controls.reset();
      break;
    case 'r':
      rotate = !rotate;
      controls.autoRotate = rotate;
      break;
    case 'f':
      rotateXX = !rotateXX;
      break;
  }
})

init();
animate();
