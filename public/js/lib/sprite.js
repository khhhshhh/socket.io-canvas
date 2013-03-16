/* @author: SYSU_daijiahua
 * @version: 0.0.2
 * @date: 2011.5.6
 *
 * Class CanvasSprite
 * create a sprite on canvas
 * When you want to inheritant from this class, your just need to rewrite the params.move() and params.draw(); 
 * return an object like below 
 * {
 * 		x :	
 * 		y :   		  // Record the sprite's position on canvas' area
 *		moveTo(x, y): // Move to certain position on the canvas
 *		show():		  //Appear on the canvas, it's position will be the position it hide  
 *		hide():		  // hide the object on canvas
 *		move():		  // just for animation loop, it'll be invoked intervally when the sprite add to animation loop 
 *		anim():		  // add the sprite to animation loop 
 *		stopAnim():   // remove the sprite from animation loop 
 *		addCollisioin(): // add sprite to collision dectetion list
 *		deleteCollisioin(): // delete sprite from collision dectetion list
 *		addBorder(width, height)     // nerver let it escape form certain area
 *		deleteBorder()     // remove the border
 *		collide():    // use for collision detection
 * }
 * */
var CanvasSprite = function(params){
	// params = {
	// 		draw:(ctx)
	// 		ctx :
	// 		width :  
	// 		height :
	// 		move :
	// 		x :
	// 		y :
	// 		type :
	// 		collide :
	// 		radius:
	// 		vector: 	 // An vector object: speed of the sprite, on the direction: x and y
	// 		accelerator: // An vector object: accelerator of the sprite, it'll reflect the speed(vector) of the sprite
	// 		mass:		 // for calculate the collision reflection
	// }
	var draw = params.draw || function(ctx){},
		ctx = params.ctx,
		width = params.width || 0,
		height = params.height || 0, 
		move = params.move || function(){},
		that = null;

	that = {
		mass: params.mass || 1,
		x : params.x || 0,
		y : params.y || 0,
		radius: params.radius || 10,
		type: params.type || '',
		moveTo: function(xM, yM){
					this.hide();
					x = xM;
					y = yM;
					this.show();
					return this;
		},
		show: function(){
					var x = this.x,
						y = this.y;
					ctx.save();
					ctx.translate(x, y);
					draw(ctx);
					ctx.restore();
					return this;
	    },
		hide: function(w, h){
				 var w = w || width,
					 h = h || height;
				 ctx.save();
				 ctx.clearRect(x, y, w, h);
				 ctx.restore();
				 return this;
	    },
		move: function(){
				  /*this.vector.vx += this.accelerator.vx;
				  this.vector.vy += this.accelerator.vy;
				  this.x += this.vector.vx;
				  this.y += this.vector.vy;
				  if(isAddBorder) { // border detection
					  var xDir = that.vector.vx,
						  yDir = that.vector.vy,
						  maxX = borderX + borderWidth,
						  maxY = borderY + borderHeight,
						  x = that.x,
						  y = that.y;
					  if( ( xDir > 0 && x > maxX ) || ( xDir < 0 && x < borderX ) ) {
						  that.vector.vx = 0; 
						  if(x > maxX) {
							  that.x = maxX;
						  }
						  if(x < borderX) {
							  that.x = borderX;
						  }
					  }
					  if( ( yDir > 0 && y > maxY ) || ( yDir < 0 && y < borderY ) ) {
						  that.vector.vy = 0; 
						  if(y > maxY) {
							  that.y = maxY;
						  }
						  if(y < borderY) {
							  that.y = borderY;
						  }
					  }
				  }*/
				  move();
				  this.show();
				  return this;
	    },
		animate: function(){
				  animate.addSprite(this);
				  return this;
	    },
		stopAnimate: function(){
				  animate.deleteSprite(this);
				  return this;
	    },
		set: function(obj) {
			this.x = obj.x || this.x;
			this.y = obj.y || this.y;
			this.mass = obj.mass || this.mass;
		}
		/*addCollisioin: function(){
						   collision.addSprite(this);
	    },
		deleteCollisioin: function(){
						   collision.deleteSprite(this);
	    },
		addBorder: function(x, y, width, height){
					   isAddBorder = true;
					   borderX = x;
					   borderY = y;
					   borderWidth = width || 100000;
					   borderHeight = height || 100000;
	    },
		deleteBorder: function(){
					   isAddBorder = false;
	    },
		collide: function(){
		}*/
	};
	return that.show();
};

/*
 *
 * Amimate management
 *
 * return an object that control global animation
 * {
 * 		start({
 * 			ctx :
 * 			width :
 * 			height :
 * 			style: 
 * 		});                   // for clear the Rectangle area
 * 		restart():            // After calling the start fucntion, you have no need to put the params again 
 * 		stop():      		  // stop the global animation, all animation on canvas will pause 
 * 		addSprite(sprite): 	  // add new sprite to animation loop, the object must contain a move method
 * 		deleteSprite(sprite): // delete the certain sprite in animation loop 
 * }
 * */ 
var animate = (function(){
	var list = [],
		len = list.length,
		width = 0,
		height = 0,
		ctx = null,
		anim = null,
		ran = false;
		return {
			configure: function(params) {
				   ran = true;
				   ctx = params.ctx;
				   width = params.width;
				   height = params.height;
				   ctx.fillStyle = params.style || '#FFFFFF'; 
			},
			animation: function() {
				   var newList = [],
					   item;
				   ctx.fillRect(0, 0, width, height);
				   for(var i = 0,l = list.length; i < l; i++ ){
					   item = list[i];
					   if(item.isRemoveAnim) {
						   continue;
					   }
					   item.move();
					   newList.push(item);
				   }
				   list = newList; 
				   return this;
			},
			/*start: function(params){
				   // params = {
				   // 		ctx:
				   // 		width:
				   // 		height:
				   // 		style:
				   // }
				   ran = true;
				   ctx = params.ctx;
				   width = params.width;
				   height = params.height;
				   ctx.fillStyle = params.style || '#FFFFFF'; 
				   var animation = function(){
					   var newList = [],
						   item;
					   ctx.fillRect(0, 0, width, height);
					   for(var i = 0,l = list.length; i < l; i++ ){
						   item = list[i];
						   if(item.isRemoveAnim) {
							   continue;
						   }
						   item.move();
						   newList.push(item);
					   }
					   list = newList; 
					   anim = requestAnimationFrame(animation);
				   };
				   animation();
				   return this;
		    },
			restart: function(){
						 if(ran){
							 ctx.fillStyle = params.style; 
							 var animation = function(){
								 var newList = [];
								 ctx.fillRect(0, 0, width, height);
								 for(var i = 0; i < len; i++ ){
									 var item = list[i];
									 if(item.isRemoveAnim) {
										 continue;
									 }
									 item.move();
									 newList.push(item);
								 }
								 list = newList; 
								 anim = requestAnimationFrame(animation);
							 };
							 animation();
						 } else {
							 console.log('No animate context');
						 }
						 return this;
		    },
			stop: function(){
					  cancelAnimationFrame(anim);
					  return this;
		    },*/
			addSprite: function(sprite){
						   list.push(sprite);
						   sprite.isRemoveAnim = false;
						   len++;
						   return this;
		    },
			deleteSprite: function(sprite){
							  sprite.isRemoveAnim = true; 
							  collision.deleteSprite(this);
							  len--;
							  return this;
		    }
		};
})();

/*
 * Vector for 2D graphic
 *
 * return an object width method below:
 * {
 * 		x:
 * 		y:
 * 		scale:
 * 		add:
 * 		sub:
 * 		negate:
 * 		length:
 * 		lengthSquared:
 * 		normalize:
 * 		rotate:
 * 		toString:
 * }
 * */
/*var vector = function(x, y){
	return {
		vx: x,
		vy: y,
		scale: function(scale){
			this.vx *= scale;
			this.vy *= scale;
		},
  		add: function(vec){
				 this.vx += vec.vx;
				 this.vy += vec.vy;
	    },
  		sub: function(vec){
				 this.vx -= vec.vx;
				 this.vy -= vec.vy;
		},
  		negate: function(){
					this.vx = -this.vx;
					this.vy = -this.vy;
		},
  		length: function(){
					var vx = this.vx,
						vy = this.vy;
					return Math.sqrt(vx * vx + vy * vy);
		},
  		lengthSquared: function(){
					var vx = this.vx,
						vy = this.vy;
					return vx * vx + vy * vy;  
	    },
  		normalize: function(){
					   var len = this.length();
					   if(len) {
						   this.vx /= len;
						   this.vy /= len;
					   }
					   return len;
	    },
  		rotate: function(angle){
					var vx = this.vx,
						vy = this.vy,
						cosVal = Math.cos(angle),
						sinVal = Math.sin(angle);
					this.vx = vx * cosVal - vy * sinVal; 
					this.vy = vx * sinVal - vy * cosVal; 
		},
  		toString: function(){
					  return '(' + this.vx.toFixed(3) + ',' + this.vy.toFixed(3) + ')';
	    }
	};
};*/


/*
 * 2D graphic's collision dectect and reflection
 * return an object width methods below: 
 * {
 * 		collideAll: 			     // 向动画队列中添加碰撞检测，每次执行动画，都检测碰撞检测队列的所有元素
 *		addMap(type1, type2, callback( sprite1, sprite2 )):
 *									 // 增加碰撞类型映射，如果碰撞的两个sprite.type对应了type1和type2，则执行回调函数，
 *									 // 否则则执行各自的碰撞函数sprite.collide()
 *		deleteMap(type):			 // 从映射中删除
 *		addSprite(sprite):			 // 向检测队列中增加元素
 *		deleteSprite(sprite):		 // 从检测队列中删除元素
 *		stop:						 // 把碰撞检测从动画队列中删除，即不再做任何碰撞检测
 *		isCollide(sprite1, sprite2): // 检测两个是否相撞
 * }
 *
 * */
/*var collision = (function(){
	var sprites = [],
		maps = [],
		len = 0,
		collide = {}; 
	return {
		collideAll: function(){
						collide.move = function(){
							var sp1, 
								sp2,
								newSprites = [];
							for(var i = 0, l = sprites.length; i < l; i++){
								sp1 = sprites[i];
								if(sp1.isRemoveCollision) {
									continue;
								}
								newSprites.push(sp1);
								for(var j = i + 1; j < l; j++){
									sp2 = sprites[j];
									if(collision.isCollide(sp1, sp2)) {
										if(maps[sp1.type]) {
											var map = maps[sp1.type];
											if(map.type == sp2.type) {
												map.collide(sp1, sp2);
											}
										} else {
											sp1.collide();
											sp2.collide();
										}
									}
								}
							}
							sprites = newSprites; 
						}
						animate.addSprite(collide);
		},
		addMap: function(type1, type2, collide){
				  maps[type1] = {
					  type: type2,
				  	  collide: collide
				  };
	    },
		deleteMap: function(type){
					   if(maps[type]) {
						   maps[type] = {
							   type: '',
							   collide: function(){}
						   };
					   }
	    },
		addSprite: function(sprite){
					   sprite.isRemoveCollision = false;
					   sprites.push(sprite);
					   len++;
	    },
		deleteSprite: function(sprite){
					   sprites.isRemoveCollision = true;
					   len--;
	    },
		stop: function(){
				  animate.deleteSprite(collide);
	    },
		isCollide: function(sprite1, sprite2){
			var vec = vector(0, 0),
				dist,
				radius1 = sprite1.radius,
				radius2 = sprite2.radius;
			vec.vx = (sprite2.x + radius2 )- (sprite1.x + radius1); 
			vec.vy = (sprite2.y + radius2 )- (sprite1.y + radius1); 
			dist = vec.length();

			if(dist < ( sprite1.radius + sprite2.radius )) {
				// if is colliding, clear the repeated part
				vec.normalize();
				vec.scale(sprite1.radius + sprite2.radius - dist);
				vec.negate();
				sprite1.x += vec.vx;
				sprite1.y += vec.vy;
				return true;
			}
			return false;
		}
	};
})();*/

// Make two sprites bounce from each other 
/*var bounce = function(sp1, sp2){
	var colnAngle = Math.atan2(sp1.y - sp2.y, sp1.x - sp2.x),
		length1 = sp1.vector.length(),
		length2 = sp2.vector.length(),
		dirAngle1 = Math.atan2(sp1.vector.vy,sp1.vector.vx),
		dirAngle2 = Math.atan2(sp2.vector.vy,sp2.vector.vx), 
		newVX1 = length1 * Math.cos(dirAngle1 - colnAngle),
		newVX2 = length2 * Math.cos(dirAngle2 - colnAngle);
	sp1.vector.vy = length1 * Math.sin(dirAngle1 - colnAngle) * 0.9;
	sp2.vector.vy = length2 * Math.sin(dirAngle2 - colnAngle) * 0.9;
	sp1.vector.vx = ((sp1.mass - sp2.mass) * newVX1 + (2 * sp2.mass) * newVX2) / (sp1.mass + sp2.mass) * 0.9;
	sp2.vector.vx = ((sp2.mass - sp1.mass) * newVX2 + (2 * sp1.mass) * newVX1) / (sp1.mass + sp2.mass) * 0.9;
	sp1.vector.rotate(colnAngle);
	sp2.vector.rotate(colnAngle);
};*/
