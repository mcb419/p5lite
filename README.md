# p5lite
a stripped down version of [p5js](https://p5js.org) with some added functionality

## added functionality that won't work in stock p5js
* single event loop, multiple drawing canvases
* separates update() routine from draw() routine
```
function draw() {
    canvas('cnv1');
    background(240);
    fill('cyan');
    ellipse(100, 100, 50);

    canvas('cnv2'); 
    background(128);
    noStroke();
    fill('magenta')
    rect(100, 100, 150, 100);
}
```
* ability to specify the canvas id in createCanvas
```
createCanvas(400, 300, 'cnv1');
createCanvas(300, 300, 'cnv2');
```