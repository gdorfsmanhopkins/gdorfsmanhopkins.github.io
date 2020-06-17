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
var curve = new THREE.Curve();
curve.getPoint = t => {
  const x = 5*Math.sin(20*t),
  y = Math.sin(100*Math.sin(0)*t),
  z = 5*Math.cos(20*t);
  return new THREE.Vector3(x,y,z);
};
var geometry = new THREE.TubeGeometry(curve, 200, 0.1, 20);
var material = new THREE.MeshPhongMaterial({color: 0x0000FF, side: THREE.DoubleSide});
var tube = new THREE.Mesh(geometry, material);
scene.add(tube);
camera.position.z = 10;

function animate(time) {
  var curve = new THREE.Curve();
  curve.getPoint = t => {
    const x = 5*Math.sin(20*t),
    y = Math.sin(50*Math.sin(time/10000)*t),
    z = 5*Math.cos(20*t);
    return new THREE.Vector3(x,y,z);
  };
  tube.geometry = new THREE.TubeGeometry(curve, 500, 0.1, 20);
  requestAnimationFrame(animate);
  renderer.render( scene, camera );
}
requestAnimationFrame(animate);
