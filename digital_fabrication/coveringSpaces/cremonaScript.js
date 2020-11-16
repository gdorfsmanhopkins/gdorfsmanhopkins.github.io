var c = document.getElementById('canvas');
c.setAttribute('width', window.innerWidth);
c.setAttribute('height', window.innerHeight);
var screenWidth = screen.width;
var screenHeight = screen.height;
var origin = [screenWidth/2,2*screenHeight/5];
boxWidth = screenWidth/numberOfNodes;
var rainbow = new Rainbow(); //use this to generate colors programatically

var ctx = c.getContext('2d');
ctx.fillStyle = "black";
ctx.fillRect(0, 0, screenWidth, screenHeight);

var numberOfNodes = 100;
var zoom = 4;
var radius = 350;
var tension = 1;
var gridLines = [];
var animationQueue = [];
var current = [];
var isLoop = false;
var currentPower = 1;
var pin = 0;
var deckCoefficient = 1


//set up our quick settings
var settings = QuickSettings.create(screenWidth/10,screenHeight/10,"Settings")
settings.addButton("conjugate",function complexConjugation(){animateFunction(conjugate)})
settings.addButton("z->z^2",function square(){animateFunction(z2);currentPower=2;if(isLoop){reloop()}});
settings.addButton("z->z^3",function cube(){animateFunction(z3);currentPower=3;if(isLoop){reloop()}});
settings.addButton("z->z^4",function fourth(){animateFunction(z4);currentPower=4;if(isLoop){reloop()}});
settings.addButton("z->z^5",function fifth(){animateFunction(z5);currentPower=5;if(isLoop){reloop()}});
settings.addButton("z->z^6",function sixth(){animateFunction(z6);currentPower=6;if(isLoop){reloop()}});
settings.addDropDown("Deck Transformation for z^:",[1,2,3,4,5,6],function setDeckCoefficient(value){deckCoefficient = value.value})
settings.addButton("Do a deck transformation",function deckTransformation(){animateFunction(rotate);if(isLoop){animateLoop(rotate)}})
settings.addButton("uncover",function slowReset(){
  deformCurves(current,gridLines)
  if(isLoop){
    deloop(currentPower);
  }
  currentPower=1;
});
settings.addButton("quick reset",function quickReset(){resetScreen();isLoop=false;currentPower=1});
settings.addButton("Add Loop",function addALoop(){drawLoopAnimate();isLoop=true})
settings.addDropDown("Select Preimage (zeta^)",[0,1,2,3,4,5],function setPreimage(value){pin = value.value})

xAxis = []
yAxis = []
for (var j=0;j<numberOfNodes+1;j++){
  yAxis.push(origin[0]);
  yAxis.push(origin[1] + screenHeight*(j-(numberOfNodes/2))/numberOfNodes);
  xAxis.push(origin[0] + screenWidth*(j-(numberOfNodes/2))/numberOfNodes);
  xAxis.push(origin[1]);
}

//first get the vertical gridlines
for(var i=-numberOfNodes/2;i<numberOfNodes/2+1;i++){
  xCoord = origin[0] + i*20;
  nextLine = [];
  for(var j=0;j<numberOfNodes+1;j++){
    var J = (j-(numberOfNodes/2));
    nextLine.push(xCoord);
    nextLine.push(origin[1] + J*screenHeight/numberOfNodes);
  }
  gridLines.push(nextLine);
};
//then horizontal ones
for(var i=-numberOfNodes/2;i<numberOfNodes/2+1;i++){
  yCoord = origin[1] + i*20;
  nextLine = [];
  for(var j=0;j<numberOfNodes+1;j++){
    var J = (j-(numberOfNodes/2))
    nextLine.push(origin[0] + J*screenWidth/numberOfNodes);
    nextLine.push(yCoord);
  }
  gridLines.push(nextLine);
};
//now remember that I'm currently at current
current = gridLines;

colors = [];
for(var i=0;i<gridLines.length;i++){
  var j = Math.floor(100*i/(gridLines.length));
  colors.push('#'+rainbow.colourAt(j));
}

//then draw the lines
for(var l=0; l<gridLines.length;l++){
  drawCurve(ctx,gridLines[l],tension,isClosed=false);
  ctx.strokeStyle = colors[l]
  //console.log(colors[l])
  ctx.stroke();
}

//We should also set up our loop
var loop = []
function setLoop(gamma){
  loop = []
  for(var i = 0;i<numberOfNodes;i++){
    theta = gamma*i/numberOfNodes;
    xCoord = origin[0] + radius*Math.cos(-theta);
    yCoord = origin[1] + radius*Math.sin(-theta);
    loop.push(xCoord);
    loop.push(yCoord);
  }
}
function drawLoop(){
  drawCurve(ctx,loop,tension,isClosed=false);
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 3;
  ctx.stroke();
}
function drawLoopAnimate(){
  animationQueue.push({
    start: performance.now(),
    duration: 500,
    callback: (t) => {
      newGamma = 2*Math.PI*t;
      setLoop(newGamma);
      drawLoop();
    },
    finish: () => {
      setLoop(6.4);
      drawLoop();
    },
  })
}
function deloop(scale){
  unloop = []
  gamma = 2*Math.PI/scale
  for(var i = 0;i<numberOfNodes;i++){
    theta = pin*gamma + gamma*i/numberOfNodes;
    xCoord = origin[0] + radius*Math.cos(-theta);
    yCoord = origin[1] + radius*Math.sin(-theta);
    unloop.push(xCoord);
    unloop.push(yCoord);
  }
  deformCurve(loop,unloop);
  loop = [];
}
function reloop(){
  newloop = []
  gamma = 6.4
  for(var i = 0;i<numberOfNodes;i++){
    theta = gamma*i/numberOfNodes;
    xCoord = origin[0] + radius*Math.cos(-theta);
    yCoord = origin[1] + radius*Math.sin(-theta);
    newloop.push(xCoord);
    newloop.push(yCoord);
  }
  deformCurve(loop,newloop);
  loop = [];
}
function animateLoop(f){
  newLoop = []
  for(var k=0; k<numberOfNodes + 2;k++){
    var oldX = loop[2*k];
    var oldY = loop[2*k + 1];
    newPoint = f(oldX,oldY);
    newLoop.push(newPoint[0]);
    newLoop.push(newPoint[1]);
  }
  deformCurve(loop,newLoop);
  loop = [];
}

function drawAxes(){
  drawCurve(ctx,xAxis,tension,isClosed=false);
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 3;
  ctx.stroke();
  drawCurve(ctx,yAxis,tension,isClose=false);
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 3;
  ctx.stroke();
}
function resetScreen(){
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, screenWidth, screenHeight);
  for(var l=0; l<gridLines.length;l++){
    drawCurve(ctx,gridLines[l],tension,isClosed=false);
    ctx.strokeStyle = colors[l];
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  drawAxes();
  loop = []
  current = gridLines;
}
function animateFunction(f){
  newCurves = []
  for(var l=0; l<current.length;l++){
    var newCurvePoints = [];
    for(var k=0; k<numberOfNodes + 2;k++){
      var oldX = current[l][2*k];
      var oldY = current[l][2*k + 1];
      newPoint = f(oldX,oldY);
      newCurvePoints.push(newPoint[0]);
      newCurvePoints.push(newPoint[1]);
    }
    newCurves.push(newCurvePoints);
  }
  deformCurves(current,newCurves);
}
function drawCurrent(){
  for(var l=0; l<current.length;l++){
    drawCurve(ctx,current[l],tension,isClosed=false);
    ctx.strokeStyle = colors[l];
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

function conjugate(x,y){
  x = zoom*(x-origin[0])/screenWidth;
  y = zoom*(y-origin[1])/screenHeight;
  newX = x
  newY = -y
  newX = screenWidth*newX/zoom + origin[0];
  newY = screenHeight*newY/zoom + origin[1];
  return [newX,newY];
}
function rotate(x,y){
  theta = 2*Math.PI/deckCoefficient;
  x = zoom*(x-origin[0])/screenWidth;
  y = zoom*(y-origin[1])/screenHeight;
  newX = x*Math.cos(theta) - y*Math.sin(theta)
  newY = x*Math.sin(theta) + y*Math.cos(theta)
  newX = screenWidth*newX/zoom + origin[0];
  newY = screenHeight*newY/zoom + origin[1];
  return [newX,newY];
}
function z2(x,y){
  x = zoom*(x-origin[0])/screenWidth;
  y = zoom*(y-origin[1])/screenHeight;
  newX = x*x - y*y
  newY = 2*x*y
  newX = screenWidth*newX/zoom + origin[0];
  newY = screenHeight*newY/zoom + origin[1];
  return [newX,newY];
}
function z3(x,y){
  x = zoom*(x-origin[0])/screenWidth;
  y = zoom*(y-origin[1])/screenHeight;
  newX = x*x*x - 3*x*y*y
  newY = 3*x*x*y - y*y*y
  newX = screenWidth*newX/zoom + origin[0];
  newY = screenHeight*newY/zoom + origin[1];
  return [newX,newY];
}
function z4(x,y){
  x = zoom*(x-origin[0])/screenWidth;
  y = zoom*(y-origin[1])/screenHeight;
  newX = x*x*x*x - 6*x*x*y*y + y*y*y*y
  newY = 4*x*x*x*y - 4*x*y*y*y
  newX = screenWidth*newX/zoom + origin[0];
  newY = screenHeight*newY/zoom + origin[1];
  return [newX,newY];
}
function z5(x,y){
  x = zoom*(x-origin[0])/screenWidth;
  y = zoom*(y-origin[1])/screenHeight;
  newX = x*x*x*x*x - 10*x*x*x*y*y + 5*x*y*y*y*y
  newY = 5*x*x*x*x*y - 10*x*x*y*y*y + y*y*y*y*y
  newX = screenWidth*newX/zoom + origin[0];
  newY = screenHeight*newY/zoom + origin[1];
  return [newX,newY];
}
function z6(x,y){
  x = zoom*(x-origin[0])/screenWidth;
  y = zoom*(y-origin[1])/screenHeight;
  newX = x*x*x*x*x*x - 15*x*x*x*x*y*y + 15*x*x*y*y*y*y - y*y*y*y*y*y
  newY = 6*x*x*x*x*x*y - 20*x*x*x*y*y*y + 7*x*y*y*y*y*y
  newX = screenWidth*newX/zoom + origin[0];
  newY = screenHeight*newY/zoom + origin[1];
  return [newX,newY];
}
function cremona(x,y){
  x = zoom*(x-origin[0])/screenWidth;
  y = zoom*(y-origin[1])/screenHeight;
  newX = 1/x
  newY = 1/y
  newX = screenWidth*newX/zoom + origin[0];
  newY = screenHeight*newY/zoom + origin[1];
  return [newX,newY];
}
function flip(x,y){
  x = zoom*(x-origin[0])/screenWidth;
  y = zoom*(y-origin[1])/screenHeight;
  newX = y
  newY = x
  newX = screenWidth*newX/zoom + origin[0];
  newY = screenHeight*newY/zoom + origin[1];
  return [newX,newY];
}
function func(x,y){
  x = zoom*(x-origin[0])/screenWidth;
  y = zoom*(y-origin[1])/screenHeight;
  newX = x*x*x + y*y*y - x*y*x - y*x*y
  newY = y
  newX = screenWidth*newX/zoom + origin[0];
  newY = screenHeight*newY/zoom + origin[1];
  return [newX,newY];
}
function test(x,y){
  x = zoom*(x-origin[0])/screenWidth;
  y = zoom*(y-origin[1])/screenHeight;
  newX = x + x*y
  newY = y + y*x
  newX = screenWidth*newX/zoom + origin[0];
  newY = screenHeight*newY/zoom + origin[1];
  return [newX,newY];
}

//This function should deform between 2 sets of curves.
function deformCurves(curves1,curves2){
  for(var m = 0;m<curves1.length;m++){
    drawCurve(ctx,curves1[m],tension,isClosed=false);
    ctx.strokeSyle = colors[m]
    ctx.stroke();
  }
  var initial=curves1;
  var final=curves2;
  listLength=curves1[0].length;
  var numberOfCurves=curves1.length
  animationQueue.push({
    start: performance.now(),
    duration: 10000,
    numberOfCurves: numberOfCurves,
    listLength: listLength,
    initial: initial,
    final: final,
    callback: (t) => {
      //Doing this sinusoidally looks better
      var lambda = .5 + .5*Math.sin((t-.5)*Math.PI);
      newCurves = []
      for(var i = 0;i<numberOfCurves;i++){
        newPoints = [];
        for(var j=0;j<listLength;j++){
          newPoints.push((1-lambda)*initial[i][j] + lambda*final[i][j]);
        }
        newCurves.push(newPoints)
        //drawCurve(ctx,newPoints,tension,isClosed=false);
        //ctx.strokeStyle = colors[i]
        //ctx.stroke();
      }
      current=newCurves;
    },
    finish: () => {
      //for(var i =0;i<numberOfCurves;i++){
      //  drawCurve(ctx,final[i],tension,isClosed=false);
      //  ctx.strokeStyle = colors[i]
      //  ctx.stroke();
      //}
      current=final;
    }
  })
}

//This function should deform between 2 curves.  For now the lengths need to match.
//right now best for loops
function deformCurve(points1,points2){
  drawCurve(ctx,points1,tension,isClosed=false);
  var initial = points1;
  var final = points2;
  var listLength = points1.length
  ctx.stroke();
  animationQueue.push({
    start: performance.now(),
    duration: 10000,
    listLength: listLength,
    initial: initial,
    final: final,
    callback: (t) => {
      //Doing this sinusoidally looks better
      var lambda = .5 + .5*Math.sin((t-.5)*Math.PI);
      newPoints = [];
      for(var i=0;i<listLength;i++){
        newPoints.push((1-lambda)*initial[i] + lambda*final[i]);
      }
      drawCurve(ctx,newPoints,tension,isClosed=false);
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 3;
      ctx.stroke();
    },
    finish: () => {
      drawCurve(ctx,final,tension,isClosed=false);
      ctx.stroke();
      ctx.strokeStyle = 'red'
      ctx.lineWidth = 3;
      loop = final
    }
  })
}
function animate(){
  time = performance.now();
  if(animationQueue.length!=0){
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, screenWidth, screenHeight);
    drawCurrent();
    drawAxes();
    drawLoop();
  }
  for(q=0;q<animationQueue.length;q++){
    //t is the percentage of the animation that is finished
    const t = (time-animationQueue[q].start)/animationQueue[q].duration;
    //console.log(t);
    if(t>1){
      var finisher = animationQueue[q];
      animationQueue.splice(q,1);
      q-=1;
      finisher.finish();
    }
    else if (t>=0){
      animationQueue[q].callback(t);
    }
  }
  requestAnimationFrame(animate);
}
drawAxes();
requestAnimationFrame(animate);
