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

//build the coordinate axes
var origin = new THREE.Vector3(0,0,0);
var xDirection = new THREE.Vector3(3,0,0);
var yDirection = new THREE.Vector3(0,0,3);
var zDirection = new THREE.Vector3(0,3,0);

var xLine = new THREE.LineCurve3(origin,xDirection);
var xMaterial = new THREE.MeshPhongMaterial({color:0xFF0000, side:THREE.DoubleSide});
var xGeometry = new THREE.TubeGeometry(xLine,1,.01,20);
var xAxis = new THREE.Mesh(xGeometry,xMaterial);

var yLine = new THREE.LineCurve3(origin,yDirection);
var yMaterial = new THREE.MeshPhongMaterial({color:0x00FF00, side:THREE.DoubleSide});
var yGeometry = new THREE.TubeGeometry(yLine,1,.01,20);
var yAxis = new THREE.Mesh(yGeometry,yMaterial);

var zLine = new THREE.LineCurve3(origin,zDirection);
var zMaterial = new THREE.MeshPhongMaterial({color:0x0000FF, side:THREE.DoubleSide});
var zGeometry = new THREE.TubeGeometry(zLine,1,.01,20);
var zAxis = new THREE.Mesh(zGeometry,zMaterial);

scene.add(xAxis);
scene.add(yAxis);
scene.add(zAxis);

//define some geometry where the cubic surface will live
var material = new THREE.MeshPhysicalMaterial({color: 0x0077be, side: THREE.DoubleSide});
var surface = new THREE.Mesh(new THREE.BufferGeometry, material);
scene.add(surface);

camera.position.z = 5;

//Get inputs
var in1 = document.getElementById("a1");
var out1 = document.getElementById("demo1");
out1.innerHTML = in1.value; // Display the default slider value
in1.oninput = function() {
  out1.innerHTML = this.value;
}
var in2 = document.getElementById("a2");
var out2 = document.getElementById("demo2");
out2.innerHTML = in2.value; // Display the default slider value
in2.oninput = function() {
  out2.innerHTML = this.value;
}
var in3 = document.getElementById("a3");
var out3 = document.getElementById("demo3");
out3.innerHTML = in3.value; // Display the default slider value
in3.oninput = function() {
  out3.innerHTML = this.value;
}
var in4 = document.getElementById("a4");
var out4 = document.getElementById("demo4");
out4.innerHTML = in4.value; // Display the default slider value
in4.oninput = function() {
  out4.innerHTML = this.value;
}
var in5 = document.getElementById("a5");
var out5 = document.getElementById("demo5");
out5.innerHTML = in5.value; // Display the default slider value
in5.oninput = function() {
  out5.innerHTML = this.value;
}
var in6 = document.getElementById("a6");
var out6 = document.getElementById("demo6");
out6.innerHTML = in6.value; // Display the default slider value
in6.oninput = function() {
  out6.innerHTML = this.value;
}
var in7 = document.getElementById("a7");
var out7 = document.getElementById("demo7");
out7.innerHTML = in7.value; // Display the default slider value
in7.oninput = function() {
  out7.innerHTML = this.value;
}
var in8 = document.getElementById("a8");
var out8 = document.getElementById("demo8");
out8.innerHTML = in8.value; // Display the default slider value
in8.oninput = function() {
  out8.innerHTML = this.value;
}
var in9 = document.getElementById("a9");
var out9 = document.getElementById("demo9");
out9.innerHTML = in9.value; // Display the default slider value
in9.oninput = function() {
  out9.innerHTML = this.value;
}

function animate() {
  //Set coefficients
  v1 = in1.value;
  v2 = in2.value;
  v3 = in3.value;
  v4 = in4.value;
  v5 = in5.value;
  v6 = in6.value;
  v7 = in7.value;
  v8 = in8.value;
  v9 = in9.value;
  surface.geometry = new THREE.ParametricGeometry((u, v, dest) => {
    const x = -2.5 + u * 5,
          y = -2.5 + v * 5,
          z = (v1*x*x*x + v2*x*x*y + v3*x*y*y + v4*y*y*y + v5*x*x + v6*x*y + v7*y*y + v8*x + v9*y)/10;
          dest.set(x, z, y);
  }, 100, 100);

  requestAnimationFrame(animate);
  renderer.render( scene, camera );
}
animate();
