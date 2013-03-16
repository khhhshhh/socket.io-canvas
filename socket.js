var io = require('socket.io')
,	animator = require('./animation/animator.js')
,	sprite = require('./animation/sprite.js');

module.exports = function(server) {
	io = io.listen(server); 
};
