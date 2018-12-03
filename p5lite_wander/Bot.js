/* exported Bot */
/* global wrap */

class Bot {

  constructor() {
    this.reset();
  }

  reset() {
    this.x = random(width);
    this.y = random(height);
    this.speed = 1.0;
    this.heading = random(TWO_PI);
    this.r = random(8.0, 24.0);
    this.cfill = color(random(140, 240), random(140, 240), random(140, 240), 200);
    this.wanderNoise = 0.3;
    this.filter = 0.0;  // for low-pass filter
  }

  update() {
    // change heading based on low-pass filtered noise
    this.filter += 0.05*(-this.filter + this.wanderNoise * random(-1, 1));
    this.heading += this.filter; 
    
    // update position
    this.x += this.speed * cos(this.heading);
    this.y += this.speed * sin(this.heading);

    // boundary conditions
    if (wrap) {
      this.x = (this.x + width) % width;
      this.y = (this.y + height) % height;
    } else {
      // solid walls
      this.x = constrain(this.x, this.r, width - this.r);
      this.y = constrain(this.y, this.r, height - this.r);
    }
  }

  display() {
    noStroke();
    fill(this.cfill);
    csave();
    translate(this.x, this.y);
    rotate(this.heading);
    ellipse(0, 0, 2 * this.r);
    stroke(0);
    line(0, 0, this.r, 0);
    crestore();
  }
}