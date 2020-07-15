var elem = document.getElementById('draw-shapes');
var params = { fullscreen: true };
var two = new Two(params).appendTo(elem);

var card = two.makeRoundedRectangle(400,250,150,250,15);
card.fill = 'lightgrey';
card.stroke = 'black';

var ytop = 155;
var middle = 235;
var bottom =  315;


var topPath = two.makePath(325,ytop,375,ytop,425,bottom,475,bottom,open = true);
topPath.stroke = 'black';
topPath.fill = 'none';
topPath.linewidth = 2;

var middlePath = two.makePath(325,middle,375,middle,425,middle,475,middle,open = true);
middlePath.stroke = 'black';
middlePath.fill = 'none';
middlePath.linewidth = 2;

var bottomPath = two.makePath(325,bottom,375,bottom,425,ytop,475,ytop,open = true);
bottomPath.stroke = 'black';
bottomPath.fill = 'none';
bottomPath.linewidth = 2;

var colorPath = two.makePath(325,ytop,375,ytop,425,bottom,475,bottom,open = true);
colorPath.stroke = 'blue';
colorPath.fill = 'none';
colorPath.linewidth = 3;
colorPath.dashes[0] = 300;
colorPath.dashes.offset = 300;

two.bind('update', function(frameCount) {
  colorPath.dashes.offset -= 4;
}).play();
