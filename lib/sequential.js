var promise = require('mpromise');
var pipeline = require('pipeline.js');
var Stage = pipeline.Stage;
var schema = require('js-schema');
var util = require('util');
var Base = require('./base.js');
var fStage = require('./stage.js').fStage;

var validate = schema({
	stage: [Stage],
	split: [null, Function],
	combine: [null, Function]
});

function fSequential(stage) {
	this.cfg = {};
	this.stage(stage);
}

util.inherits(fSequential, Base);

fSequential.prototype.isValid = function() {
	fSequential.super_.prototype.isValid.apply(this);
	var valid = validate(this.cfg);
	if (!valid) {
		throw new Error(JSON.stringify(validate.errors(this.cfg)));
	}
};

fSequential.prototype.build = function() {
	if (this.cfg.stage instanceof Base) this.cfg.stage = this.cfg.stage.build();
	this.isValid();
	return new pipeline.Sequential(this.cfg);
};

fSequential.prototype.stage = function(_fn) {
	if (_fn) {
		var fn = _fn;
		if (!(_fn instanceof Base)) {
			if (_fn instanceof Function) {
				fn = new fStage(_fn);
			} else if (_fn instanceof Object) {
				fn = new fStage();
				fn.cfg = _fn;
			} else if (_fn instanceof Stage) {
				fn = _fn;
			} else {
				throw new Error('unsupported Stage type');
			}
		}
		this.cfg.stage = fn;
	}
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

exports.fSequential = fSequential;

exports.Sequential = function(stage) {
	return new fSequential(stage);
};