var DOMSprite = function(params){
	// params = { 
	// 		image : url of image
	//		imageWidth : with of image
	//		width : width of sprite
	//		height : height of sprite
	//		$parent : parent node of sprite
	//		index 
	// }

	// Store the params in local 
	var width = params.width, 
		height = params.height,
		imageWidth = params.imageWidth,
		$parent = params.$parent,
		$ele = $( '<div>' ),
		style = $ele.get(0).style;

	// Append the sprite to target area
	$parent.append( $ele );

	// Set the element's style 
	$ele.css({
		'position' : 'absolute',
		'width': width,
		'height': height,
		'background-image': 'url(' + params.image + ')' 
	});

	// Return an object with methods:
	// 1. draw : set the element's postoin
	// 2. changeImage : change th sprite's image postion throught index
	// 3. show : show the sprite 
	// 4. hide : hide the sprite
	// 5. destroy : remove the sprite from its parent
	return {
		style : style, 
		draw: function(x, y){
				  style.left = x + 'px';
				  style.top = y + 'px';
				  return this;
	    },
		changeImage: function(index){
						 index *= width;
						 var v = -Math.floor( index / imageWidth ) * height;
						 var h = -index % imageWidth;
						 var pos = h + 'px ' + v + 'px';
						 style.backgroundPosition = pos; 
						 return this;
		},
		show: function(){
				  style.display = 'block';
				  return this;
	    },
		hide: function(){
				  style.display = 'none';
				  return this;
	    }, 
		destory: function(){
					 $ele.remove();
				     return this;
		}
	};
}

/*
 * Class bouncySprite 
 * A Class which product and objct that can move directly
 * Add new methods and inheritant from Class DOMSprite
 * */
var bouncySprite = function(params){
	var x = params.x,
		y = params.y,
		xDir = params.xDir,
		yDir = params.yDir,
		maxX = params.maxX, 
		maxY = params.maxY
		index = 0
		that = DOMSprite(params);

	that.move = function(){
		// Move the sprite
		x += xDir;
		y += yDir;

		// bounce the sprite
		if( ( xDir > 0 && x > maxX ) || ( xDir < 0 && x < 0 ) ) {
			xDir = -xDir;
		}
		if( ( yDir > 0 && y > maxY ) || ( yDir < 0 && y < 0 ) ) {
			yDir = -yDir;
		}

		// draw the sprite to screen
		this.draw(x, y);

		// return the objct itself, for chain invoke
		return that;
	};

	return that;
};

/*
 * Add certain number of bouncys to elements
 * And move them
 * */ 
var bouncyBoss = function(num,$parent){
	var bouncys = [];
	for(var i = 0; i < num; i++) {
		bouncys.push(bouncySprite({
				image: 'img/img.jpg',
				imageWidth: 640,
				width: 64,
				height: 64,
				$parent: $parent,
				maxX: $parent.width() - 64,
				maxY: $parent.height() - 64,
				y: Math.random() * ( $parent.height() - 64),
				x: Math.random() * ( $parent.width() - 64),
				xDir: Math.random() * 10 - 5,
				yDir: Math.random() * 10 - 5 
			})
		);
	}
	var move = function(){
		requestAnimationFrame(move);
		for(var i = 0, len = bouncys.length; i < len; i++) {
			bouncys[i].move();
		}
	};
	move();
}

