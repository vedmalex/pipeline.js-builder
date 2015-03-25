var promise = require('mpromise');
var pipeline = require('pipeline.js');
var Stage = pipeline.Stage;
var schema = require('js-schema');
var util = require('util');
var Base = require('./base.js');

var validate = schema({
	stage: [Function, Stage, Object],
	split: [null, Function],
	reachEnd: [null, Function]
});

function fDoWhile(stage) {
	this.cfg = {};
	this.stage(stage);
}

util.inherits(fDoWhile, Base);

fDoWhile.prototype.validate = function() {
	fDoWhile.super.validate.apply(this);
	var valid = validate(this.cfg);
	if (!valid) {
		throw new Error(validate.errors(this.cfg));
	}
};

fDoWhile.prototype.build = function() {
	if(this.cfg.stage instanceof Base) this.cfg.stage = this.cfg.stage.build();
	return new pipeline.DoWhile(this.cfg);
};
fDoWhile.prototype.stage = function(fn) {
	this.cfg.stage = fn;
	return this;
};

fDoWhile.prototype.split = function(fn) {
	this.cfg.split = fn;
	return this;
};

fDoWhile.prototype.reachEnd = function(fn) {
	this.cfg.reachEnd = fn;
	return this;
};

exports.Do = function(stage) {
	return new fDoWhile(stage);
};