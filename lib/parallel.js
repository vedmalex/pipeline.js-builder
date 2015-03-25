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

function fParallel(stage) {
	this.cfg = {};
	this.stage(stage);
}

util.inherits(fParallel, Base);

fParallel.prototype.validate = function() {
	fParallel.super.validate.apply(this);
	var valid = validate(this.cfg);
	if (!valid) {
		throw new Error(validate.errors(this.cfg));
	}
};

fParallel.prototype.build = function() {
	if(this.cfg.stage instanceof Base) this.cfg.stage = this.cfg.stage.build();
	return new pipeline.Parallel(this.cfg);
};

fParallel.prototype.stage = function(fn) {
	this.cfg.stage = fn;
	return this;
};

fParallel.prototype.split = function(fn) {
	this.cfg.split = fn;
	return this;
};

fParallel.prototype.combine = function(fn) {
	this.cfg.combine = fn;
	return this;
};

exports.Parallel = function(stage) {
	return new fParallel(stage);
};