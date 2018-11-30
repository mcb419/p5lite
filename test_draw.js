function setup() {
  /*
  canvas('cnv1');
  background('cyan');
  canvas('cnv2');
  */
  //canvas('p5', {width:400, height:400})
  createCanvas(400, 400);
  background(240);

  stroke(0);
  noFill();
  rect(50, 50, 150, 100);
 
  push();
  strokeWeight(5);
  stroke('black')
  fill('white')
  ellipse(125, 100, 150, 100);
  pop();

  fill('brown') 
  ellipse(125, 100, 90);

  fill('black')
  ellipse(125, 100, 20);

  noFill();
  fill(200, 100, 0, 75);
  ellipse(200, 150, 200);

  /*
  fill('red')
  noStroke();
  circle(150, 150, 50);
  */

}
