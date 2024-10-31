// #mathober2024

const bgCol = "#447abd";
const gCol = "#ffffff";
const nGrid = 20;
let w;
let gSpace;

function setup() {
  w = max(750, 500);
  gSpace = (w / nGrid) * 0.95;
  describe(
    "a point on a wavy curve riding the wave from left to right with its tangent line as the curve changes. On a blueprint design."
  );
  createCanvas(w+30, w);
  rectMode(CENTER);
  angleMode(DEGREES);
  textSize(12);
  textAlign(CENTER, CENTER);
}

function draw() {
  background(bgCol);
  translate(w / 2 + 30, w / 2);
  drawGrid();
  drawLabels();
  t = frameCount / 3;
  t1 = -w / 2 + gSpace + (t % (w - 2 * gSpace));
  
  // Graph parameters
  let a = 5 * gSpace;
  let b = 2 + 2 * sin(t);
  let c = 1 * gSpace;
  let d = 1 / 6;

  // Function definitions
  function f(x) {
    return a * cos(x * b) * sin(x) - c * tan(x * d);
  }

  noFill();
  stroke(gCol);
  beginShape();
  for (let i = -w / 2 + gSpace; i < w / 2 - gSpace; i++) {
    circle(i, f(i), 2);
    vertex(i, f(i));
  }
  endShape();
}

function drawGrid() {
  stroke('#a2c2e8');
  strokeWeight(0.3);
  for (let i = 1; i <= nGrid; i++) {
    for (let j = 1; j <= nGrid; j++) {
      line(
        -w / 2 + gSpace * i,
        -w / 2 + gSpace,
        -w / 2 + gSpace * i,
        w / 2 - gSpace
      );
      line(
        -w / 2 + gSpace,
        -w / 2 + gSpace * i,
        w / 2 - gSpace,
        -w / 2 + gSpace * i
      );
    }
  }
  noFill();
  strokeWeight(3);
  rect(0, 0, w - 2 * gSpace);
}

function drawLabels() {
  fill('#ffffff');
  noStroke();
  textSize(10);
  
  let countkwh = 19
  // Y-axis (kWh) labels
  for (let i = -nGrid / 2; i < nGrid / 2; i++) {

    if(countkwh == 19){
      text(`1000 kWh`, -w / 2 +4, i * gSpace+17);
    }

    if(countkwh == 15){
      text(`750 kWh`, -w / 2 +4, i * gSpace+17);
    }

    if(countkwh == 10){
      text(`500 kWh`, -w / 2 +4, i * gSpace+17);
    }

    if(countkwh == 5){
      text(`250 kWh`, -w / 2 +4, i * gSpace+17);
    }

    if(countkwh == 0){
      text(`0 kWh`, -w / 2 +4, i * gSpace+17);
    }

    countkwh--;
  }

  textSize(8);
  let countday = 1
  // X-axis (time) labels
  for (let i = -nGrid / 2 + 1; i < nGrid / 2; i++) {
    text(`Nov ${countday++}`, i * gSpace, w / 2 - 20);
  }
}

function mousePressed() {
  setup();
  draw();
}

function windowResized() {
  setup();
  draw();
}




