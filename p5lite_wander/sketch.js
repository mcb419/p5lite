/* exported setup, reset, draw, update, finish, isFinished, toggleWrap */
/* global Bot */

var itick;
var bots = [];
const NBOTS = 10;
var wrap = true;
var expt;

function setup() {
  createCanvas(400, 400);
  for (let i = 0; i < NBOTS; i++) bots.push(new Bot());
  
  // setup wanderNoise slider
  let slider = select('wanderNoise');
  slider.value = 0.3;
  slider.onmousemove = function() {
    select('wanderNoiseLabel').innerHTML = this.value;
    for (let b of bots) b.wanderNoise = this.value;
  };
  slider.onmousemove();

  expt = createExpt();
}

function reset() {
  itick = 0;
  for (let b of bots) b.reset();
  select('wanderNoise').onmousemove(); // use current slider val
}

function draw() {
  background('navy');
  for (let b of bots) b.display();

  // other info
  textSize(14);
  fill('white');
  text(itick, 10, 15); // tick count
  fill('orange');
  text(wrap ? 'wrap' : 'solid', 10, 30); // wrapped status 
}

function update() {
  itick++;
  for (let b of bots) b.update();
}

function finish() {
  if(expt)expt.finish();
}

function isFinished() {
  return (itick === 2000);
}

function toggleWrap() {
  wrap = !wrap;
}

function createExpt(){
  var itrial;
  var saved = {};
  var noiseVal = [0, 0.3, 1.5];
  var exptData;

  let setup = function() {
    p5pause(); 
    // save info to restore at finish
    saved.frameRate = frameRate();
    saved.updatesPerFrame = updatesPerFrame();
    saved.wanderNoise = select('wanderNoise').value;
    exptData = [];  // holds trial results 
    itrial = 0;
    frameRate(5);  // need fewer updates
    updatesPerFrame(100);
    console.log('expt - setup done');
  };

  let next = function() {
    console.log('expt - begin trial ' + itrial);
    p5reset();
    select('wanderNoise').value = noiseVal[itrial];
    select('wanderNoise').onmousemove();  // simulate mouse action
    p5run(); // run the trial
  };

  let finish = function() {
    console.log('expt - finish trial ' + itrial);
    exptData[itrial] = Math.random();
    itrial++;
    if(itrial < noiseVal.length){
      setTimeout(this.next, 1);
    } else {
      console.log('expt - all trials completed');
      console.log(exptData);
      // restore state
      frameRate(saved.frameRate);
      updatesPerFrame(saved.updatesPerFrame);
      select('wanderNoise').value = saved.wanderNoise;
      select('wanderNoise').onmousemove();
    }

  };

  let getData = () => exptData;

  return {setup, next, finish, getData};
}
