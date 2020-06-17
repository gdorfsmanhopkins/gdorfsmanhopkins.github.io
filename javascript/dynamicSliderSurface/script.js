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


var material = new THREE.MeshPhysicalMaterial({color: 0x0077be, side: THREE.DoubleSide});
var surface = new THREE.Mesh(new THREE.BufferGeometry, material);
scene.add(surface);

camera.position.z = 5;

var in1 = document.getElementById("xFreq");
var out1 = document.getElementById("demo1");
out1.innerHTML = in1.value; // Display the default slider value
in1.oninput = function() {
  out1.innerHTML = this.value;
}
var in2 = document.getElementById("yFreq");
var out2 = document.getElementById("demo2");
out2.innerHTML = in2.value; // Display the default slider value
in2.oninput = function() {
  out2.innerHTML = this.value;
}
// Update the current slider value (each time you drag the slider handle)

function animate(time) {
  p1 = time/in1.value;
  p2 = time/in2.value;
  surface.geometry = new THREE.ParametricGeometry((u, v, dest) => {
    const x = -10 + u * 20,
          y = -5 + v * 10,
          z = Math.sin(p1*x) * Math.cos(p2*y)/((x*x+y*y)+.5);
          dest.set(x, z, y);
  }, 100, 100);

  requestAnimationFrame(animate);
  renderer.render( scene, camera );
}
requestAnimationFrame(animate);
