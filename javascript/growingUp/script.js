var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var orbitControls = new THREE.OrbitControls(camera, renderer.domElement);

var light = new THREE.AmbientLight( 0x404040 );
scene.add(light);

var lights = [];
lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

lights[ 0 ].position.set( 0, 200, 0 );
lights[ 1 ].position.set( 100, 200, 100 );
lights[ 2 ].position.set( - 100, - 200, - 100 );

scene.add( lights[ 0 ] );
scene.add( lights[ 1 ] );
scene.add( lights[ 2 ] );

//var geometry = new THREE.SphereGeometry(1,32,32,0,1);
/*var centralCurve = new THREE.Curve();
centralCurve.getPoint = t => {
  parameter = t*0;
  const x = Math.cos(parameter),
  y = parameter,
  z = Math.sin(parameter)
  return new THREE.Vector3(x,y,z);
};
var geometry = new THREE.TubeGeometry(centralCurve, 200, 0.1, 20);*/

var material = new THREE.MeshPhongMaterial({color: 0x0000FF, side: THREE.DoubleSide});
var tube = new THREE.Mesh(new THREE.BufferGeometry, material);

var material2 = new THREE.MeshPhongMaterial({color: 0xFF0000, side: THREE.DoubleSide});
var tube2 = new THREE.Mesh(new THREE.BufferGeometry, material2);

var material3 = new THREE.MeshPhongMaterial({color: 0x00FF00, side: THREE.DoubleSide});
var tube3 = new THREE.Mesh(new THREE.BufferGeometry, material3);

scene.add(tube);
scene.add(tube2);
scene.add(tube3);

camera.position.z = 5;

function animate(time) {
  step = time/250
  var centralCurve = new THREE.Curve();
  centralCurve.getPoint = t => {
    theta = step + 4*Math.PI*t;
    const x = Math.cos(theta),
    y = theta/10,
    z = Math.sin(theta);
    return new THREE.Vector3(x,y,z);
  };

  var orbitCurve = new THREE.Curve();
  orbitCurve.getPoint = t => {
    theta = step + 4*Math.PI*t;
    phi = 10*theta;
    const x = Math.cos(theta) + .1*Math.cos(phi)*Math.cos(theta),
    y = theta/10 + .1*Math.sin(phi),
    z = Math.sin(theta) + .1*Math.cos(phi)*Math.sin(theta);
    return new THREE.Vector3(x,y,z);
  };

  var orbitCurve2 = new THREE.Curve();
  orbitCurve2.getPoint = t => {
    theta = step + 4*Math.PI*t;
    phi = 10*theta;
    const x = Math.cos(theta) + .1*Math.cos(phi)*Math.cos(theta),
    y = theta/10 - .1*Math.sin(phi),
    z = Math.sin(theta) + .1*Math.cos(phi)*Math.sin(theta);
    return new THREE.Vector3(x,y,z);
  };


  tube.geometry = new THREE.TubeGeometry(centralCurve, 50, 0.1, 20);
  tube2.geometry = new THREE.TubeGeometry(orbitCurve, 400, .01, 20);
  tube3.geometry = new THREE.TubeGeometry(orbitCurve2, 400, .01, 20);
  requestAnimationFrame(animate);
  renderer.render( scene, camera );
  camera.position.y += 1/15;
}
requestAnimationFrame(animate);
