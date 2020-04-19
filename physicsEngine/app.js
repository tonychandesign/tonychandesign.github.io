"use strict";

/** Credits
 * MatterJS for the physics engine
 * Michael Hadley for his great medium articple on how to make a game with Phaser 3 / MatterJS
 * ** https://itnext.io/@michaelwesthadley
 * Landgreen for his well made 2D platformer/shooter, n-gon.  Learned a lot about canvas rendering for character models/physics
 * ** https://github.com/landgreen/n-gon
 */

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function setupCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight; // might need to increase, will have to readjust mech this.canvas
  ctx.font = "15px Arial";
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
}

setupCanvas();
window.onresize = function () {
  setupCanvas();
};

//mouse move input
window.onmousemove = function (e) {
  mech.getMousePos(e.clientX, e.clientY);
};
//mouse click input

//keyboard input
const keys = [];
document.body.addEventListener("keyup", function (e) {
  keys[e.keyCode] = false;
});
document.body.addEventListener("keydown", function (e) {
  // if (e.keyCode) {
  //   event.preventDefault();
  // }
  keys[e.keyCode] = true;
  if (keys[84]) {
    //t = testing mode
    if (game.testing) {
      game.testing = false;
    } else {
      game.testing = true;
    }
  }
});

// game Object Prototype *********************************************
//*********************************************************************
const gameSandbox = function () {
  this.testing = false; //testing mode: shows wireframe and some variables
  //time related vars and methods
  this.cycle = 0; //total cycles, 60 per second
  this.lastTimeStamp = 0; //tracks time stamps for measuing delta
  this.delta = 0; //measures how slow the engine is running compared to 60fps
  this.gravityDir = 0;
  this.timing = function () {
    this.cycle++; //tracks game cycles
    //delta is used to adjust forces on game slow down;
    this.delta =
      (engine.timing.timestamp - this.lastTimeStamp) / 16.666666666666;
    this.lastTimeStamp = engine.timing.timestamp; //track last engine timestamp
  };
  this.zoom = 0;
  this.scaleZoom = function () {
    if (this.zoom != 1) {
      ctx.translate(canvas.width / 3, canvas.height / 3);
      ctx.scale(this.zoom, this.zoom);
      ctx.translate(-canvas.width / 3, -canvas.height / 3);
    }
  };

  // this.keyZoom = function () {
  //   if (keys[187]) {
  //     //plus
  //     this.zoom *= 1.01;
  //   } else if (keys[189]) {
  //     //minus
  //     this.zoom *= 0.99;
  //   } else if (keys[48]) {
  //     this.zoom = 1;
  //   }
  // };
  this.wipe = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
};
const game = new gameSandbox();

//************************************************** player object ***********************************************************
const character = function () {
  this.width = 50;
  this.radius = 30;
  this.stroke = "#333";
  this.fill = "#4B4B4C";
  this.height = 42;
  this.yOffWhen = {
    crouch: 22,
    stand: 70,
    jump: 65,
  };
  this.yOff = 70;
  this.yOffGoal = 70;
  this.onGround = false; //checks if on ground or in air
  this.onBody = {};
  this.numTouching = 0;
  this.crouch = false;
  this.isHeadClear = true;
  this.spawnPos = {
    x: -1600,
    y: 0,
  };
  this.spawnVel = {
    x: 0,
    y: 0,
  };
  this.x = this.spawnPos.x;
  this.y = this.spawnPos.y;
  this.Sy = this.y; //adds a smoothing effect to vertical only
  this.Vx = 0;
  this.VxMax = 7;
  this.Vy = 0;
  this.mass = 10;
  this.Fx = 0.004 * this.mass; //run Force on ground
  this.FxAir = 0.0006 * this.mass; //run Force in Air
  // this.Fy = -0.05 * this.mass; //jump Force
  this.Fy = 0.48; //jump Force
  this.angle = 0;
  this.walk_cycle = 0;
  this.punch_cycle = 0;
  this.stepSize = 0;
  this.handMovement = 0;
  this.flipLegs = -1;
  this.hip = {
    x: 0,
    y: 24,
  };
  this.head = {
    x: 0,
    y: -44,
  };
  this.upperBody = {
    x: 10,
    y: -40,
  };
  this.knee = {
    x: 0,
    y: 0,
    x2: 0,
    y2: 0,
  };
  this.foot = {
    x: 0,
    y: 0,
  };
  this.elbow = {
    x: 0,
    y: 0,
    x2: 0,
    y2: 0,
  };
  this.hand = {
    x: 0,
    y: 0,
  };
  // smoothly transition punch to standstill
  this.punchXOff = 10;
  this.punchXOffGoal = 50;
  this.punchYOff = 0;
  this.punchYOffGoal = 20;
  this.legLength1 = 55;
  this.legLength2 = 45;
  this.canvasX = canvas.width / 2;
  this.canvasY = canvas.height;
  this.transX = this.canvasX - this.x;
  this.transY = this.canvasX - this.x;
  this.mouse = {
    x: canvas.width / 3,
    y: canvas.height,
  };
  // manually adjust values for eye tracking
  this.getMousePos = function (x, y) {
    this.mouse.x = x + 40;
    this.mouse.y = y - 155;
  };

  this.move = function () {
    this.x = player.position.x;
    //looking at player body, to ignore the other parts of the player composite
    this.y = playerBody.position.y - this.yOff;
    this.Vx = player.velocity.x;
    this.Vy = player.velocity.y;
  };
  this.look = function () {
    this.transX = this.canvasX - this.x;
    this.Sy = this.y + 200;
    this.transY = this.canvasY - this.Sy;
    //angle player head towards mouse
    this.angle = Math.atan2(
      this.mouse.y - this.canvasY / 2.1,
      this.mouse.x - this.canvasX
    );
  };
  this.doCrouch = function () {
    if (!this.crouch) {
      this.crouch = true;
      this.yOffGoal = this.yOffWhen.crouch;
      Matter.Body.translate(playerHead, {
        x: 0,
        y: 40,
      });
    }
  };
  this.undoCrouch = function () {
    this.crouch = false;
    this.yOffGoal = this.yOffWhen.stand;
    Matter.Body.translate(playerHead, {
      x: 0,
      y: -40,
    });
  };
  this.enterAir = function () {
    this.onGround = false;
    player.frictionAir = 0.001;
    if (this.isHeadClear) {
      if (this.crouch) {
        this.undoCrouch();
      }
      this.yOffGoal = this.yOffWhen.jump;
    }
    // legs spread so set body wider.... TODO, glitches out cause bottom points push character
    // Matter.Body.setVertices(playerBody,
    //   Vertices.fromPath("0 0  90 0 70 -82 20 -82")
    // );
  };
  this.enterLand = function () {
    this.onGround = true;
    if (this.crouch) {
      if (this.isHeadClear) {
        this.undoCrouch();
        player.frictionAir = 0.12;
      } else {
        this.yOffGoal = this.yOffWhen.crouch;
        player.frictionAir = 0.5;
      }
    } else {
      this.yOffGoal = this.yOffWhen.stand;
      player.frictionAir = 0.12;
    }
    // legs close so set body thinner.. TODO, glitches out
    // Matter.Body.setVertices(playerBody,
    //   Vertices.fromPath("0 20  50 20 50 -82 0 -82")
    // );
  };
  this.buttonCD_jump = 0; //cooldown for player buttons
  this.buttonCD_dash = 0; //cooldown for player dash
  this.keyMove = function () {
    if (this.onGround) {
      //on ground **********************
      if (this.crouch) {
        //crouch
        if (!keys[83] && this.isHeadClear) {
          //not pressing crouch anymore
          this.undoCrouch();
          player.frictionAir = 0.12;
        }
      } else if (keys[83]) {
        //on ground && not crouched and pressing s or down
        this.doCrouch();
        player.frictionAir = 0.5;
      } else if (keys[87] && this.buttonCD_jump + 50 < game.cycle) {
        //jump
        this.buttonCD_jump = game.cycle; //can't jump until 50 cycles pass
        Matter.Body.setVelocity(player, {
          //zero player velocity for consistant jumps
          x: player.velocity.x,
          y: 0,
        });
        // player.force.y = this.Fy / game.delta; //jump force / delta so that force is the same on game slowdowns
        player.force.y = -mech.Fy;
      }
      //horizontal move on ground
      if (keys[65]) {
        //left or a
        if (player.velocity.x > -this.VxMax) {
          //dash
          let speed;
          if (keys[79] && this.buttonCD_dash + 80 < game.cycle) {
            this.buttonCD_dash = game.cycle;
            speed = -0.15 * this.mass;
          } else {
            speed = -1 * this.Fx;
          }
          player.force.x = speed / game.delta;
          this.flipLegs = 1;
        }
      } else if (keys[68]) {
        //right or d
        if (player.velocity.x < this.VxMax) {
          // dash
          let speed;
          if (keys[79] && this.buttonCD_dash + 80 < game.cycle) {
            this.buttonCD_dash = game.cycle;
            speed = 0.15 * this.mass;
          } else {
            speed = this.Fx;
          }
          player.force.x = speed / game.delta;
          this.flipLegs = -1;
        }
      }
      if (keys[80] && this.onGround) {
        // punch
        this.punchXOffGoal = 11;
        this.punchYOffGoal = -11;
        // quicker punch animation
        this.punchXOff = this.punchXOff * 0.85 + this.punchXOffGoal * 0.9;
        this.punchYOff = this.punchYOff * 0.85 + this.punchYOffGoal * 0.9;
        game.mouseDown = true;
      } else {
        this.punchXOffGoal = 0;
        this.punchYOffGoal = 0; //reset punch to standing goal
        // slower punch animation
        this.punchXOff = this.punchXOff * 0.85 + this.punchXOffGoal * 0.15;
        this.punchYOff = this.punchYOff * 0.85 + this.punchYOffGoal * 0.15;
        game.mouseDown = false;
      }
    } else {
      // in air **********************************
      //check for short jumps
      if (
        this.buttonCD_jump + 60 > game.cycle && //just pressed jump
        !keys[87] && //but not pressing jump key
        this.Vy < 0
      ) {
        // and velocity is up
        Matter.Body.setVelocity(player, {
          //reduce player velocity every cycle until not true
          x: player.velocity.x,
          y: player.velocity.y * 0.94,
        });
      }
      if (keys[65]) {
        // move left a
        if (player.velocity.x > -this.VxMax + 2) {
          let speed;
          speed = -1 * this.FxAir;
          player.force.x = speed / game.delta;
          //resume reg air friction
          player.frictionAir = 0.001;
        } else if (keys[79] && this.buttonCD_dash + 80 < game.cycle) {
          let speed;
          this.buttonCD_dash = game.cycle;
          speed = -0.3 * this.mass;
          player.force.x = speed / game.delta;
          // ground friction to simulate dash
          player.frictionAir = 0.2;
        }
      } else if (keys[68]) {
        //move right d
        if (player.velocity.x < this.VxMax - 2) {
          let speed;
          speed = 1 * this.FxAir;
          player.force.x = speed / game.delta;
          //resume reg air friction
          player.frictionAir = 0.001;
        } else if (keys[79] && this.buttonCD_dash + 80 < game.cycle) {
          let speed;
          this.buttonCD_dash = game.cycle;
          speed = 0.3 * this.mass;
          player.force.x = speed / game.delta;
          // ground friction to simulate dash
          player.frictionAir = 0.2;
        }

        // console.log("max" + this.VxMax + " cur velocity" + player.velocity.x)
        // console.log(player.force.x)
      }
    }
    //smoothly move height towards height goal ************
    this.yOff = this.yOff * 0.85 + this.yOffGoal * 0.15;
    // console.log(player.velocity.x)
    // dash edge case to stop player from very slowly falling after dash if not moving
    if (
      !this.onGround &&
      player.velocity.y < 1.5 &&
      Math.abs(player.velocity.x) < 1.5
    ) {
      player.frictionAir = 0.01;
    }
  };
  this.deathCheck = function () {
    if (this.y > 4000) {
      // if player is 4000px deep reset to spawn Position and Velocity
      Matter.Body.setPosition(player, this.spawnPos);
      Matter.Body.setVelocity(player, this.spawnVel);
      // this.Sy = mech.y  //moves camera to new position quickly
    }
  };
  this.drawUpperBody = function (stroke) {
    ctx.save();
    if (this.flipLegs == 1) {
      this.upperBody.x = -10;
      this.hip.x = -2;
    } else {
      this.upperBody.x = 10;
      this.hip.x = +2;
    }
    ctx.strokeStyle = stroke;
    ctx.fillStyle = stroke;
    ctx.lineWidth = 17;
    ctx.beginPath();
    ctx.moveTo(this.hip.x, this.hip.y);
    ctx.lineTo(this.upperBody.x, this.upperBody.y);
    ctx.stroke();
    ctx.restore();
  };
  this.drawArm = function (stroke) {
    ctx.save();
    ctx.scale(this.flipLegs == 1 ? -1 : 1, 1); //copy leg motion
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 15;
    ctx.beginPath();
    ctx.moveTo(this.head.x, this.head.y);
    ctx.lineTo(this.elbow.x, this.elbow.y);
    ctx.lineTo(this.hand.x, this.hand.y);
    ctx.stroke();
    ctx.restore();
  };
  this.calcArm = function (cycle_offset, offset) {
    !this.onGround ? (this.handMovement = 20) : 0;
    this.head.x = 0 + offset;
    this.head.y = -44 + offset;
    //changes to stepsize are smoothed by adding only a percent of the new value each cycle
    let temp = 8 * Math.sqrt(Math.abs(this.Vx));
    // add extra offset when in character is standstill
    if (Math.abs(this.Vx) < 1) {
      temp += 7;
    }
    let punchSpeed = 1;
    if (game.mouseDown) {
      temp += 5;
      this.punch_cycle = this.punch_cycle + offset;
    } else {
      this.punch_cycle = this.walk_cycle + offset;
    }
    this.handMovement = 0.9 * this.handMovement + 0.1 * (temp * this.onGround);
    let stepAngle = 0;
    stepAngle = 0.02 * this.punch_cycle * punchSpeed + cycle_offset;
    this.hand.x =
      this.handMovement * Math.cos(stepAngle) * punchSpeed +
      offset +
      this.punchXOff;
    this.hand.y =
      offset +
      this.handMovement * Math.sin(stepAngle) +
      this.yOff +
      this.punchYOff +
      -30;
    const Ymax = this.yOff + -30;
    if (this.hand.y > Ymax) this.hand.y = Ymax;

    //calculate elbow position as intersection of circle from head and hand
    const d = Math.sqrt(
      (this.head.x - this.hand.x) * (this.head.x - this.hand.x) +
        (this.head.y - this.hand.y) * (this.head.y - this.hand.y)
    );
    const l =
      (this.legLength1 * this.legLength1 -
        this.legLength2 * this.legLength2 +
        d * d) /
      (2 * d);
    const h = Math.sqrt(this.legLength1 * this.legLength1 - l * l);
    this.elbow.x =
      (l / d) * (this.hand.x - this.head.x) -
      (h / d) * (this.hand.y - this.head.y) +
      this.head.x +
      offset +
      15 -
      this.punchXOff / 2;
    this.elbow.y =
      (l / d) * (this.hand.y - this.head.y) +
      (h / d) * (this.hand.x - this.head.x) +
      this.head.y +
      this.punchYOff / 3;
    // }

    // console.log("calcArm" + this.hand.x)
  };

  this.drawLeg = function (stroke) {
    ctx.save();
    ctx.scale(this.flipLegs, 1); //leg lines
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 15;
    ctx.beginPath();
    ctx.moveTo(this.hip.x, this.hip.y);
    ctx.lineTo(this.knee.x, this.knee.y);
    ctx.lineTo(this.foot.x, this.foot.y);
    ctx.stroke();
    ctx.restore();
  };
  this.calcLeg = function (cycle_offset, offset) {
    !this.onGround ? (this.stepSize = 25) : 0;
    this.hip.x = 0 + offset;
    this.hip.y = 24 + offset;
    //changes to stepsize are smoothed by adding only a percent of the new value each cycle
    let temp = 8 * Math.sqrt(Math.abs(this.Vx));
    // add extra offset when in character is standstill
    if (Math.abs(this.Vx) < 1) {
      temp += 5;
    }
    this.stepSize = 0.9 * this.stepSize + 0.1 * (temp * this.onGround);
    let stepAngle = 0;
    stepAngle = 0.02 * this.walk_cycle + cycle_offset;
    this.foot.x = 2 * this.stepSize * Math.cos(stepAngle) + offset;
    this.foot.y =
      offset + this.stepSize * Math.sin(stepAngle) + this.yOff + this.height;
    const Ymax = this.yOff + this.height;
    if (this.foot.y > Ymax) this.foot.y = Ymax;

    //calculate knee position as intersection of circle from hip and foot
    const d = Math.sqrt(
      (this.hip.x - this.foot.x) * (this.hip.x - this.foot.x) +
        (this.hip.y - this.foot.y) * (this.hip.y - this.foot.y)
    );
    const l =
      (this.legLength1 * this.legLength1 -
        this.legLength2 * this.legLength2 +
        d * d) /
      (2 * d);
    const h = Math.sqrt(this.legLength1 * this.legLength1 - l * l);
    this.knee.x =
      (l / d) * (this.foot.x - this.hip.x) -
      (h / d) * (this.foot.y - this.hip.y) +
      this.hip.x +
      offset;
    this.knee.y =
      (l / d) * (this.foot.y - this.hip.y) +
      (h / d) * (this.foot.x - this.hip.x) +
      this.hip.y;
  };
  this.walkCycle_CD = 0;
  this.draw = function () {
    ctx.fillStyle = this.fill;

    //draw body
    ctx.save();
    ctx.translate(this.x, this.y);
    this.calcLeg(Math.PI, -3);
    this.drawLeg("#444");
    // remember offset is hard coded in calcArm
    this.calcArm(Math.PI, 8);
    this.drawArm("#444");
    this.drawUpperBody("#333");
    this.calcLeg(0, 0);
    this.drawLeg("#333");
    this.calcArm(0, 10);
    this.drawArm("#333");

    // DRAW HEAD
    // calc x head postion depending if facing left or right
    let headXpos = this.flipLegs == 1 ? -10 : 10;
    ctx.translate(headXpos, -50);
    ctx.rotate(this.angle);
    ctx.strokeStyle = this.stroke;
    ctx.lineWidth = 2;
    // ctx.fillStyle = this.fill;
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(10, 0, 3, 0, 2 * Math.PI);
    ctx.fillStyle = "#333";
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // go 3x slow when in the air
    if (!this.onGround) {
      this.walk_cycle += (this.flipLegs * this.Vx) / 3;
    } else {
      this.walk_cycle += this.flipLegs * this.Vx;
    }

    //draw holding graphics
    if (this.isHolding) {
      if (this.holdKeyDown > 20) {
        if (this.holdKeyDown > this.throwMax) {
          ctx.strokeStyle = "rgba(255, 0, 255, 0.8)";
        } else {
          ctx.strokeStyle =
            "rgba(255, 0, 255, " +
            (0.2 + (0.4 * this.holdKeyDown) / this.throwMax) +
            ")";
        }
      } else {
        ctx.strokeStyle = "rgba(0, 255, 255, 0.2)";
      }
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(
        holdConstraint.bodyB.position.x + Math.random() * 2,
        holdConstraint.bodyB.position.y + Math.random() * 2
      );
      ctx.lineTo(
        this.x + 15 * Math.cos(this.angle),
        this.y + 15 * Math.sin(this.angle)
      );
      //ctx.lineTo(holdConstraint.pointA.x,holdConstraint.pointA.y);
      ctx.stroke();
    }
  };
  this.info = function () {
    let line = 80;
    ctx.fillStyle = "#fff";
    ctx.fillText("Press T to exit testing mode", 5, line);
    line += 30;
    ctx.fillText("cycle: " + game.cycle, 5, line);
    line += 20;
    ctx.fillText("delta: " + game.delta.toFixed(6), 5, line);
    line += 20;
    ctx.fillText("mX: " + (this.mouse.x - this.transX).toFixed(2), 5, line);
    line += 20;
    ctx.fillText("mY: " + (this.mouse.y - this.transY).toFixed(2), 5, line);
    line += 20;
    ctx.fillText("x: " + this.x.toFixed(0), 5, line);
    line += 20;
    ctx.fillText("y: " + this.y.toFixed(0), 5, line);
    line += 20;
    ctx.fillText("Vx: " + this.Vx.toFixed(2), 5, line);
    line += 20;
    ctx.fillText("Vy: " + this.Vy.toFixed(2), 5, line);
    line += 20;
    ctx.fillText("Fx: " + player.force.x.toFixed(3), 5, line);
    line += 20;
    ctx.fillText("Fy: " + player.force.y.toFixed(3), 5, line);
    line += 20;
    ctx.fillText("yOff: " + this.yOff.toFixed(1), 5, line);
    line += 20;
    ctx.fillText("mass: " + player.mass.toFixed(1), 5, line);
    line += 20;
    ctx.fillText("onGround: " + this.onGround, 5, line);
    line += 20;
    ctx.fillText("crouch: " + this.crouch, 5, line);
    line += 20;
    ctx.fillText("isHeadClear: " + this.isHeadClear, 5, line);
    line += 20;
    ctx.fillText("HeadIsSensor: " + headSensor.isSensor, 5, line);
    line += 20;
    ctx.fillText("frictionAir: " + player.frictionAir.toFixed(3), 5, line);
    line += 20;
    ctx.fillText("stepSize: " + this.stepSize.toFixed(2), 5, line);
    line += 20;
    ctx.fillText("zoom: " + game.zoom.toFixed(4), 5, line);
    line += 20;
    ctx.fillText("on body id: " + this.onBody, 5, line);
    // transY = this.canvasY - this.Sy
    line += 20;
    ctx.fillText("transY: " + this.transY, 5, line);
    line += 20;
    ctx.fillText("canvasY: " + this.canvasY, 5, line);
    line += 20;
    ctx.fillText("Sy: " + this.Sy, 5, line);
  };
};
const mech = new character();

//************************************************** Punch ***********************************************************
const punch = [];
function firePunch(type) {
  const len = punch.length;
  let dist; //radial distance mech head
  let dir;
  if (mech.flipLegs == -1) {
    dist = -50;
    dir = 0;
  } else {
    dist = 50;
    dir = 185.3;
  }
  punch[len] = Bodies.rectangle(mech.x + dist, mech.y - 20, 150, 50, {
    angle: dir,
    frictionAir: 0,
    restitution: 0.25,
    collisionFilter: {
      group: -2, //can't collide with player (at first)
    },
  });
  punch[len].birthCycle = game.cycle;
  Matter.Body.setVelocity(punch[len], {
    x: mech.Vx,
    y: mech.Vy,
  });
  //add force to fire punchs
  const vel = 0.005;
  const f = {
    x: ((vel * Math.cos(dir)) / game.delta) * 200,
    y: ((vel * Math.sin(dir)) / game.delta) * 200,
  };
  punch[len].force = f;

  World.add(engine.world, punch[len]); //add punch to world
}

let firePunchCD = 0;
function punchLoop() {
  //fire check
  if (game.mouseDown && firePunchCD < game.cycle) {
    firePunchCD = game.cycle + 10;
    firePunch();
  }
  //all punch loop
  let i = punch.length;
  while (i--) {
    // despawn after 1 frames
    if (punch[i].birthCycle + 1 < game.cycle) {
      Matter.World.remove(engine.world, punch[i]);
      punch.splice(i, 1);
    }
  }
}

//************************************************** matter.js ***********************************************************

// init
const Engine = Matter.Engine,
  World = Matter.World,
  Events = Matter.Events,
  Composites = Matter.Composites,
  Composite = Matter.Composite,
  Constraint = Matter.Constraint,
  Vertices = Matter.Vertices,
  Query = Matter.Query,
  Body = Matter.Body,
  Vector = Matter.Vector,
  Bodies = Matter.Bodies;

// create an engine
const engine = Engine.create();
//engine.enableSleeping = true;

// set player
let vector = Vertices.fromPath("0 40  -15 85  20 130  30 130  65 85  50 40");
const playerBody = Matter.Bodies.fromVertices(0, 0, vector);
// checks if the player is on the ground to enable jumping
var jumpSensor = Bodies.rectangle(0, 50, 40, 20, {
  sleepThreshold: 99999999999,
  isSensor: true,
});
// for crouching
vector = Vertices.fromPath("0 -66 8 -92  0 -37 50 -37 50 -66 42 -92");
const playerHead = Matter.Bodies.fromVertices(0, -115, vector);
// crouching check
const headSensor = Bodies.rectangle(0, -57, 48, 45, {
  sleepThreshold: 99999999999,
  isSensor: true,
});

const playerFist = Matter.Bodies.rectangle(0, -65, 50, 60);

const player = Body.create({
  //combine jumpSensor and playerBody
  parts: [playerBody, playerHead, playerFist, jumpSensor, headSensor],
  inertia: Infinity, //prevents player rotation
  friction: 0.002,
  //frictionStatic: 0.5,
  restitution: 0.3,
  sleepThreshold: Infinity,
  collisionFilter: {
    group: -2,
  },
});
Matter.Body.setPosition(player, mech.spawnPos);

Matter.Body.setVelocity(player, mech.spawnVel);
Matter.Body.setMass(player, mech.mass);
World.add(engine.world, [player]);
//holding body constraint
const holdConstraint = Constraint.create({
  pointA: {
    x: 0,
    y: 0,
  },
  //setting constaint to jump sensor because it has to be on something until the player picks up things
  bodyB: jumpSensor,
  stiffness: 0.4,
});

World.add(engine.world, holdConstraint);

//spawn bodies  *************************************************************
//***************************************************************************
//arrays that hold all the elements that are drawn by the renderer
const body = []; //non static bodies
const map = []; //all static bodies
const cons = []; //all constaints between a point and a body
const consBB = []; //all constaints between two bodies
const movingBodies = []; // all moving bodies
const compBodies = []; // compound bodies
const moveCombined = []; // compound bodies
let bridge;
let cata = [];
let pyramid;
let expBodies = []; // expanding bodies
const modalPlatforms = []; // triggers modal when stepped on
let composites = [];

spawn();

function spawn() {
  //spawns bodies and map elements
  function BodyRect(x, y, width, height, properties) {
    //speeds up adding reactangles to map array
    body[body.length] = Bodies.rectangle(
      x + width / 2,
      y + height / 2,
      width,
      height,
      properties
    );
  }
  //premade property options
  //Object.assign({}, propsHeavy, propsBouncy, propsNoRotation)      //will combine properties into a new object
  const propsBouncy = {
    friction: 0,
    frictionAir: 0,
    frictionStatic: 0,
    restitution: 1,
  };
  const propsOverBouncy = {
    friction: 0,
    frictionAir: 0,
    frictionStatic: 0,
    restitution: 1.05,
  };
  const propsHeavy = {
    density: 0.01, //default density 0.001
  };
  const propsNoRotation = {
    inertia: Infinity, //prevents player rotation
  };

  function constraintPB(x, y, bodyIndex, stiffness) {
    cons[cons.length] = Constraint.create({
      pointA: {
        x: x,
        y: y,
      },
      bodyB: body[bodyIndex],
      stiffness: stiffness,
    });
  }

  function constraintBB(bodyIndexA, bodyIndexB, stiffness) {
    consBB[consBB.length] = Constraint.create({
      bodyA: body[bodyIndexA],
      bodyB: body[bodyIndexB],
      stiffness: stiffness,
    });
  }

  // compound bodies
  let startX = 1220;
  let startY = 390; // +100 for first loop offset
  for (let k = 0; k < 6; k++) {
    for (let j = 0; j < 1; j++) {
      let numCol = compBodies.length;
      for (let i = 0; i + 1 < 2; i++) {
        // x decreases- looping fro left to right position wise
        // the U
        if (k % 2 == 0) {
          compBodies[i + numCol] = Body.create({
            parts: [
              Bodies.rectangle(startX, startY + 15, 40, 50 / 5, {
                friction: 1,
                velocity: 0,
              }), // middle
              Bodies.rectangle(startX - 15, startY, 50 / 5, 40, {
                friction: 1,
                velocity: 0,
              }), // left
              Bodies.rectangle(startX + 15, startY, 50 / 5, 40, {
                friction: 1,
                velocity: 0,
              }),
            ], // right
          });
          startY = startY - 60;
        } else {
          // the X
          compBodies[i + numCol] = Body.create({
            parts: [
              Bodies.rectangle(startX, startY, 50, 50 / 5, {
                friction: 1,
                velocity: 0,
              }),
              Bodies.rectangle(startX, startY, 50 / 5, 50, {
                friction: 1,
                velocity: 0,
              }),
            ],
          });
          Body.rotate(compBodies[i + numCol], Math.PI / 3.7);
          startY = startY - 40;
        }
      }
    }

    //260 and 275
    startY = 390;
    if (k % 2 == 0) {
      startX = startX + 40;
    } else {
      startX = startX + 65;
    }
  }

  for (let i = 0; i < compBodies.length; i++) {
    compBodies[i].collisionFilter.group = 1;
    World.add(engine.world, compBodies[i]);
  }

  for (let i = 0; i < 4; i++) {
    //stack of hexagons
    body[body.length] = Bodies.polygon(-815, -1700 - i * 27, 6, 27, {
      angle: Math.PI / 2,
      density: 0.035,
    });
  }

  for (let i = 0; i < 5; i++) {
    //stairs on birch cave
    for (let j = 0; j < 5 - i; j++) {
      const r = 40;
      map[map.length] = Bodies.rectangle(
        280 + r + i * r,
        350 - r - j * r,
        r,
        r
      );
    }
  }
  // stack of boxes at end of birch cave
  composites[composites.length] = Composites.stack(
    790,
    780,
    1,
    8,
    0,
    0,
    function (x, y) {
      return Bodies.rectangle(x, y, 28, 28);
    }
  );
  (function newtonsCradle() {
    //build a newton's cradle
    const x = -600;
    const r = 20;
    for (let i = 0; i < 5; i++) {
      body[body.length] = Bodies.circle(
        x + i * r * 2,
        720,
        r,
        Object.assign({}, propsHeavy, propsOverBouncy, propsNoRotation)
      );
      constraintPB(x + i * r * 2, 550, body.length - 1, 0.9);
    }
    body[body.length - 1].force.x = 0.02 * body[body.length - 1].mass; //give the last one a kick
  })();

  // CATAPULT
  // objects
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      body[body.length] = Bodies.rectangle(
        -340 + j * 20,
        -2260 - i * 50,
        20,
        20,
        { density: 0.000000001, restitution: 0 }
      );
    }
  }
  // actual catapult
  cata[cata.length] = Bodies.rectangle(-200, -2250, 320, 20, {
    collisionFilter: { group: 5 },
    chamfer: { radius: 4 },
  });
  // left hold
  cata[cata.length] = Bodies.rectangle(-350, -2145, 20, 190, {
    isStatic: true,
    chamfer: { radius: 4 },
    restitution: 0,
  });
  // center pivoter
  cata[cata.length] = Bodies.rectangle(-200, -2165, 20, 230, {
    isStatic: true,
    collisionFilter: false,
    chamfer: { radius: 4 },
  });

  for (let i = 0; i < cata.length; i++) {
    World.add(engine.world, cata[i]);
  }
  for (let i = 0; i < composites.length; i++) {
    World.add(engine.world, composites[i]);
  }
  World.add(engine.world, [
    Constraint.create({
      bodyA: cata[0],
      pointB: Vector.clone(cata[0].position),
      stiffness: 1,
      length: 0,
    }),
  ]);

  //map objects
  function mapRect(x, y, width, height, properties) {
    //addes reactangles to map array
    map[map.length] = Bodies.rectangle(
      x + width / 2,
      y + height / 2,
      width,
      height,
      { chamfer: { radius: 4 }, properties }
    );
  }

  function mapVertex(x, y, vector, properties) {
    map[map.length] = Matter.Bodies.fromVertices(
      x,
      y,
      Vertices.fromPath(vector),
      properties
    );
  }

  map[map.length] = Bodies.rectangle(0, 1000, 4200, 200); //ground
  map[map.length] = Bodies.rectangle(-2000, -1600, 200, 5400); //left limit wall
  map[map.length] = Bodies.rectangle(2000, -1600, 200, 5400); //right limit wall
  map[map.length] = Bodies.rectangle(0, -4200, 4200, 200); //ceiling
  mapRect(-2100, 400, 1000, 700); // starting block
  mapRect(-2100, -420, 600, 50); // starting top platform for UCSD
  mapVertex(100, 234, "600 0 600 200 0 200"); // ramp
  mapRect(-300, 300, 50, 250); // cave left wall under first ramp
  mapRect(250, 300, 50, 600); // cave right wall
  mapRect(-700, 525, 450, 25); // newtons cradle ledge
  mapRect(-2100, 650, 1100, 25); // platform left of newtons cradle ledge
  mapRect(-300, 330, 1100, 30); //ceiling for Birch cave
  mapVertex(1010, 520, "60 0 20 0 -400 320 -360 320"); // angled right wall Birch cave
  mapRect(625, 650, 200, 30); //platform in  Birch cave
  mapVertex(1661, 972, "0 280 1100 280 1100 0 500 0"); // ramp to tunnel
  mapVertex(1367, 412, "0 100 529 100 529 0 130 0"); // ceiling of tunnel
  mapRect(1500, -540, 100, 1000); //left wall of tunnel

  // intuit tunnel
  mapRect(-2100, -1000, 1670, 150); // platform floor bottom
  mapRect(-2100, -1600, 1060, 150); // platform floor middle
  mapVertex(-820, -1440, "0 0 100 20 100 0 0 20"); // smaller platform floor middle on right - block hanging platform, no chamfer for hex to stay still
  mapRect(-1400, -2200, 1700, 150); // platform ceiling
  mapVertex(-165, -1250, "0 0 -800 0 -800 600"); //angled ceiling
  mapRect(-580, -2200, 150, 1350); // right wall of cave

  mapRect(1280, -2310, 200, 50); //right platform of bridge
  mapRect(1230, -3000, 870, 50); //top part of hanging right most platform
  mapVertex(1900, -3500, "600 0 600 -200 0 -200"); // ramp ceiling for eqr

  mapRect(-2100, -3580, 700, 50); //platform for d4sd

  // case study ground bumps
  //ucsd
  modalPlatforms[modalPlatforms.length] = Bodies.rectangle(
    -1700,
    -420,
    300,
    20,
    {
      chamfer: { radius: 4 },
    }
  );
  //intuit
  modalPlatforms[modalPlatforms.length] = Bodies.rectangle(
    -1600,
    -1000,
    400,
    20,
    {
      chamfer: { radius: 4 },
    }
  );
  //d4sd
  modalPlatforms[modalPlatforms.length] = Bodies.rectangle(
    -1650,
    -3580,
    400,
    20,
    {
      chamfer: { radius: 4 },
    }
  );
  //eqr
  modalPlatforms[modalPlatforms.length] = Bodies.rectangle(
    1602,
    -3000,
    400,
    20,
    {
      chamfer: { radius: 4 },
    }
  );
  //asgs
  modalPlatforms[modalPlatforms.length] = Bodies.rectangle(
    -150,
    -1448,
    400,
    20,
    {
      chamfer: { radius: 4 },
    }
  );
  //birch
  modalPlatforms[modalPlatforms.length] = Bodies.rectangle(550, 900, 400, 20, {
    chamfer: { radius: 4 },
  });
  //workday (moves left right)
  modalPlatforms[modalPlatforms.length] = Bodies.rectangle(5, 700, 400, 20, {
    chamfer: { radius: 4 },
    ogX: 5,
    ogY: 700,
    movement: "leftRight",
  });

  // moves diagnally up to the right
  movingBodies[movingBodies.length] = Bodies.rectangle(-750, 100, 400, 60, {
    isStatic: true,
    chamfer: { radius: 4 },
    ogX: -750,
    ogY: 100,
    movement: "diagUpRight",
  });
  // moves diagnally up to the left
  movingBodies[movingBodies.length] = Bodies.rectangle(-1100, -300, 250, 60, {
    isStatic: true,
    chamfer: { radius: 4 },
    ogX: -1100,
    ogY: -300,
    movement: "diagUpLeft",
  });

  // moves up down in tunnel, first
  movingBodies[movingBodies.length] = Bodies.rectangle(1930, 705, 340, 30, {
    isStatic: true,
    chamfer: { radius: 4 },
    ogX: 1840,
    ogY: 705,
    movement: "downUp",
  });
  // moves up down in tunnel, 2nd
  movingBodies[movingBodies.length] = Bodies.rectangle(1600, 345, 200, 30, {
    isStatic: true,
    chamfer: { radius: 4 },
    ogX: 1650,
    ogY: 345,
    movement: "upDown",
  });
  // moves up down in tunnel, 3rd
  movingBodies[movingBodies.length] = Bodies.rectangle(1930, -45, 340, 30, {
    isStatic: true,
    chamfer: { radius: 4 },
    ogX: 1840,
    ogY: -45,
    movement: "downUp",
  });
  // moves up down in tunnel, 4th
  movingBodies[movingBodies.length] = Bodies.rectangle(1600, -425, 200, 30, {
    isStatic: true,
    chamfer: { radius: 4 },
    ogX: 1650,
    ogY: -425,
    movement: "upDown",
  });
  // moves up down in intuit tunnel
  movingBodies[movingBodies.length] = Bodies.rectangle(-1900, -1900, 400, 30, {
    isStatic: true,
    chamfer: { radius: 4 },
    ogX: -1900,
    ogY: -1900,
    movement: "upDown",
    yeet: "quick",
  });
  // moves up down on top intuit tunnel
  movingBodies[movingBodies.length] = Bodies.rectangle(
    -1560,
    -2750,
    1078,
    100,
    {
      isStatic: true,
      chamfer: { radius: 4 },
      ogX: -1560,
      ogY: -2750,
      movement: "downUp",
      yeet: "quick",
    }
  );

  // orbit bodies
  for (let i = 0; i < 10; i++) {
    movingBodies[movingBodies.length] = Bodies.circle(0, -450, 15, {
      isStatic: true,
      ogX: 0,
      ogY: -450,
      movement: "downUp",
      yeet: "quick",
      type: "orbit",
    });
  }
  var moveCycle = -1;
  Events.on(engine, "beforeUpdate", function (event) {
    moveCycle += 0.025;
    // console.log(this.moveCycle)
    if (moveCycle < 0) {
      return;
    }
    // var px = -900 - 100 * Math.sin(moveCycle);
    // var py = 100 + 100 * Math.sin(moveCycle);
    // moving boddies are added at the end
    for (let i = 0; i < movingBodies.length; i++) {
      if (movingBodies[i].type == "orbit") {
        var px = movingBodies[i].ogX - 30 * i * Math.sin(moveCycle + i);
        var py = movingBodies[i].ogY + 7 * i * Math.cos(moveCycle + i / 5);
        Body.setVelocity(movingBodies[i], {
          x: px - movingBodies[i].position.x,
          y: py - movingBodies[i].position.y,
        });
        Body.setPosition(movingBodies[i], { x: px, y: py });
      } else {
        if (movingBodies[i].movement == "diagUpRight") {
          var px = movingBodies[i].ogX - 100 * Math.sin(moveCycle);
          var py = movingBodies[i].ogY + 100 * Math.sin(moveCycle);
          Body.setVelocity(movingBodies[i], {
            x: px - movingBodies[i].position.x,
            y: py - movingBodies[i].position.y,
          });
          Body.setPosition(movingBodies[i], { x: px, y: py });
        } else if (movingBodies[i].movement == "diagUpLeft") {
          var px = movingBodies[i].ogX - 150 * Math.sin(moveCycle);
          var py = movingBodies[i].ogY - 100 * Math.sin(moveCycle);
          Body.setVelocity(movingBodies[i], {
            x: px - movingBodies[i].position.x,
            y: py - movingBodies[i].position.y,
          });
          Body.setPosition(movingBodies[i], { x: px, y: py });
        } else if (movingBodies[i].movement == "upDown") {
          var py = movingBodies[i].ogY - 100 * Math.sin(moveCycle);
          Body.setVelocity(movingBodies[i], {
            x: 0,
            y: py - movingBodies[i].position.y,
          });
          Body.setPosition(movingBodies[i], {
            x: movingBodies[i].position.x,
            y: py,
          });
        } else if (movingBodies[i].movement == "downUp") {
          let py = movingBodies[i].ogY + 100 * Math.sin(moveCycle);
          let foo = py - movingBodies[i].position.y;
          if (movingBodies[i].yeet == "quick") {
            py = movingBodies[i].ogY + 500 * Math.sin(moveCycle / 5);
            foo = py - movingBodies[i].position.y;
          }

          Body.setVelocity(movingBodies[i], {
            x: 0,
            y: foo,
          });
          Body.setPosition(movingBodies[i], {
            x: movingBodies[i].position.x,
            y: py,
          });
        }
      }
    }

    var px =
      modalPlatforms[modalPlatforms.length - 1].ogX +
      45 * Math.sin(moveCycle / 2);
    Body.setVelocity(modalPlatforms[modalPlatforms.length - 1], {
      x: px - modalPlatforms[modalPlatforms.length - 1].position.x,
      y: 0,
    });
    Body.setPosition(modalPlatforms[modalPlatforms.length - 1], {
      x: px,
      y: modalPlatforms[modalPlatforms.length - 1].position.y,
    });
  });

  let varriedHeight = 0;
  let expStartX = -1200;
  for (let i = 0; i < 13; i++) {
    let width = 270;
    if (i === 0 || i === 12) {
      width = 180;
    }
    expBodies[expBodies.length] = Composites.stack(
      i === 1 ? (expStartX += 90) : (expStartX += 180),
      -3150,
      1,
      1,
      0,
      0,
      function (x, y) {
        return Bodies.rectangle(x, y, width, 200);
      }
    );
  }
  for (let j = 0; j < expBodies.length; j++) {
    Matter.Body.setStatic(expBodies[j].bodies[0], true);
    // Body.rotate(expBodies[j].bodies[0], 650);
  }
  World.add(engine.world, expBodies);
  var moveCycle2 = -1;
  let scaleDirection = 1.2;
  Events.on(engine, "beforeUpdate", function (event) {
    moveCycle2 += 0.025;
    // console.log(this.moveCycle)
    if (moveCycle2 < 0) {
      return;
    }
    for (let j = 0; j < expBodies.length; j++) {
      let { min, max } = expBodies[j].bodies[0].bounds;

      // MAYBE FLIP DIRECTION WHEN PLAYER REACHES EQR PLATFORM?

      let offset = (Math.PI / (expBodies.length - j + 10)) * 25;
      var time = engine.timing.timestamp;
      var scale = 1 + Math.sin(time * 0.001 - offset) * 0.01;
      // console.log(offset);
      Composite.scale(expBodies[j], 1, scale, {
        x: max.x,
        y: max.y,
      });
    }
  });

  // pyramid of circles
  pyramid = Composites.pyramid(1570, -4000, 7, 7, 0, 0, function (x, y) {
    return Bodies.circle(x, y, 20, { density: 0.0000001, restitution: 0.8 });
  });
  World.add(engine.world, pyramid);

  // special combined body to get to ASGS- moves left right & rotates
  moveCombined[moveCombined.length] = Body.create({
    parts: [
      Bodies.rectangle(1400, -480, 245, 50), //short
      Bodies.rectangle(1300, -480, 50, 400),
    ], //long
    isStatic: true,
    chamfer: { radius: 4 },
    ogX: 1000,
    ogY: -900,
    movement: "triangle",
  });
  var moveCycle2 = 0.2;
  let rotDirection = 1; // flips rotation
  let rotationCooldown = 0; // pause at angles
  let rotSpeed = -0.006;
  // start by going up to the left
  Events.on(engine, "beforeUpdate", function (event) {
    let direction = "1"; // diag up to left
    if (moveCombined[0].position.y > -400) {
      moveCycle2 = 0.2;
      direction = "1"; // diag up to left
    }
    if (moveCombined[0].position.y < -1300) {
      moveCycle2 = 0.2;
      direction = "2"; // go right
    }
    if (
      moveCombined[0].position.x > 1280 &&
      moveCombined[0].position.y < -600
    ) {
      moveCycle2 = 0.2;
      direction = "3"; // go down
    }
    moveCycle2 += 0.01;
    var px1;
    var py1;
    // going up left diagnal as default
    if (direction == "1") {
      px1 = moveCombined[0].position.x - 0.8 * moveCycle2;
      py1 = moveCombined[0].position.y - 0.8 * moveCycle2;
    } else if (direction == "2") {
      px1 = moveCombined[0].position.x + 10 * moveCycle2;
      py1 = moveCombined[0].position.y;
    } else if (direction == "3") {
      px1 = moveCombined[0].position.x;
      py1 = moveCombined[0].position.y + 10 * moveCycle2;
    }
    Body.setVelocity(moveCombined[0], {
      x: px1 - moveCombined[0].position.x,
      y: py1 - moveCombined[0].position.y,
    });
    Body.setPosition(moveCombined[0], { x: px1, y: py1 });

    /// rotation is between angles -1.57 and 0
    if (moveCombined[0].angle < -1.57) {
      moveCombined[0].angle = -1.57; // hard reset cause it gets lower than -1.5
      rotDirection = -1 * rotDirection;
      rotSpeed = 0;
    } else if (moveCombined[0].angle > 0) {
      moveCombined[0].angle = 0; // need hard reset cause it gets bigger than 0
      rotDirection = -1 * rotDirection;
      rotSpeed = 0;
    }
    // if pause, start counter
    if (rotSpeed != -0.006) {
      rotationCooldown++;
    }

    if (rotationCooldown == 300) {
      rotationCooldown = 0;
      rotSpeed = -0.006;
    }

    Body.rotate(moveCombined[0], rotSpeed * rotDirection);
    Body.setAngularVelocity(moveCombined[0], rotSpeed * rotDirection);
  });
  World.add(engine.world, moveCombined[0]);

  // bridge
  var group = Body.nextGroup(true);
  bridge = Composites.stack(160, -2000, 23, 1, 0, 0, function (x, y) {
    return Bodies.rectangle(x - 30, y, 53, 20, {
      collisionFilter: { group: group },
      chamfer: 5,
      density: 0.005,
      frictionAir: 0.05,
      render: {
        fillStyle: "#575375",
      },
    });
  });

  Composites.chain(bridge, 0.3, 0, -0.3, 0, {
    stiffness: 0.7,
    length: 0,
    render: {
      visible: true,
    },
  });
  World.add(engine.world, [
    bridge,
    Constraint.create({
      pointA: { x: 270, y: -2195 },
      bodyB: bridge.bodies[0],
      pointB: { x: -25, y: 0 },
      length: 2,
      stiffness: 0.7,
    }),
    Constraint.create({
      pointA: { x: 1310, y: -2310 },
      bodyB: bridge.bodies[bridge.bodies.length - 1],
      pointB: { x: 25, y: 0 },
      length: 2,
      stiffness: 0.7,
    }),
  ]);

  // right hanging platform
  body[body.length] = Bodies.rectangle(1700, -2260, 450, 40, {
    inertia: Infinity,
    friction: 0.1,
    frictionAir: 0.001,
    frictionStatic: 0.6,
    restitution: 0,
  });
  constraintPB(1600, -3000, body.length - 1, 0.0025);
  constraintPB(1800, -3000, body.length - 1, 0.0025);
  // circle to weigh down the platform
  body[body.length] = Bodies.circle(1675, -2900, 100, { density: 0.01 });
  // body[body.length] = Bodies.rectangle(1700, -2900, 100, 100);
  // body[body.length] = Bodies.rectangle(1700, -2900, 100, 100);

  // left hanging platform in reverse C cave
  body[body.length] = Bodies.rectangle(-850, -1440, 450, 50, {
    inertia: Infinity,
    friction: 0.1,
    frictionAir: 0.001,
    frictionStatic: 0.6,
    restitution: 0,
  });
  constraintPB(-700, -2200, body.length - 1, 0.005);
  constraintPB(-900, -2200, body.length - 1, 0.005);
  // boxes to weigh down the platform

  for (let i = 0; i < movingBodies.length; i++) {
    movingBodies[i].collisionFilter.group = 1;
    World.add(engine.world, movingBodies[i]);
  }

  // add objects to matterjs world
  for (let i = 0; i < body.length; i++) {
    body[i].collisionFilter.group = 1;
    // console.log(body[i]);
    World.add(engine.world, body[i]); //add to world
  }
  for (let i = 0; i < map.length; i++) {
    map[i].collisionFilter.group = -1;
    Matter.Body.setStatic(map[i], true); //make static
    World.add(engine.world, map[i]); //add to world
  }
  for (let i = 0; i < cons.length; i++) {
    World.add(engine.world, cons[i]);
  }
  for (let i = 0; i < consBB.length; i++) {
    World.add(engine.world, consBB[i]);
  }
  for (let i = 0; i < modalPlatforms.length; i++) {
    modalPlatforms[i].collisionFilter.group = -1;
    Matter.Body.setStatic(modalPlatforms[i], true); //make static
    World.add(engine.world, modalPlatforms[i]);
  }
}

// conditional checks
function playerOnGroundCheck(event) {
  //runs on collisions events
  function enter() {
    mech.numTouching++;
    if (!mech.onGround) mech.enterLand();
  }
  const pairs = event.pairs;
  for (let i = 0, j = pairs.length; i != j; ++i) {
    let pair = pairs[i];
    if (pair.bodyA === jumpSensor) {
      mech.onBody = pair.bodyB.id;
      enter();
    } else if (pair.bodyB === jumpSensor) {
      enter();
      mech.onBody = pair.bodyA.id;
    }
  }
}

function playerTouchCaseStudy() {
  // check what bodys player is touching- if match- show modal for casestudy
  // console.log(mech.onBody)
}

function playerOffGroundCheck(event) {
  //runs on collisions events
  function enter() {
    if (mech.onGround && mech.numTouching === 0) mech.enterAir();
  }
  const pairs = event.pairs;
  for (let i = 0, j = pairs.length; i != j; ++i) {
    let pair = pairs[i];
    if (pair.bodyA === jumpSensor) {
      enter();
    } else if (pair.bodyB === jumpSensor) {
      enter();
    }
  }
}

function playerHeadCheck(event) {
  //runs on collisions events
  if (mech.crouch) {
    mech.isHeadClear = true;
    const pairs = event.pairs;
    for (let i = 0, j = pairs.length; i != j; ++i) {
      let pair = pairs[i];
      if (pair.bodyA === headSensor) {
        mech.isHeadClear = false;
      } else if (pair.bodyB === headSensor) {
        mech.isHeadClear = false;
      }
    }
  }
}
Events.on(engine, "beforeUpdate", function (event) {
  mech.numTouching = 0;
});

//determine if player is on the ground
Events.on(engine, "collisionStart", function (event) {
  playerOnGroundCheck(event);
  playerHeadCheck(event);
  playerTouchCaseStudy();
});
Events.on(engine, "collisionActive", function (event) {
  playerOnGroundCheck(event);
  playerHeadCheck(event);
  playerTouchCaseStudy();
});
Events.on(engine, "collisionEnd", function (event) {
  playerOffGroundCheck(event);
});

// draw out objects
function drawMatterWireFrames() {
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "red";
  const bodies = Composite.allBodies(engine.world);
  ctx.beginPath();
  for (let i = 0; i < bodies.length; i += 1) {
    ctx.fillText(bodies[i].id, bodies[i].position.x, bodies[i].position.y);
    let vertices = bodies[i].vertices;
    ctx.moveTo(vertices[0].x, vertices[0].y);
    for (let j = 1; j < vertices.length; j += 1) {
      ctx.lineTo(vertices[j].x, vertices[j].y);
    }
    ctx.lineTo(vertices[0].x, vertices[0].y);
  }
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#000";
  ctx.stroke();
}

function drawMap() {
  ctx.beginPath();
  for (let i = 0; i < map.length; i += 1) {
    let vertices = map[i].vertices;
    ctx.moveTo(vertices[0].x, vertices[0].y);
    for (let j = 1; j < vertices.length; j += 1) {
      ctx.lineTo(vertices[j].x, vertices[j].y);
    }
    ctx.lineTo(vertices[0].x, vertices[0].y);
  }
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#fff";
  ctx.stroke();
}

function drawBody() {
  ctx.beginPath();
  for (let i = 0; i < body.length; i += 1) {
    let vertices = body[i].vertices;
    ctx.moveTo(vertices[0].x, vertices[0].y);
    for (let j = 1; j < vertices.length; j += 1) {
      ctx.lineTo(vertices[j].x, vertices[j].y);
    }
    ctx.lineTo(vertices[0].x, vertices[0].y);
  }
  ctx.lineWidth = 1.5;
  ctx.fillStyle = "#777";
  ctx.fill();
  ctx.strokeStyle = "#222";
  ctx.stroke();
}

function drawCons() {
  ctx.beginPath();
  for (let i = 0; i < cons.length; i += 1) {
    ctx.moveTo(cons[i].pointA.x, cons[i].pointA.y);
    ctx.lineTo(cons[i].bodyB.position.x, cons[i].bodyB.position.y);
  }
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#fff";
  ctx.stroke();
}

function drawMovingBodies() {
  ctx.beginPath();
  for (let i = 0; i < movingBodies.length; i += 1) {
    let vertices = movingBodies[i].vertices;
    ctx.moveTo(vertices[0].x, vertices[0].y);
    for (let j = 1; j < vertices.length; j += 1) {
      ctx.lineTo(vertices[j].x, vertices[j].y);
    }
    ctx.lineTo(vertices[0].x, vertices[0].y);
  }
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#fff";
  ctx.stroke();
}
function drawExpBodies() {
  ctx.moveTo(
    expBodies[0].bodies[0].vertices[0].x,
    expBodies[0].bodies[0].vertices[0].y
  );
  for (let k = 0; k < expBodies.length; k++) {
    for (let i = 0; i < expBodies[k].bodies.length; i++) {
      ctx.beginPath();
      for (let j = 0; j < expBodies[k].bodies[i].vertices.length; j++) {
        ctx.lineTo(
          expBodies[k].bodies[i].vertices[j].x,
          expBodies[k].bodies[i].vertices[j].y
        );
        // finish connecting each chain
        if (j == expBodies[k].bodies[i].vertices.length - 1) {
          ctx.lineTo(
            expBodies[k].bodies[i].vertices[0].x,
            expBodies[k].bodies[i].vertices[0].y
          );
        }
      }
      ctx.lineWidth = 2;

      ctx.strokeStyle = "#777";
      ctx.stroke();
    }
  }
}

// combined bodies
function drawComBodies() {
  ctx.beginPath();
  for (let i = 0; i < compBodies.length; i += 1) {
    // j starts at one to ignore index 0 wrapper body
    for (let j = 1; j < compBodies[i].parts.length; j++) {
      let vertices = compBodies[i].parts[j].vertices;
      ctx.moveTo(vertices[0].x, vertices[0].y);
      for (let j = 1; j < vertices.length; j += 1) {
        ctx.lineTo(vertices[j].x, vertices[j].y);
      }
      ctx.lineTo(vertices[0].x, vertices[0].y);
    }
  }
  ctx.fillStyle = "#777";
  ctx.fill();
}

function drawMovingCombined() {
  ctx.beginPath();
  for (let i = 0; i < moveCombined.length; i += 1) {
    for (let j = 1; j < moveCombined[i].parts.length; j++) {
      let vertices = moveCombined[i].parts[j].vertices;
      ctx.moveTo(vertices[0].x, vertices[0].y);
      for (let j = 1; j < vertices.length; j += 1) {
        ctx.lineTo(vertices[j].x, vertices[j].y);
      }
      ctx.lineTo(vertices[0].x, vertices[0].y);
    }
  }
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#fff";
  ctx.stroke();
}

function drawComposites() {
  //draw bridge
  ctx.moveTo(bridge.bodies[0].vertices[0].x, bridge.bodies[0].vertices[0].y);
  for (let i = 0; i < bridge.bodies.length; i++) {
    ctx.beginPath();
    for (let j = 0; j < bridge.bodies[i].vertices.length; j++) {
      ctx.lineTo(
        bridge.bodies[i].vertices[j].x,
        bridge.bodies[i].vertices[j].y
      );
      // finish connecting each chain
      if (j == bridge.bodies[i].vertices.length - 1) {
        ctx.lineTo(
          bridge.bodies[i].vertices[0].x,
          bridge.bodies[i].vertices[0].y
        );
      }
    }
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#777";
    ctx.stroke();
  }

  //drawpyramid
  ctx.moveTo(pyramid.bodies[0].vertices[0].x, pyramid.bodies[0].vertices[0].y);
  for (let i = 0; i < pyramid.bodies.length; i++) {
    ctx.beginPath();
    for (let j = 0; j < pyramid.bodies[i].vertices.length; j++) {
      ctx.lineTo(
        pyramid.bodies[i].vertices[j].x,
        pyramid.bodies[i].vertices[j].y
      );
      // finish connecting each chain
      if (j == pyramid.bodies[i].vertices.length - 1) {
        ctx.lineTo(
          pyramid.bodies[i].vertices[0].x,
          pyramid.bodies[i].vertices[0].y
        );
      }
    }
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#777";
    ctx.stroke();
  }

  ctx.moveTo(
    composites[0].bodies[0].vertices[0].x,
    composites[0].bodies[0].vertices[0].y
  );
  for (let i = 0; i < composites.length; i++) {
    for (let k = 0; k < composites[i].bodies.length; k++) {
      ctx.beginPath();
      for (let j = 0; j < composites[i].bodies[k].vertices.length; j++) {
        ctx.lineTo(
          composites[i].bodies[k].vertices[j].x,
          composites[i].bodies[k].vertices[j].y
        );

        // finish connecting each chain
        if (j == composites[i].bodies[k].vertices.length - 1) {
          ctx.lineTo(
            composites[i].bodies[k].vertices[0].x,
            composites[i].bodies[k].vertices[0].y
          );
        }
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#777";
        ctx.stroke();
      }
    }
  }
}

function drawModalPlatforms() {
  ctx.beginPath();
  for (let i = 0; i < modalPlatforms.length; i += 1) {
    let vertices = modalPlatforms[i].vertices;
    ctx.moveTo(vertices[0].x, vertices[0].y);
    for (let j = 1; j < vertices.length; j += 1) {
      ctx.lineTo(vertices[j].x, vertices[j].y);
    }
    ctx.lineTo(vertices[0].x, vertices[0].y);
  }
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#FED766";
  ctx.stroke();
}

function drawCatapult() {
  ctx.beginPath();
  for (let i = 0; i < cata.length; i++) {
    let vertices = cata[i].vertices;
    ctx.moveTo(vertices[0].x, vertices[0].y);
    for (let j = 1; j < vertices.length; j += 1) {
      ctx.lineTo(vertices[j].x, vertices[j].y);
    }
    ctx.lineTo(vertices[0].x, vertices[0].y);
  }
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#fff";
  ctx.stroke();
}

let img_designer = new Image();
img_designer.src = "./physicsEngine/designer.svg";
let img_developer = new Image();
img_developer.src = "./physicsEngine/developer.svg";

let reverse = 1;
var img,
  opacity = 0;
setInterval(function () {
  if (reverse == 1) {
    reverse = 2;
    opacity = 0;
  } else {
    reverse = 1;
    opacity = 0;
  }
}, 5000);
function designerDev() {
  (function fadeIn() {
    /// set alpha
    ctx.save();
    ctx.globalAlpha = opacity;

    img = reverse == 1 ? img_designer : img_developer;

    /// draw image with current alpha
    ctx.drawImage(img, -450, -550);
    ctx.restore();
    /// increase alpha to 1, then exit resetting isBusy flag
    opacity += 0.005;
    if (opacity < 1) requestAnimationFrame(fadeIn);
  })();
}
let asgs = new Image();
asgs.src = "./physicsEngine/asgs.svg";
let birch = new Image();
birch.src = "./physicsEngine/birch.svg";
let d4sd = new Image();
d4sd.src = "./physicsEngine/d4sd.svg";
let eqr = new Image();
eqr.src = "./physicsEngine/eqr.svg";
let intuit = new Image();
intuit.src = "./physicsEngine/intuit.svg";
let ucsd = new Image();
ucsd.src = "./physicsEngine/ucsd.svg";
let workday = new Image();
workday.src = "./physicsEngine/workday.svg";
var moveCycleSVG = -1;
function drawSVGs() {
  moveCycleSVG += 0.025;
  ctx.save();
  ctx.drawImage(asgs, -350, -1845);
  ctx.drawImage(birch, 350, 500);
  ctx.drawImage(ucsd, -1900, -820);
  ctx.drawImage(intuit, -1800, -1395);
  // workday moving playform
  var px =
    modalPlatforms[modalPlatforms.length - 1].ogX -
    200 +
    50 * Math.sin(moveCycleSVG / 2);
  ctx.drawImage(workday, px, 300);
  ctx.drawImage(eqr, 1400, -3395);
  ctx.drawImage(d4sd, -1850, -3980);
  ctx.restore();
}

function drawPlayerBodyTesting() {
  //shows the different parts of the player body for testing
  //jump
  ctx.beginPath();
  let bodyDraw = jumpSensor.vertices;
  ctx.moveTo(bodyDraw[0].x, bodyDraw[0].y);
  for (let j = 1; j < bodyDraw.length; j += 1) {
    ctx.lineTo(bodyDraw[j].x, bodyDraw[j].y);
  }
  ctx.lineTo(bodyDraw[0].x, bodyDraw[0].y);
  ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
  ctx.fill();
  ctx.strokeStyle = "#000";
  ctx.stroke();
  //main body
  ctx.beginPath();
  bodyDraw = playerBody.vertices;
  ctx.moveTo(bodyDraw[0].x, bodyDraw[0].y);
  for (let j = 1; j < bodyDraw.length; j += 1) {
    ctx.lineTo(bodyDraw[j].x, bodyDraw[j].y);
  }
  ctx.lineTo(bodyDraw[0].x, bodyDraw[0].y);
  ctx.fillStyle = "rgba(0, 255, 255, 0.3)";
  ctx.fill();
  ctx.stroke();
  //fist
  ctx.beginPath();
  bodyDraw = playerFist.vertices;
  ctx.moveTo(bodyDraw[0].x, bodyDraw[0].y);
  for (let j = 1; j < bodyDraw.length; j += 1) {
    ctx.lineTo(bodyDraw[j].x, bodyDraw[j].y);
  }
  ctx.lineTo(bodyDraw[0].x, bodyDraw[0].y);
  ctx.fillStyle = "rgba(255, 5, 255, 0.3)";
  ctx.fill();
  ctx.stroke();
  //head
  ctx.beginPath();
  bodyDraw = playerHead.vertices;
  ctx.moveTo(bodyDraw[0].x, bodyDraw[0].y);
  for (let j = 1; j < bodyDraw.length; j += 1) {
    ctx.lineTo(bodyDraw[j].x, bodyDraw[j].y);
  }
  ctx.lineTo(bodyDraw[0].x, bodyDraw[0].y);
  ctx.fillStyle = "rgba(255, 255, 0, 0.3)";
  ctx.fill();
  ctx.stroke();
  //head sensor
  ctx.beginPath();
  bodyDraw = headSensor.vertices;
  ctx.moveTo(bodyDraw[0].x, bodyDraw[0].y);
  for (let j = 1; j < bodyDraw.length; j += 1) {
    ctx.lineTo(bodyDraw[j].x, bodyDraw[j].y);
  }
  ctx.lineTo(bodyDraw[0].x, bodyDraw[0].y);
  ctx.fillStyle = "rgba(0, 0, 255, 0.3)";
  ctx.fill();
  ctx.stroke();
}

// cycle loop
function cycle() {
  game.timing();
  game.wipe();
  mech.keyMove();
  // game.keyZoom();
  if (game.testing) {
    mech.deathCheck();
    punchLoop();
    ctx.save();
    game.scaleZoom();
    ctx.translate(mech.transX, mech.transY);
    mech.draw();
    drawMatterWireFrames();
    drawPlayerBodyTesting();
    drawComBodies();
    drawMovingCombined();
    ctx.restore();
    mech.info();
  } else {
    mech.move();
    mech.deathCheck();
    punchLoop();
    mech.look();
    game.wipe();
    ctx.save();
    game.scaleZoom();
    ctx.translate(mech.transX, mech.transY);
    designerDev();
    drawSVGs();
    drawCons();
    drawBody();
    mech.draw();
    drawMap();
    drawMovingBodies();
    drawExpBodies();
    drawMovingCombined();
    drawComposites();
    drawCatapult();
    drawComBodies();
    drawModalPlatforms();
    ctx.restore();
  }

  requestAnimationFrame(cycle);
}

function runPlatformer(el) {
  el.onclick = null;
  el.style.display = "none";
  Engine.run(engine);
  document.getElementById("canvas").classList.toggle("fade");
  console.clear(); // convex vertice warnings
  open();
  requestAnimationFrame(cycle); //starts game
}

function open() {
  const introCycles = 200;

  game.zoom = 0.8;

  if (game.cycle < introCycles) {
    requestAnimationFrame(open);
  } else {
    ctx.restore();
  }
}
