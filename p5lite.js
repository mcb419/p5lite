// p5lite
//
// differences relative to stock p5js:
// * supports single event loop, but multiple drawing canvases
// * includes call to update() in event loop
// *(createCanvas(w, h, 'cvn_id');
// * canvas('cnv_id'); // sets current canvas
// * circle(x, y, r)
// * csave() and crestore() instead of push() and pop() for context

// TODO: seedable random numbers

var height, width; //globals exposed

//============
// EVENT LOOP
//============

(function (e) {

  var FPS = 60; // frameRate (frames per second)
  var UPT = 1;  // updatesPerTick
  var paused;   // paused status

  e.p5setup = function () {
    paused = true;
    e.setup(); // user
    if (!e.gcnv()) e.createCanvas(300, 100); // default if user didn't create a canvas
    e.reset(); //user
    e.draw(); // user
  };

  e.p5pause = () => { paused = true; };
  e.p5reset = () => { paused = true; e.reset(); e.draw(); };
  e.p5run = () => { paused = false; e.p5tick(); };
  e.p5step = () => { paused = true; e.update(); e.draw(); };
  e.p5tick = function () {
    if (!paused) {
      setTimeout(e.p5tick, 1000 / FPS);
      for (let i = 0; i < UPT; i++) e.update();
    }
    e.draw();
  };

  e.frameRate = (rate) => rate ? FPS = rate : FPS;
  e.isPaused = () => paused;
  e.loop = e.p5run;
  e.noLoop = e.p5pause;
  e.redraw = () => { paused = true; e.draw(); };
  e.updatesPerTick = (num) => num ? UPT = num : UPT;

  // empty versions of user-defined functions
  e.draw = () => { };
  e.reset = () => { };
  e.setup = () => { };
  e.update = () => { };

  // call p5setup once DOM is loaded
  if (document.readyState === 'complete') {
    e.p5setup();
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      document.removeEventListener('DOMContentLoaded', arguments.callee, false);
      e.p5setup();
    }, false);
  }

})(window);

//===========
// GRAPHICS
//===========

(function (e) {

  var cnv; // current canvas
  var ctx; // current context

  e.gcnv = () => cnv;
  e.gctx = () => ctx;

  // canvas(id) sets the current canvas 
  e.canvas = function (cnv_id, opts) {

    opts = opts || {};

    // looks for the corresponding canvas id
    cnv = document.getElementById(cnv_id);

    // if canvas with this id is not found, create one
    if (!cnv) {
      cnv = document.createElement('canvas');
      cnv.id = cnv_id;
      cnv.width = opts.width || 400;
      cnv.height = opts.height || 300;
      document.body.appendChild(cnv);
    } else {
      // found existing canvas; requesting size change?
      if (opts.width && (opts.width !== cnv.width)) cnv.width = opts.width;
      if (opts.height && (opts.height !== cnv.height)) cnv.height = opts.height;
    }

    // see if the context has already been defined
    if (!cnv.ctx) {
      ctx = cnv.getContext('2d');
      cnv.ctx = ctx;
      ctx._doFill = true;
      ctx._doStroke = true;
      ctx.font = '12px sans-serif';
    } else {
      ctx = cnv.ctx;
    }

    // set globals
    height = cnv.height;
    width = cnv.width;
  };

  e.createCanvas = function (w, h, id = 'p5') {
    e.canvas(id, { width: w, height: h });
  };

  e.background = function (r, g, b, a = 1.0) {
    var colorSpec;
    if (typeof r === 'string') {
      colorSpec = arguments[0];
    } else if (arguments.length === 1) {
      colorSpec = `rgb(${r}, ${r}, ${r})`;
    } else {
      if (a > 1) a /= 255; // allows alpha 0-255 (p5 style)
      colorSpec = `rgba(${r}, ${g}, ${b}, ${a})`;
    }
    ctx.fillStyle = colorSpec;
    ctx.fillRect(0, 0, width, height);
  };

  e.circle = function (x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.closePath();
    if (ctx._doStroke) ctx.stroke();
    if (ctx._doFill) ctx.fill();
  };

  e.crestore = function () {
    ctx.restore();
  };

  e.csave = function () {
    ctx.save();
  };

  e.ellipse = function (x, y, w, h = w) {
    ctx.beginPath();
    ctx.ellipse(x, y, w / 2, h / 2, 0, 0, 2 * Math.PI);
    ctx.closePath();
    if (ctx._doFill) ctx.fill();
    if (ctx._doStroke) ctx.stroke();
  };

  e.fill = function (r, g, b, a = 1.0) {
    var colorSpec;
    if (typeof r === 'string') {
      colorSpec = arguments[0];
    } else if (arguments.length === 1) {
      colorSpec = `rgb(${r}, ${r}, ${r})`;
    } else {
      if (a > 1) a /= 255; // allows alpha 0-255 (p5 style)
      colorSpec = `rgba(${r}, ${g}, ${b}, ${a})`;
    }
    ctx._doFill = true;
    ctx.fillStyle = colorSpec;
  };

  e.line = function (x1, y1, x2, y2) {
    if (!ctx._doStroke) return;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
  };

  e.lineWidth = function (w) {
    if (typeof w === 'undefined' || w === 0) {
      // hack because lineWidth 0 doesn't work
      ctx.lineWidth = 0.0001;
    } else {
      ctx.lineWidth = w;
    }
  };


  e.noFill = function () {
    ctx._doFill = false;
  };

  e.noStroke = function () {
    ctx._doStroke = false;
  };

  e.rect = function (x, y, w, h) {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.closePath();
    if (ctx._doFill) ctx.fill();
    if (ctx._doStroke) ctx.stroke();
  };

  e.rotate = function (angle) {
    ctx.rotate(angle);
  };

  e.scale = function (sx, sy = sx) {
    ctx.scale(sx, sy);
  };

  e.stroke = function (r, g, b, a = 1.0) {
    var colorSpec;
    if (typeof r === 'string') {
      colorSpec = arguments[0];
    } else if (arguments.length === 1) {
      colorSpec = `rgb(${r}, ${r}, ${r})`;
    } else {
      if (a > 1) a /= 255; // allows alpha 0-255 (p5 style)
      colorSpec = `rgba(${r}, ${g}, ${b}, ${a})`;

    }
    ctx._doStroke = true;
    ctx.strokeStyle = colorSpec;
  };

  e.strokeWeight = function (w) {
    this.lineWidth(w);
  };

  e.text = function (str, x, y) {
    if (ctx._doFill) ctx.fillText(str, x, y);
  };

  e.textSize = function(fontSize) {
    ctx.font = fontSize + "px sans-serif";
  };

  e.translate = function (x, y) {
    ctx.translate(x, y);
  };

})(window);

//===========
// MATH
//===========
(function (e) {
  e.PI = Math.PI;
  e.TWO_PI = 2 * e.PI;
  e.HALF_PI = e.PI / 2;
  e.QUARTER_PI = e.PI / 4;
  e.DEG_TO_RAD = e.PI / 180;
  e.RAD_TO_DEG = 180 / e.PI;

  e.abs = x => Math.abs(x);
  e.acos = x => Math.acos(x);
  e.asin = x => Math.asin(x);
  e.atan = x => Math.atan(x);
  e.ceil = x => Math.ceil(x);
  e.constrain = (x, lo, hi) => Math.max(Math.min(x, hi), lo);
  e.cos = x => Math.cos(x);
  e.degrees = x => (e.RAD_TO_DEG * x);
  e.dist = (x1, y1, x2, y2) => e.sqrt(e.sq(x2 - x1) + e.sq(y2 - y1));
  e.exp = x => Math.exp(x);
  e.floor = x => Math.floor(x);
  e.log = x => Math.log(x);
  e.log10 = x => Math.log10(x);
  //map renamed to remap
  e.min = function () {
    if (arguments[0] instanceof Array) {
      return Math.min.apply(null, arguments[0]);
    } else {
      return Math.min.apply(null, arguments);
    }
  };
  e.max = function () {
    if (arguments[0] instanceof Array) {
      return Math.max.apply(null, arguments[0]);
    } else {
      return Math.max.apply(null, arguments);
    }
  };
  e.pop = e.crestore;
  e.push = e.csave;
  e.radians = x => (e.DEG_TO_RAD * x);
  e.random = function (a, b) {
    if (b) return a + (b - a) * Math.random();
    if (!a) return Math.random();
    if (Array.isArray(a)) { // pick one
      return a[Math.floor(a.length * Math.random())];
    }
    return a * Math.random();
  };
  e.remap = function (n, start1, stop1, start2, stop2, withinBounds = true) {
    let newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
    if (!withinBounds) {
      return newval;
    }
    if (start2 < stop2) {
      return e.constrain(newval, start2, stop2);
    } else {
      return e.constrain(newval, stop2, start2);
    }
  };
  e.round = x => Math.round(x);
  e.sin = x => Math.sin(x);
  e.sq = x => (x * x);
  e.sqrt = x => Math.sqrt(x);
  e.tan = x => Math.tan(x);
  e.atan2 = (y, x) => Math.atan2(y, x);
  e.pow = (x, y) => Math.pow(x, y);

})(window);
