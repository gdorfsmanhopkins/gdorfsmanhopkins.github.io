function makeBalls(){
  var balls = [];
  var groups = [];
  for (var i=0;i<14;i++){
    var nextColumn = [];
    for(var k=0;k<3;k++){
      newCircle = two.makeCircle(0,yList[k],0);
      newCircle.stroke = 'none';
      newCircle.fill = 'none';
      nextColumn.push(newCircle);
    }
    var ballGroup = two.makeGroup(nextColumn[0],nextColumn[1],nextColumn[2]);
    moveBalls(i,ballGroup);
    balls.push(nextColumn);
  }
  return balls;
}
function moveBalls(column,ballGroup){
  if((column%2)==0){
    steps = column/2;
    ballGroup.translation.set(75 + 200*steps,150);
  }
  else{
    steps = (column-1)/2
    ballGroup.translation.set(125 + 200*steps,150);
  }
}

function makeLines(){
  lines = []
  for(var i=0;i<7;i++){
    nextColumn = []
    for(var j=0;j<3;j++){
      newLine = two.makePath(-25,yList[j],25,yList[j],open=true);
      newLine.stroke = 'none';
      newLine.fill = 'none';
      newLine.linewidth = 5;
      newLine.dashes[0] = 50;
      newLine.dashes.offset = 50;
      nextColumn.push(newLine);
    }
    var lineGroup = two.makeGroup(nextColumn[0],nextColumn[1],nextColumn[2]);
    moveLines(i,lineGroup);
    lines.push(nextColumn);
  }
  return lines;
}
function moveLines(column,lineGroup){
  lineGroup.translation.set(100 + 200*column,150);
}

function cleanUpActive(i){
  activeSlots.splice(i,1);
  for(j = i;j<activeSlots.length;j++){
    for(k=0;k<3;k++){
      activeSlots[j].colorPaths[k].dashes.offset=300;
    }
    activeSlots[j].moveTo(activePositions[j]);
    activeSlots[j].onPosition = j;
    activeSlots[j].colorize();
  }
}
function checkWinCondition(){
  var n = activeSlots.length
  if(n>2){
    if(activeSlots[n-1].rightColors[0]==colors[0]){
      if(activeSlots[n-1].rightColors[1]==colors[1]){
        if(activeSlots[n-1].rightColors[2]==colors[2]){
          console.log("we win");
          animationQueue.push([setAnimation]);
          console.log(animationQueue);
          //the next one is not an animation, but we want it to happen after the win animation
          animationQueue.push([nextRound]);
        }
      }
    }
  }
}
function nextRound(){

  for(var i=0;i<activeSlots.length;i++){
    activeSlots[i].destroy();
  }
  activeSlots = [];
  deal();
  powerBalls = makeBalls();
  powerLines = makeLines();
  for (var i=0;i<3;i++){
    powerBalls[0][i].fill=colors[i];
    animationQueue.push([growBalls,0]);
  }
  animationQueue.shift();
}
