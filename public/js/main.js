var bouncyBall = function(params) {
	// params = {
	// 		draw:(ctx)
	// 		ctx :
	// 		mass:
	// 		width :
	// 		height :
	// 		move :
	// 		maxX :
	// 		maxY : 
	// }

	// Rewirte draw funtion
	// draw is for self's change  
	// move is for possition change
	var radius = params.radius;
	params.draw = function(ctx){
		ctx.fillStyle = '#ccc';
		ctx.beginPath(); 
		ctx.arc(radius, radius, radius, 0, Math.PI * 1.9, false);
		ctx.closePath(); 
		ctx.stroke();
		ctx.fill();
	}
	// Rewrite its move function
	params.move = function(){
		;
	}; 
	var that = CanvasSprite(params);
	return that; 
};


var canvas = document.getElementById('canvas')
,	ctx = canvas.getContext('2d');

// init animation's area
animate.configure({
	ctx: ctx,
	width: 500,
	height: 630,
	style: '#000'
});  
// init the collision dection 
//collision.collideAll();
//collision.addMap('ball','ball',bounce);

var addBall = function(){
	var radius = 20;//Math.floor(Math.random() * 20) + 20;
	var ball = bouncyBall({
		//draw: function(){},
		ctx: ctx,
		width: radius,
		height: radius,
		type: 'ball',
		radius: radius,
		//x: Math.random() * scrollWidth,
		//y: Math.random() * scrollHeight,
		//maxX: scrollWidth - radius * 2,
		//maxY: scrollHeight - radius * 2, 
		//vector: vector(Math.random() * 6 - 3, 0),
		//accelerator: vector(0, 1),
		radius: radius
	});
	ball.animate();
	return ball;
}

var socket = io.connect();

socket.on('new player', function(id) {
	console.log(id);
});

socket.on('player leave', function(id) {
	console.log(id);
});

socket.on('connect', function(id) {
	socket.sprite = addBall();
});
socket.on('sync', function(id, info) {
	socket.sprite.set(info);
	animate.animation();
});
