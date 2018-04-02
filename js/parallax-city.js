/*jslint browser: true*/
/*jslint white: true */
/*jslint plusplus: true */
/*global $, jQuery, TimelineLite, TimelineMax, TweenMax, TweenLite, Power2, console*/

// TODO: recalculate positions when window is resized

// get mouse position, send velocity
var mouseIsHovering = false, xMousePos, yMousePos;
var bgXisFullyVisible = false, bgYisFullyVisible = false;

$('#wrapper').mouseenter(function(){
  mouseIsHovering = true;
}).mouseleave(function(){
  mouseIsHovering = false;
});

$("#wrapper").mousemove(function(event) {
  xMousePos = event.pageX;
  yMousePos = event.pageY;
});

// constructor function: layers
function MovingLayer(layerId, left, top, width, depth) {
  var xtrans, ytrans;

  this.layerId = layerId;
  this.top = top;
  this.left = left;
  if (width === 0){
    this.width = $(this.layerId).css('width');
  } else {
    this.width = width+"px";
  }
  this.height = $(this.layerId).css('height');
  this.depth = depth;

  // console.log('layerId: ', this.layerId);
  // console.log('this.top: ', this.top);
  // console.log('this.left: ', this.left);
  // console.log('layer width: ', this.width);
  // console.log('layer height: ', this.height);
  // ^^^ ok

  // find the edges of each layer
  this.checkBgVisibility = function () {
    // TODO: check edges of bg and clouds
    // find the edges of each layer
    var
      boundingRect, layerIdShort,
      isLayerXvisible = false, isLayerYvisible = false;

    layerIdShort = this.layerId;
    if(layerIdShort.charAt(0) === '#'){
      layerIdShort = layerIdShort.substr(1);
    }

    boundingRect = document.getElementById(layerIdShort).getBoundingClientRect();
    layerTop = boundingRect.top;
    layerBottom = layerTop + $(this.layerId).height();
    layerLeft = boundingRect.left;
    layerRight = layerLeft + $(this.layerId).width();

    console.log(">layerId: ", layerId);
    // console.log(">layerIdShort: ", layerIdShort);
    // console.log('left: ', layerLeft);
    // console.log('right: ', layerRight);
    // console.log('top: ', layerTop);
    // console.log('bottom: ', layerBottom);
    console.log('--------------');

    // console.log("steerXdir: " + steerXdir + " steerYdir: " + steerYdir);
    // console.log($(layer000).css(width));
  }

  this.layerMove = function () {
    var
      xtransn, ytransn,
      steerXspeed, steerXdir, steerXpositive = 1,
      steerYspeed, steerYdir, steerYpositive = 1,
      targXspeed, targYspeed,
      viewCentX, viewCentY,
      // boundingRect,
      layerTop, layerBottom, layerLeft, layerRight,
      windowWidth = $(window).width(),
      windowHeight = $(window).height(),
      layerIdShort;

    if(isNaN(xtrans)) {
      xtrans = 0;
    }
    if(isNaN(ytrans)) {
      ytrans = 0;
    }

    viewCentX = windowWidth / 2;
    viewCentY = windowHeight / 2;
    steerXdir = viewCentX - xMousePos;
    steerYdir = viewCentY - yMousePos;

    this.checkBgVisibility();

    if(mouseIsHovering){
      // set l/r, u/d direction
      steerXdir > 0 ? steerXpositive = 1 : steerXpositive = -1;
      steerYdir > 0 ? steerYpositive = 1 : steerYpositive = -1;

      // set speed based on mouse position
      // power of 2.7 builds speed quickly
      steerXspeed = Math.pow((Math.abs(steerXdir) / (viewCentX)) * 2, 2.5) * steerXpositive;
      steerYspeed = Math.pow((Math.abs(steerYdir) / (viewCentY)) * 2, 2.5) * steerYpositive;

      // stop movement when increment is small
      // choke top speed for mouse positions closer to viewport center
      if (Math.abs(steerXspeed) < 0.05) {
        steerXspeed = 0;
      } else if (Math.abs(steerXspeed) > 4) {
        steerXspeed = 4 * steerXpositive;
      }
      if (Math.abs(steerYspeed) < 0.05) {
        steerYspeed = 0;
      } else if (Math.abs(steerYspeed) > 4) {
        steerYspeed = 4 * steerYpositive;
      }
    } else {
      steerXdir = 0;
      steerYdir = 0;
    }
    xtrans = xtrans + (steerXspeed * this.depth);
    ytrans = ytrans + (steerYspeed * this.depth);
    xtransn = Math.round(xtrans);
    ytransn = Math.round(ytrans);

    // console.log('xtrans: ', xtrans);
    // console.log('ytrans: ', ytrans);
    // console.log('xtransn: ', xtransn);
    // console.log('ytrans: ', ytransn);
    // console.log('-----');
    // xtransn = Math.round(xtrans + (steerXspeed * this.depth));
    // ytransn = Math.round(ytrans + (steerYspeed * this.depth));
    // console.log(xtrans + " *** " + ytrans);

    // position the layers
    $(layerId).css({
      "-ms-transform": "translate(" + xtransn + "px, " + ytransn + "px)",
      "webkit-transform": "translate(" + xtransn + "px, " + ytransn + "px)",
      "transform": "translate(" + xtransn + "px, " + ytransn + "px)"
    });
    // console.log("xMousePos: " + xMousePos + " yMousePos: " + yMousePos);
  };
}

// prototypes: moving layers
// (use here to prevent function creation for each instantiation)
MovingLayer.prototype.layerSetup = function () {
  "use strict";
  $(this.layerId).css({
    "width": this.width,
    "height": this.height,
    "left": this.left,
    "top": this.top
  });
  // console.log('layerId: ', this.layerId);
  // console.log('this.top: ', this.top);
  // console.log('this.left: ', this.left);
  // console.log('layer width: ', this.width);
  // console.log('layer height: ', this.height);
  // console.log('-----');
  // console.log('read top: ', $(this.layerId).position().top);
  // console.log('read left: ', $(this.layerId).position().left);
  // console.log('read width: ', $(this.layerId).width());
  // console.log('read height: ', $(this.layerId).height());
  // console.log('-------------------');
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
// depth value is for parallax; higher values are closer to viewer
// arguments: layername, transX, transY, width ('0' to use css) depth

// TODO: instead of fix %s for top and left below, calculate % based on
//   size of viewport and size of image
var
  l000 = new MovingLayer('#layer000', '-25%', '-25%', 0, 0.25),
  l001 = new MovingLayer('#layer001', '-10%', '-10%', 1789, 2.5),
  l010 = new MovingLayer('#layer010', '-15%', '-15%', 2068, 7),
  l050 = new MovingLayer('#layer050', '-100%', '-150%', 6437, 5),
  l100 = new MovingLayer('#layer100', '-20%', '-20%', 410, 10);

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
}, 1000 / 60);
