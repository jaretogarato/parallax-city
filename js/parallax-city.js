/*jslint browser: true*/
/*jslint white: true */
/*jslint plusplus: true */
/*global $, jQuery, TimelineLite, TimelineMax, TweenMax, TweenLite, Power2, console*/

// TODO: recalculate positions when window is resized

// global variables (grumble, grumble)
var
  mouseIsHovering = false, xMousePos, yMousePos,
  // windowWidth = $(window).width(),
  // windowHeight = $(window).height(),
  windowWidth,
  windowHeight,
  moveLeftIsOk = 1, moveRightIsOk = 1,
  moveUpIsOk = 1, moveDownIsOk = 1,
  // depth value is for parallax; higher values appear closer to viewer
  // arguments: layername, left, top, width ('0' to use css depth)
  l000 = new MovingLayer('#layer000', '-25%', '-25%', 0, 0.7),
  l010 = new MovingLayer('#layer010', '-80%', '-15%', 2068, 2.5),
  l020 = new MovingLayer('#layer020', '-10%', '-10%', 1789, 5),
  l050 = new MovingLayer('#layer050', '-400%', '-500%', 0, 6),
  l100 = new MovingLayer('#layer100', '-200%', '-20%', 410, 9);
  l200 = new MovingLayer('#layer200', '100%', '30%', 360, 9);
  l500 = new MovingLayer('#layer500', '280%', '-80%', 304, 9);


$(window).on('load', function () {
  windowWidth = $(window).width();
  windowHeight = $(window).height();
  // preload animation images
  TweenLite.delayedCall(0.1, function () { // start delay
    // activate animation on the animatedSun elements
    $('.animatedSun').animateimage(10, -1).parent();
	});
  $("#layer100").click(function () {
		$("#jellyfish").css({'visibility': 'visible'});
		$("#jellyfish").load("jellyfish.html");
	});
  $("#layer200").click(function () {
		$("#parahelion").css({'visibility': 'visible'});
		$("#parahelion").load("parahelion.html");
	});
	$("#layer500").click(function () {
		$("#contact").css({'visibility': 'visible'});
		$("#contact").load("contact.html");
	});
	// doLayout('ready');
	// fly();
});

// universal functions

$(document).ready(function() {
  $(window).resize(function() {
    windowWidth = $(window).width();
    windowHeight = $(window).height();
    // var bodyheight = $(this).height();
    $("#wrapper").width("100%");
    $("#wrapper").height("100%");
    $("#layer000").width("150%");
    $("#layer000").height("150%");
    $("#layer000").css({top: '-25%', left: '-25%'});
  }).resize();
});

$('#wrapper').mouseenter(function(){
  mouseIsHovering = true;
}).mouseleave(function(){
  mouseIsHovering = false;
});

$("#wrapper").mousemove(function(event) {
  xMousePos = event.pageX;
  yMousePos = event.pageY;
});

function updateBgImage() {
  $("#wrapper").each(function() {
    $div.css({"width": "100%", "height": "100%"});
  });
}


// constructor function: layers
function MovingLayer(layerId, left, top, width, depth) {
  var
    xtrans = 0, ytrans = 0;

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

  // find the edges of each layer and make sure they're not in the viewport
  this.isLayerEdgeHidden = function(edge) {
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

    if(edge == 'left') {
      if(layerLeft >= 0) {return false;} else {return true;}
    }
    if(edge == 'right') {
      if(layerRight <= windowWidth) {return false;} else {return true;}
    }
    if(edge == 'top') {
      if(layerTop >= -2) {return false;} else {return true;}
    }
    if(edge == 'bottom') {
      if(layerBottom <= windowHeight) {return false;} else {return true;}
    }
  }

  this.layerMove = function () {
    var
      xtransn, ytransn,
      steerXspeed, steerXdir, steerXpositive = 1,
      steerYspeed, steerYdir, steerYpositive = 1,
      targXspeed, targYspeed,
      viewCentX, viewCentY,
      layerTop, layerBottom, layerLeft, layerRight,
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

    if(layerId == '#layer000') {
      // vvv shorter than four else statements
      moveLeftIsOk = moveRightIsOk = moveUpIsOk = moveDownIsOk = 0;
      if(this.isLayerEdgeHidden('left')) { moveLeftIsOk = 1; }
      if(this.isLayerEdgeHidden('right')) { moveRightIsOk = 1; }
      if(this.isLayerEdgeHidden('top')) { moveUpIsOk = 1; }
      if(this.isLayerEdgeHidden('bottom')) { moveDownIsOk = 1; }

      // console.log('moveLeftIsOk:  ', moveLeftIsOk);
      // console.log('moveRightIsOk: ', moveRightIsOk);
      // console.log('moveUpIsOk:    ', moveUpIsOk);
      // console.log('moveDownIsOk:  ', moveDownIsOk);
    }

    if(mouseIsHovering){
      // set l/r, u/d direction
      steerXdir > 0 ? steerXpositive = 1 : steerXpositive = -1;
      steerYdir > 0 ? steerYpositive = 1 : steerYpositive = -1;

      // set speed based on mouse position
      // power of 2.7 builds speed quickly
      steerXspeed = Math.pow((Math.abs(steerXdir) / viewCentX) * 2, 2.5) * steerXpositive;
      steerYspeed = Math.pow((Math.abs(steerYdir) / viewCentY) * 2, 2.5) * steerYpositive;

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

    if(steerXdir < 0 && moveRightIsOk) {
      xtrans = xtrans + (steerXspeed * this.depth);
    }
    if(steerXdir > 0 && moveLeftIsOk) {
      xtrans = xtrans + (steerXspeed * this.depth);
    }
    if(steerYdir < 0 && moveDownIsOk) {
      ytrans = ytrans + (steerYspeed * this.depth);
    }
    if(steerYdir > 0 && moveUpIsOk) {
      ytrans = ytrans + (steerYspeed * this.depth);
    }
    // xtrans = xtrans + (steerXspeed * this.depth);
    // ytrans = ytrans + (steerYspeed * this.depth);
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
};


// instantiate layers
l000.layerSetup();
l010.layerSetup();
l020.layerSetup();
l050.layerSetup();
l100.layerSetup();
l200.layerSetup();
l500.layerSetup();


// main loop: move them
var t = 0;
setInterval(function () {
  l000.layerMove();
  l010.layerMove();
  l020.layerMove();
  l050.layerMove();
  l100.layerMove();
  l200.layerMove();
  l500.layerMove();
  ++t;
}, 1000 / 30);


// animated sun jellyfish
(function ($) {
  "use strict";
	$.fn.animateimage = function (framerate, repeats) {
    return this.each(function () {
      var
				$this = $(this), duration, spritesize, image, horizontal, spritecount,
				i, hidden, visible, lastimage;

      framerate = Math.abs(framerate || 10);
      if (typeof repeats === 'undefined' || repeats < -1) { repeats = -1; }
			duration = 1 / framerate;
			spritesize = $this.data('spritesize');
      image = $this.children(); // grab all children (images) of the target element

      if (spritesize) { // sprite sheet
        if (image.length === 1) { // image should be a single image containing the sprite sheet
          horizontal = ($this.data('spritedirection') !== 'vertical');
          spritecount = (horizontal ? image.width() : image.height()) / spritesize;
          TweenLite.set(image, { visibility: 'visible' });

          // attach a reference to the animation on the element, so it can be easily grabbed outside of the plugin and paused, reversed etc
          this.animation = new TimelineMax({ repeat: repeats });

          if (horizontal) {
            TweenLite.set(this, { width: spritesize });
            for (i = 0; i < spritecount; i++) {
              this.animation.set(image, { left: "-" + (i * spritesize) + "px" }, i * duration);
            }
          } else {
            TweenLite.set(this, { height: spritesize });
            for (i = 0; i < spritecount; i++) {
              this.animation.set(image, { top: "-" + (i * spritesize) + "px" }, i * duration);
            }
          }
          // add an 'empty' set after the last position change - this adds padding at the end of the timeline so the last frame is displayed for the correct duration before the repeat
          this.animation.set({}, {}, i * duration);
        }

      } else { // image sequence
        if (image.length > 1) { // image should only contain the images to be animated

          hidden = { position: 'absolute', visibility: 'hidden' }; // styles for image in the sequcnce
          visible = { position: 'static', visibility: 'visible' };

          // in case the poster is not the first child, make sure its pre-animated state is disabled
          TweenLite.set(image.filter('.poster'), hidden);

          lastimage = image.last();

          // attach a reference to the animation on the element, so it can be easily grabbed outside of the plugin and paused, reversed etc
          this.animation = new TimelineMax({ repeat: repeats })
              // this first set is not strictly needed as lastimage is underneath all of the other images, but it certainly doesn't hurt
              .set(lastimage, hidden)
              // toggle images one by one between visible and hidden - at any one time, only one image will be visible, and its static positioning will set the size for the container
              .staggerTo(image, 0, visible, duration, 0)
              // hide all the elements except lastimage - it will be hidden on repeat if needed at the same time as first is shown
              .staggerTo(image.not(lastimage), 0, $.extend(hidden, { immediateRender: false }), duration, duration)
              // add an 'empty' set after lastimage is made visible - this adds padding at the end of the timeline so lastimage is displayed for the correct duration before the repeat
              .set({}, {}, "+=" + duration);
        }
      }
    });
  };
}(jQuery));
