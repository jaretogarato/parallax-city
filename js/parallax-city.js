/*jslint browser: true*/
/*jslint white: true */
/*jslint plusplus: true */
/*global $, jQuery, TimelineLite, TimelineMax, TweenMax, TweenLite, Power2, console*/

// images
// layer000 | jgg-photo | main bg     | 2879x2400
// layer001 | bldgs-03  | light blue  | 1789x1174
// layer010 | bldgs-bg  | dark gray   | 2068 × 1456
// layer050 | clouds-a  | main clouds | 6437 × 3482

// get mouse position, send velocity
var mouseIsHovering = false, xMousePos, yMousePos;

$('#wrapper').mouseenter(function(){
    console.log('mouse entered');
    mouseIsHovering = true;
}).mouseleave(function(){
    console.log('mouse left');
    mouseIsHovering = false;
});

$("#wrapper").mousemove(function (event) {
    xMousePos = event.pageX;
    yMousePos = event.pageY;
});


// constructor function: layers
function MovingLayer(layerId, left, top, depth) {
  this.layerId = layerId;
  this.top = top;
  this.left = left;
  this.width = $(this.layerId).css('width');
  this.height = $(this.layerId).css('height');
  this.depth = depth;

  // console.log('layerId: ', this.layerId);
  // console.log('layerId width: ', this.width);
  // console.log('layerId height: ', this.height);
  // ^^^ ok

  this.layerMove = function () {
    var xtrans, ytrans, xtransn, ytransn,
      steerXspeed, steerXdir, steerYspeed, steerYdir, viewCentX, viewCentY;
    // x.toPrecision

    xtrans = parseFloat($(this.layerId).css('transform').split(',')[4], 10);
    ytrans = parseFloat($(this.layerId).css('transform').split(',')[5], 10);
    viewCentX = $(window).width() / 2;
    viewCentY = $(window).height() / 2;
    steerXdir = viewCentX - xMousePos;
    steerYdir = viewCentY - yMousePos;

    // console.log("steerXdir: " + steerXdir + " steerYdir: " + steerYdir);
    // console.log($(layer000).css(width));

    if(mouseIsHovering){
      switch (true) {
        case (steerXdir < 100 && steerXdir > -100):
          steerXspeed = 0;
          break;
        case (steerXdir < 250 && steerXdir > 0):
          steerXspeed = 0.5;
          break;
        case (steerXdir > -250 && steerXdir < 0):
          steerXspeed = -.5;
          break;
        case (steerXdir >= 250):
          steerXspeed = 1;
          break;
        default:
          steerXspeed = -1;
          break;
      }

      switch (true) {
        case (steerYdir < 75 && steerYdir > -75):
          steerYspeed = 0;
          break;
        case (steerYdir < 200 && steerYdir > 0):
          steerYspeed = 0.5;
          break;
        case (steerYdir > -200 && steerYdir < 0):
          steerYspeed = -.5;
          break;
        case (steerYdir >= 200):
          steerYspeed = 1;
          break;
        default:
          steerYspeed = -1;
          break;
      }
    } else {
      steerXdir = 0;
      steerYdir = 0;
    }
    xtransn = xtrans + (steerXspeed * this.depth); // *** use smaller values
    ytransn = ytrans + (steerYspeed * this.depth);
    // console.log(xtrans + " *** " + ytrans);

    $(layerId).css({
      "-ms-transform": "translate(" + xtransn + "px, " + ytransn + "px)",
      "webkit-transform": "translate(" + xtransn + "px, " + ytransn + "px)",
      "transform": "translate(" + xtransn + "px, " + ytransn + "px)"
    });
    // console.log("xMousePos: " + xMousePos + " yMousePos: " + yMousePos);
    // console.log("layerMove ran");
  };
}

// prototypes: layers (use here to prevent function creation for each instantiation)
MovingLayer.prototype.layerSetup = function () {
  "use strict";
  $(this.layerId).css({
    "width": this.width,
    "height": this.height,
    "left": this.left + "px",
    "top": this.top + "px"
    // "background-color": this.color
  });
  // console.log("layerSetup ran");
};


// instantiate layers (and set properties, like position)
//           layername, transX, transY, depth(prlx)
var l000 = new MovingLayer('#layer000', 100, 100, 1);
var l001 = new MovingLayer('#layer001', 200, 200, 2);
var l010 = new MovingLayer('#layer010', 300, 300, 3);
var l050 = new MovingLayer('#layer050', 400, 400, 4);

l000.layerSetup();
l001.layerSetup();
l010.layerSetup();
l050.layerSetup();


// main loop: move them
var t = 0;
setInterval(function () {
  "use strict";// l000.layerMove(100*Math.cos(t*Math.PI/180), 100*Math.sin(t*Math.PI/180));
  // l000.layerMove(m.get_x(), m.get_y());
  l000.layerMove();
  l001.layerMove();
  l010.layerMove();
  l050.layerMove();
  ++t;
}, 1000 / 60);
