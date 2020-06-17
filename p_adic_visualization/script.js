var rainbow = new Rainbow(); //use this to generate colors programatically

var canvas = document.getElementById('canvas');
canvas.setAttribute('width', window.innerWidth);
canvas.setAttribute('height', window.innerHeight);

var ctx = canvas.getContext('2d');
var params = { fullscreen: true };
//var two = new Two(params).appendTo(elem);

//Save the width and the height of the screen, compute the center
var screenWidth = screen.width;
var screenHeight = screen.height;
var origin = [screenWidth/2,2*screenHeight/5];


//Choose my prime and my resolution (i.e., n such that I'm drawing Z/p^n)
var p = 2;
var n = 12;
//Also the settings for the linear function I will apply: f(x) = mx+b
var m = 1;
var b = 0;
//And why not exponentiation
var A = 1;
var e = 0;
//Trace lines?
var traceLines = false;


//initialize the animation queue, pointslist and colors:
var animationQueue = [];
var points = [];
var colors = [];
initializePointsList();

//Initialize the settings GUI
var settings = QuickSettings.create(screenWidth/10,screenHeight/10,"Settings")
settings.addDropDown("Prime",[2,3,5,7,11],function setPrime(value){
  p=value.value;
  if(p==2){
    n=12;
  }
  if(p==3){
    n=8;
  }
  if(p==5){
    n=5;
  }
  if(p==7){
    n=4;
  }
  if(p==11){
    n=3;
  }
  initializePointsList();
  drawPoints();
});
settings.addBoolean("Trace Lines",false,function traceSwap(value){traceLines = value})
settings.addNumber("Multiply by m",-(p**n),p**n,1,1,function setMultiplyer(value){m=value});
settings.addNumber("Add b",-(p**n),p**n,0,1,function setAddition(value){b = value});
settings.addButton("Apply f(x) = mx+b",function applyLinearFunction(){applyFunction(function f(x){return m*x+b})});
settings.addNumber("Exponential coefficient A",-(p**n),p**n,1,1,function setExpMultiplyer(value){A = value});
settings.addNumber("Exponentiate by e",-(p*p),p*p,0,1,function setExponent(value){e = value});
settings.addButton("Apply f(x) = Ax^e",function applyExponentiation(){applyFunction(function f(x){return A*(x**e)})});
settings.addButton("Reset",function reset(){initializePointsList();drawPoints()});

//p-adic stuff
function initializePointsList(){
  points = [];

  //populate the list of points in their initial positions:
  points.push(origin);
  for(var i=1;i<p**n;i++){
    //first compute the p-adic valuation of i,
    var val=1;
    while((i)%(p**val)==0){
      val++;
    }
    //Higher powers of p should be closer to the origin
    radius = screenHeight/(3*val*val);
    //Figure out our rotation;
    var theta = 2*Math.PI*i/p**n
    var center = [origin[0] + radius*Math.cos(theta),origin[1] + radius*Math.sin(theta)];
    points.push(center);
  }
  //Also populate a list of colors:
  colors = [];
  for(var i=0;i<p**n;i++){
    var j = Math.floor(100*i/(p**n-1));
    colors.push('#'+rainbow.colourAt(j));
  }
}
//This draws the points to their current location (using the global array points).  It clears the screen first.  It also applies color.
function drawPoints(){
  ctx.clearRect(0,0,screenWidth,screenHeight);
  for(var i=0;i<p**n;i++){
    ctx.beginPath();
    ctx.moveTo(points[i][0],points[i][1]);
    ctx.arc(points[i][0],points[i][1],1,0,2*Math.PI);
    ctx.fillStyle = colors[i];
    ctx.fill();
  }
}
//computes the location of a p-adic number
function computeLocation(t){
  //We know where zero goes:
  if(t==0){
    return origin;
  }
  //Otherwise...
  //first compute the p-adic valuation of i,
  var val=1;
  while((t)%(p**val)==0){
    val++;
  }
  //Higher powers of p should be closer to the origin
  radius = screenHeight/(3*val*val);
  //Figure out our rotation;
  var theta = 2*Math.PI*t/p**n
  return [origin[0] + radius*Math.cos(theta),origin[1] + radius*Math.sin(theta)];

}
function applyFunction(f){
  //We begin by computing the start and end points of each points, and saving them in the following lists.
  var initial = [];
  var final = [];
  for(var i=0;i<p**n;i++){
    initial.push(points[i]);
    final.push(computeLocation(f(i)));
  }
  //Then push the movement to the animation queue:
  animationQueue.push({
    start: performance.now(),
    duration: 5000,
    initial: initial,
    final: final,
    callback: (t) => {
      for(var i=0;i<p**n;i++){
        var newX = (1-t)*initial[i][0] + t*final[i][0];
        var newY = (1-t)*initial[i][1] + t*final[i][1];
        points[i] = [newX,newY];
      }
      drawPoints();
      if(traceLines){
        trace(initial);
      }
    },
    finish: () => {
      points = final;
      drawPoints();
      if(traceLines){
        trace(initial);
      }
    }
  })
}
//trace lines:
function trace(from){
  for(var i=0;i<p**n;i++){
    ctx.beginPath();
    ctx.moveTo(from[i][0],from[i][1]);
    ctx.lineTo(points[i][0],points[i][1]);
    ctx.strokeStyle = colors[i];
    ctx.stroke();
  }
}

//Animation functions!
function animate(){
  time = performance.now();
  for(i=0;i<animationQueue.length;i++){
    //t is the percentage of the animation that is finished
    const t = (time-animationQueue[i].start)/animationQueue[i].duration;
    //console.log(t);
    if(t>1){
      var finisher = animationQueue[i];
      animationQueue.splice(i,1);
      i-=1;
      finisher.finish();
    }
    else if (t>=0){
      animationQueue[i].callback(t);
    }
  }
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
