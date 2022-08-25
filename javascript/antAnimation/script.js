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
cx = screenWidth/2;
cy = 2*screenHeight/5;


//Set the length of the meter stick
var meter = screenWidth/2;
var step = meter/1500;
var numberOfAnts = 2;
var antsLeft = numberOfAnts;
var basic = true;
var colorful = true;

//initialize the animation queue, pointslist and colors:
var animationQueue = [];
var points = [];
var colors = [];
initializePointsList();
drawPoints();

//Initialize the settings GUI
var settings = QuickSettings.create(screenWidth/20,screenHeight/10,"Settings")
settings.addDropDown("Number of Ants",[2,3,5,10,100],function setAnts(value){
  basic = false;
  n = value.value;
  if(n==2){
    numberOfAnts=2;
  }
  if(n==3){
    numberOfAnts=3;
  }
  if(n==5){
    numberOfAnts=5;
  }
  if(n==10){
    numberOfAnts=10;
  }
  if(n==100){
    numberOfAnts=100;
  }
  var antsLeft = numberOfAnts;
  console.log(numberOfAnts);
  initializePointsList();
  drawPoints();
});
settings.addBoolean("Color ants?",true,function setColorful(value){colorful = value})
settings.addDropDown("Speed",["Slow","Medium","Fast"],function setSpeed(value){
  speed=value.value;
  if(speed=="Slow"){
    step = meter/1250;
  }
  if(speed=="Medium"){
    step=meter/750;
  }
  if(speed=="Fast"){
    step=meter/250;
  }
});
settings.addButton("Reset",function reset(){
  initializePointsList();
  drawPoints();
});


//make all the points
function initializePointsList(){
  if(basic){
    points = [[cx-meter/2,1],[cx+meter/2,-1]]
    colors = ['#ff0000','#0000ff'];
  } else {
    points = []
    for(var i=0;i<numberOfAnts;i++){
      const loc = cx - meter/2 + meter*Math.random();
      if(Math.random()<.5){direction=1}else{direction=-1};
      points.push([loc,direction]);
    }
  //Also populate a list of colors:
    colors = [];
    for(var i=0;i<numberOfAnts;i++){
      var j = 100*Math.random();
      console.log(j);
      colors.push('#'+rainbow.colourAt(j));
    }
  }
}
//This draws the points to their current location (using the global array points).  It clears the screen first.  It also applies color.
function drawPoints(){
  //clear the screen
  ctx.clearRect(0,0,screenWidth,screenHeight);

  //Redraw the table
  ctx.fillStyle = 'black';
  ctx.fillRect(cx-meter/2 + 5,cy+5,meter - 10,20);

  for(var i=0;i<numberOfAnts;i++){
    if(colorful){ctx.fillStyle=colors[i]} else {ctx.fillStyle='black'};
    if(points[i][1]==0){
      ctx.beginPath();
      ctx.moveTo(points[i][0],cy);
      ctx.arc(points[i][0],cy + 15,5,0,2*Math.PI);
      ctx.fill();

    } else {
      ctx.beginPath();
      ctx.moveTo(points[i][0],cy);
      ctx.arc(points[i][0],cy,5,0,2*Math.PI);
      ctx.fill();
    }
  }
}

function animate(){
  //First we move all the ants one step to the left or right.
  for(var i=0;i<numberOfAnts;i++){
    points[i][0] += step*points[i][1];
    //We keep track if it fell of the end.
    if(points[i][0]<cx - meter/2 || points[i][0]>cx + meter/2){
      points[i][1] = 0;
      antsLeft -= 1;
    }
  }
  drawPoints();
  //We then measure if ants are crashing into eachother.
  for(var i=0;i<numberOfAnts;i++){
    //Don't worry about ants that have fallen
    if(points[i][1]==0){continue;}
    for(var j=0;j<i;j++){
      //Don't worry about ants that have fallen
      if(points[j][1]==0){continue;}
      if (points[i][0]-points[j][0]<2*step && points[j][0] - points[i][0]<2*step){
        points[i][1] *= -1;
        points[j][1] *= -1;
      }
    }
  }
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
