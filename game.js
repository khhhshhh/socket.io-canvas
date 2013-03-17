var sprite = require('./animation/sprite.js')
,	io = require('socket.io')
,	CanvasSprite = sprite.CanvasSprite
,	animate = sprite.animate
,	vector = sprite.vector
,	bounce = sprite.bounce
,	collision = sprite.collision
,	players = []
,	scrollWidth = 1024
,	scrollHeight = 630;

var bouncyBall = function(params) {
	// params = {
	// 		ctx :
	// 		mass:
	// 		width :
	// 		height :
	// 		move :
	// 		maxX :
	// 		maxY : 
	// }

	// Rewrite its move function
	params.move = function(){
		if(!isStop) {
			// bounce the sprite
			var xDir = that.vector.vx,
				yDir = that.vector.vy,
				x = that.x,
				y = that.y;
			if( ( xDir > 0 && x > maxX ) || ( xDir < 0 && x < 0 ) ) {
				that.vector.vx = -( xDir) * 0.9; 
				if(x > maxX) {
					that.x = maxX;
				}
			}
			if( ( yDir > 0 && y > maxY ) || ( yDir < 0 && y < 0 ) ) {
				that.vector.vy = -( yDir) * 0.9; 
				if(y > maxY) {
					that.y = maxY;
				}
			}
		}
		// return the objct itself, for chain invoke
		sync(that);
		return that;
	}; 
	var that = CanvasSprite(params),
		maxX = params.maxX,
		maxY = params.maxY,
		isStop = false,
		radius = params.radius;
	return that; 
};

function sync(sprite) {
	io.sockets.in('game').emit('sync', sprite.socket.id, sprite.toJSON());
};

function addBall(){
	var radius = 20;//Math.floor(Math.random() * 20) + 20;
	var ball = bouncyBall({
		draw: function(){},
		width: radius,
		height: radius,
		type: 'ball',
		radius: radius,
		x: Math.random() * scrollWidth,
		y: Math.random() * scrollHeight,
		maxX: scrollWidth - radius * 2,
		maxY: scrollHeight - radius * 2, 
		vector: vector(Math.random() * 6 - 3, 0),
		accelerator: vector(0, 0),
		radius: radius
	});
	ball.animate();
	collision.addSprite(ball);
	return ball;
}


// init animation's area
animate.start({
	width: scrollWidth,
	height: scrollHeight,
});  
collision.collideAll();
collision.addMap('ball','ball',bounce);
animate.addSprite({
	move: function() {
		io.sockets.in('game').emit('animate');
	}
});

var pace = 1;
var max = 6;
function go(vect, direct) {
	if(vect * direct < 0) vect = 2 * direct;
	vect += direct * pace;
	return Math.abs(vect) > max ? max * direct : vect;
	//return max * direct;
};
var keyEvent = {
	// left
	'37': function(sprite) {
		sprite.vector.vx = go(sprite.vector.vx, -1);
	},
	//up
	'38': function(sprite) {
		sprite.vector.vy = go(sprite.vector.vy, -1);
	},
	//right
	'39': function(sprite) {
		sprite.vector.vx = go(sprite.vector.vx, 1);
	},
	//down
	'40': function(sprite) {
		sprite.vector.vy = go(sprite.vector.vy, 1);
	}
};

module.exports = function(server) {
	io = io.listen(server);
	io.set('log level', 0);
	io.sockets.on('connection', function(socket) {
		
		socket.join('game');

		socket.broadcast.emit('new player', socket.id);
		
		var players = io.sockets.clients('game');

		for(var i = 0, len = players.length; i < len; i++) {
			socket.emit('new player', players[i].id);
		}

		var ball = addBall();

		ball.socket = socket;

		socket.send(socket.id);

		socket.on('disconnect', function() {
			io.sockets.in('game').emit('player leave', socket.id);
			ball.destory();
			ball = null;
		});

		socket.on('keydown', function(keyCode) {
			if(keyEvent[keyCode]) {
				keyEvent[keyCode](ball);
			}
		});
	});
};
