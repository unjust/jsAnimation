import * as THREE from 'three';
import loadSVG from './loadSVG';

const confettiSVGs = [
  './img/SVG/Confetti_Blue.svg',
  './img/SVG/Confetti_Green.svg',
  './img/SVG/Confetti_Pink.svg',
  './img/SVG/Confetti_Yello.svg'
];

export default class Confetti {
  group;
  pos;
  posEnd;

  constructor(position=new THREE.Vector3(0, 0, 0)) {
    this.initGroup();

    this.setPosition(position.x, position.y, position.z);
    this.posEnd = new THREE.Vector3(this.pos.x, -100, this.pos.z)
    
    this.group.scale.multiplyScalar(THREE.Math.randFloat(0.05, 0.1));
    this.rate = THREE.Math.randFloat(0.08, 0.3)
  }

  initGroup() {
    const file = confettiSVGs[THREE.Math.randInt(0, confettiSVGs.length - 1)];
    this.group = new THREE.Group();
    loadSVG(file, this.group);
  }

  getGroup() {
    return this.group;
  }

  setPosition(x, y, z) {
    if (typeof(x) === THREE.Vector3) {
      x = x.x;
      y = x.y;
      z = x.z;
    }
    this.pos = new THREE.Vector3(x, y, z);
    this.group.position.set(this.pos.x, this.pos.y, this.pos.z);
  }

  fall() {
    this.pos.y -= this.rate;
    this.group.position.y = this.pos.y;

    // console.log("IM HERE", this.group.position);
  }

  break() {}
}