var elem = document.getElementById('draw-shapes');
var params = { fullscreen: true };
var two = new Two(params).appendTo(elem);

var animationQueue = [];  //keeps animations in order
var cardList = []; //keeps track of cards on the table

//Positions of things relative to the origin
var yList = [-95,-15,65,100];
var xList = [-75,-25,25,75];

//Save the colors of each row as global variables. (top,middle,bottom)
var colors = ['purple', 'blue','red'];

//it might be useful to store the next open stop as a global variable
var activeSlots = [];
var inactiveSlots = [null,null,null,null,null,null];

//and maybe store the open and closed positions
var activeY = 150;
var inactiveY = 450
var activePositions = [
  [200,activeY],
  [400,activeY],
  [600,activeY],
  [800,activeY],
  [1000,activeY],
  [1200,activeY]
];
var inactivePositions = [
  [200,inactiveY],
  [400,inactiveY],
  [600,inactiveY],
  [800,inactiveY],
  [1000,inactiveY],
  [1200,inactiveY]
]


deal();
var powerBalls = makeBalls();
var powerLines = makeLines();
for (var i=0;i<3;i++){
  powerBalls[0][i].fill=colors[i];
  animationQueue.push([growBalls,0]);
}

function on_mouse_down(event){
    if(animationQueue.length==0){
    coords = click_to_plane_coords( event );
    x = coords[0];
    y = coords[1];

    //first we have to save all the centers before we move things around
    centerList = []
    for (i = 0;i<cardList.length;i++){
      centerList.push([cardList[i].center[0],cardList[i].center[1]]);
    }
    for (i=0;i<cardList.length;i++){
      if(-75<x-centerList[i][0] && x-centerList[i][0]<75&&-125<y-centerList[i][1] && y-centerList[i][1]<125){
        if(cardList[i].onClick()){
          cleanUpActive(cardList[i].onPosition);
        }
      }
    }
  }
  //adjustBalls();
  //adjustLines();
}
function click_to_plane_coords( event ) {
	let rect = event.target.getBoundingClientRect();
	let x = event.clientX;
	let y = event.clientY;


	return [ x, y ];
}
elem.addEventListener( "mousedown", on_mouse_down );

//Let's put the animation stuff in here
function animate(){
  if(animationQueue.length > 0){
    //console.log(animationQueue[0][0]);
    animationQueue[0][0]();
  }
  else{
    checkWinCondition();
  }
  two.update();
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);



/*TO DO:

*Integrate coloration.
*Make a Deck class.  Maybe with shuffle?
*Introduce an animation Queue:
    Maybe an array that I can add functions+parameters to.
    Run an animation loop that RAF's on the first item in line.
    When I finish pop off the front of the list.
    The animation loop runs RAF while the list is nonempty.
*/
