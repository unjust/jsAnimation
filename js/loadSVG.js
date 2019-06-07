
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';

const loader = new SVGLoader();

export default function loadSVG(
  url,
  group,
  doNotFlip=false,
  loadedCallback=()=>{} 
) {
  
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

    loadedCallback(group);
    return group;
  });
}