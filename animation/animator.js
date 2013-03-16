/* animatior module used to control the animation functions */
var lastTime = 0;

var requestAnimationFrame = function(callback, element) {
	var currTime = new Date().getTime();
	var timeToCall = Math.max(0, 16 - (currTime - lastTime));
	var id = setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
	lastTime = currTime + timeToCall;
	return id;
};

var cancelAnimationFrame = function(id) {
	clearTimeout(id);
};

var toCalls = [];

module.exports = {
	id: null,
	start: function() {
		function animation() {
			var len = toCalls.length; 
			while(len--) {
				toCalls[len]();
			}
			this.id = requestAnimationFrame(animation);
		} 
		animation();
		return this;
	},
	stop: function() {
		cancelAnimationFrame(this.id);
		return this;
	},
	add: function(fn) {
		if(typeof fn == 'function') {
			toCalls.push(fn);
		}
		return this;
	},
	remove: function(fn) {
			var len = toCalls.length; 
			while(len--) {
				if(toCalls[len] == fn) {
					toCalls.splice(len, 1);
				}
			}
			return this;
	},
	requestAnimationFrame: requestAnimationFrame,
	cancelAnimationFrame: cancelAnimationFrame
};
