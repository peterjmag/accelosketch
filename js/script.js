/* Adapted from http://savagelook.com/blog/code/box2d-js-physics-in-html5-javascript-guide
   and http://mrdoob.com/projects/chromeexperiments/ball_pool/
*/

var world;
var ctx;
var canvasWidth;
var canvasHeight;
var canvasTop;
var canvasLeft;

var delta = [0, 0];
var orientation = {x: 0, y: 1};

var walls = [];
var wall_thickness = 10;
var wallsSet = false;

var stage = [window.screenX, window.screenY, window.innerWidth, window.innerHeight];
getBrowserDimensions();

function drawWorld(world, context) {
  for (var j = world.m_jointList; j; j = j.m_next) {
    drawJoint(j, context);
  }
  for (var b = world.m_bodyList; b; b = b.m_next) {
    for (var s = b.GetShapeList(); s != null; s = s.GetNext()) {
      drawShape(s, context);
    }
  }
}

function drawShape(shape, context) {
  if (shape.density == 1.0) {
    context.fillStyle = "red";
  } else {
    context.fillStyle = "black";
  }
  context.beginPath();
  switch (shape.m_type) {
  case b2Shape.e_circleShape:
    {
      var circle = shape;
      var pos = circle.m_position;
      var r = circle.m_radius;
      var segments = 16.0;
      var theta = 0.0;
      var dtheta = 2.0 * Math.PI / segments;

      // draw circle
      context.moveTo(pos.x + r, pos.y);
      for (var i = 0; i < segments; i++) {
        var d = new b2Vec2(r * Math.cos(theta), r * Math.sin(theta));
        var v = b2Math.AddVV(pos, d);
        context.lineTo(v.x, v.y);
        theta += dtheta;
      }
      context.lineTo(pos.x + r, pos.y);

      // draw radius
      context.moveTo(pos.x, pos.y);
      var ax = circle.m_R.col1;
      var pos2 = new b2Vec2(pos.x + r * ax.x, pos.y + r * ax.y);
      context.lineTo(pos2.x, pos2.y);
    }
    break;
  case b2Shape.e_polyShape:
    {
      var poly = shape;
      var tV = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[0]));
      context.moveTo(tV.x, tV.y);
      for (var i = 0; i < poly.m_vertexCount; i++) {
        var v = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[i]));
        context.lineTo(v.x, v.y);
      }
      context.lineTo(tV.x, tV.y);
    }
    break;
  }
  context.fill();
}

function createWorld() {
  var worldAABB = new b2AABB();
  worldAABB.minVertex.Set( -200, -200 );
  worldAABB.maxVertex.Set( screen.width + 200, screen.height + 200 );
  var gravity = new b2Vec2(0, 300);
  var doSleep = true;
  world = new b2World(worldAABB, gravity, doSleep);
  return world;
}

function createBall(world, x, y) {
  var ballSd = new b2CircleDef();
  ballSd.density = 1.0;
  ballSd.radius = 20;
  ballSd.restitution = 0.5;
  ballSd.friction = 0.5;
  var ballBd = new b2BodyDef();
  ballBd.AddShape(ballSd);
  ballBd.position.Set(x,y);
  return world.CreateBody(ballBd);
}

function createBox(world, x, y, width, height, fixed) {
  if (typeof(fixed) == 'undefined') fixed = true;
  var boxSd = new b2BoxDef();
  if (!fixed) boxSd.density = 1.0; 
  boxSd.restitution = 0.0;
  boxSd.friction = 1.0;
  boxSd.extents.Set(width, height);
  var boxBd = new b2BodyDef();
  boxBd.AddShape(boxSd);
  boxBd.position.Set(x,y);
  return world.CreateBody(boxBd);
}

function getBrowserDimensions() {
  var changed = false;

  if (stage[0] != window.screenX) {
    delta[0] = (window.screenX - stage[0]) * 50;
    stage[0] = window.screenX;
    changed = true;
  }

  if (stage[1] != window.screenY) {
    delta[1] = (window.screenY - stage[1]) * 50;
    stage[1] = window.screenY;
    changed = true;
  }

  if (stage[2] != window.innerWidth) {
    stage[2] = window.innerWidth;
    changed = true;
  }

  if (stage[3] != window.innerHeight) {
    stage[3] = window.innerHeight;
    changed = true;
  }

  return changed;
}

function setWalls() {
  if (wallsSet) {
    world.DestroyBody(walls[0]);
    world.DestroyBody(walls[1]);
    world.DestroyBody(walls[2]);
    world.DestroyBody(walls[3]);

    walls[0] = null;
    walls[1] = null;
    walls[2] = null;
    walls[3] = null;
  }

  walls[0] = createBox(world, stage[2] / 2, - wall_thickness, stage[2], wall_thickness);
  walls[1] = createBox(world, stage[2] / 2, stage[3] + wall_thickness, stage[2], wall_thickness);
  walls[2] = createBox(world, - wall_thickness, stage[3] / 2, wall_thickness, stage[3]);
  walls[3] = createBox(world, stage[2] + wall_thickness, stage[3] / 2, wall_thickness, stage[3]);	

  wallsSet = true;
}

function onWindowDeviceOrientation( event ) {
  if ( event.beta ) {
    orientation.x = Math.sin( event.gamma * Math.PI / 180 );
    orientation.y = Math.sin( ( Math.PI / 4 ) + event.beta * Math.PI / 180 );
  }
}

function step(cnt) {
  var stepping = false;
  var timeStep = 1.0/60;
  var iteration = 1;

  delta[0] += (0 - delta[0]) * .5;
  delta[1] += (0 - delta[1]) * .5;
  world.m_gravity.x = orientation.x * 350 + delta[0];
  world.m_gravity.y = orientation.y * 350 + delta[1];

  world.Step(timeStep, iteration);
  drawWorld(world, ctx);
  setTimeout('step(' + (cnt || 0) + ')', 10);
}

// main entry point
Event.observe(window, 'load', function() {
  world = createWorld();
  ctx = $('sketch').getContext('2d');
  var canvasElm = $('sketch');

  setWalls();

  window.addEventListener('deviceorientation', onWindowDeviceOrientation, false);

  Event.observe('sketch', 'click', function(e) {
    if (Math.random() > 0.5) {
      //createBox(world, Event.pointerX(e), Event.pointerY(e), 10, 10, false);
      createBox(world, e.clientX, e.clientY, 10, 10, false);
    } else {
      createBall(world, Event.pointerX(e), Event.pointerY(e));
    }
  });
  step();
});
