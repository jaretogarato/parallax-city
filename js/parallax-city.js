/*jslint browser: true*/
/*jslint white: true */
/*jslint plusplus: true */
/*global $, jQuery, TimelineLite, TimelineMax, TweenMax, TweenLite, Power2, console*/

// get mouse position, send velocity
var mouseIsHovering = false, xMousePos, yMousePos;
var bgXisFullyVisible = false, bgYisFullyVisible = false;

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
function MovingLayer(layerId, left, top, width, depth) {
  this.layerId = layerId;
  this.top = top;
  this.left = left;
  if (width === '0'){
    this.width = $(this.layerId).css('width');
  } else {
    this.width = width;
  }
  this.height = $(this.layerId).css('height');
  this.depth = depth;

  // console.log('layerId: ', this.layerId);
  // console.log('layer width: ', this.width);
  // console.log('layer height: ', this.height);
  // ^^^ ok

  this.checkBgVisibility = function () {

  }

  this.layerMove = function () {
    var
      xtrans, ytrans, xtransn, ytransn,
      steerXspeed, steerXdir, steerYspeed, steerYdir,
      viewCentX, viewCentY,
      boundingRect, layerTop, layerBottom, layerLeft, layerRight,
      layerIdShort;
      windowWidth = $(window).width();
      windowHeight = $(window).height();

    xtrans = parseFloat($(this.layerId).css('transform').split(',')[4], 10);
    ytrans = parseFloat($(this.layerId).css('transform').split(',')[5], 10);
    viewCentX = windowWidth / 2;
    viewCentY = windowHeight / 2;
    steerXdir = viewCentX - xMousePos;
    steerYdir = viewCentY - yMousePos;

    // if (this.layerId == '#layer000'){
    layerIdShort = this.layerId;
    if(layerIdShort.charAt(0) === '#'){
     layerIdShort = layerIdShort.substr(1);
    }
    boundingRect = document.getElementById(layerIdShort).getBoundingClientRect();
    layerTop = boundingRect.top;
    layerBottom = layerTop + $(this.layerId).height();
    // layerBottom = layerTop + this.height;
    layerLeft = boundingRect.left;
    layerRight = layerLeft + $(this.layerId).width();
    // layerRight = layerLeft + this.width;
    // console.clear();
    // console.log('width: ', $(this.layerId).width());
    // console.log('height: ', $(this.layerId).height());

    // console.log('layer: ', this.layerId);
    // console.log('left: ', layerLeft);
    // console.log('right: ', layerRight);
    // console.log('top: ', layerTop);
    // console.log('bottom: ', layerBottom);
    // console.log('--------------');
    // }

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
  });
  // console.log("layerSetup ran");
};

// images
// layer000 | jgg-photo  | main bg        | 2879x2400
// layer001 | bldgs-03   | light blue     | 1789x1174
// layer010 | bldgs-bg   | dark gray      | 2068 × 1456
// layer050 | clouds-a   | main clouds    | 6437 × 3482
// layer100 | bldg01     | top and bottom | 410 x 1501
// layer200 | bldg-fg-05 | building fg    | 388 x 1501
// layer201 |   |   | 304 x 612

// instantiate layers (and set properties, like position)
//       layername, transX, transY, width ('0' to use css) depth(for parallax)
var
  l000 = new MovingLayer('#layer000', -50, -50, '0', 1),
  l001 = new MovingLayer('#layer001', 200, 200, '1789px', 2),
  l010 = new MovingLayer('#layer010', 300, 300, '2068px', 3),
  l050 = new MovingLayer('#layer050', -400, -400, '6437px', 4),
  l100 = new MovingLayer('#layer100', 400, 400, '410px', 10);

l000.layerSetup();
l001.layerSetup();
l010.layerSetup();
l050.layerSetup();
l100.layerSetup();


// main loop: move them
var t = 0;
setInterval(function () {
  "use strict";// l000.layerMove(100*Math.cos(t*Math.PI/180), 100*Math.sin(t*Math.PI/180));
  // l000.layerMove(m.get_x(), m.get_y());
  l000.layerMove();
  l001.layerMove();
  l010.layerMove();
  l050.layerMove();
  l100.layerMove();
  ++t;
}, 1000 / 30);
