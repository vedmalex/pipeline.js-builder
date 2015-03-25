var promise = require('mpromise');
var pipeline = require('pipeline.js');
var Stage = pipeline.Stage;
var schema = require('js-schema');
var util = require('util');
var Base = require('./base.js');

var validate = schema({
	stage: [Function, Stage, Object],
	split: [null, Function],
	combine: [null, Function]
});

function fSequential(stage) {
	this.cfg = {};
	this.stage(stage);
}

util.inherits(fSequential, Base);

fSequential.prototype.validate = function() {
	fSequential.super.validate.apply(this);
	var valid = validate(this.cfg);
	if (!valid) {
		throw new Error(validate.errors(this.cfg));
	}
};

fSequential.prototype.build = function() {
	if(this.cfg.stage instanceof Base) this.cfg.stage = this.cfg.stage.build();
	return new pipeline.Stage(this.cfg);
};

fSequential.prototype.stage = function(fn) {
	this.cfg.stage = fn;
	return this;
};

fSequential.prototype.split = function(fn) {
	this.cfg.split = fn;
	return this;
};

fSequential.prototype.combine = function(fn) {
	this.cfg.combine = fn;
	return this;
};

exports.Sequential = function(stage) {
	return new fSequential(stage);
};