var promise = require('mpromise');
var pipeline = require('pipeline.js');
var Stage = pipeline.Stage;
var schema = require('js-schema');
var util = require('util');
var Base = require('./base.js');
var fStage = require('./stage.js').fStage;
var cfg = require('./cfg.js');

var validateCase = schema({
	evaluate: [null, Boolean, Function],
	stage: [Function, Stage, Object],
	split: [null, Function],
	combine: [null, Function]
});

var validate = schema({
	cases: Array.of[validateCase],
	split: [null, Function],
	combine: [null, Function]
});

function fMultiWaySwitch() {
	Base.apply(this);
}

util.inherits(fMultiWaySwitch, Base);

fMultiWaySwitch.prototype.isValid = function() {
	fMultiWaySwitch.super_.prototype.isValid.apply(this);
	var valid = validate(this.cfg);
	if (!valid) {
		throw new Error(JSON.stringify(validate.errors(this.cfg)));
	}
};

fMultiWaySwitch.prototype.build = function() {
	this.cfg.cases = this.cfg.cases.map(function(cs) {
		if (cs instanceof fCase)
			return cs.build();
	}).filter(function(cs) {
		return cs;
	});
	this.isValid();
	return new pipeline.MultiWaySwitch(this.cfg.clone());
};

fMultiWaySwitch.prototype.case = function(_cs) {
	if (_cs) {
		var cs = _cs;
		if (!(_cs instanceof fCase)) {
			if (_cs instanceof Function) {
				cs = new fCase(_cs);
			} else if (_cs instanceof Object) {
				cs = new fCase();
				cs.cfg = new cfg(_cs);
			} else if (_cs instanceof Stage) {
				cs = _cs;
			} else {
				throw new Error('unsupported Stage type');
			}
		}
		if (!this.cfg.cases) this.cfg.cases = [];
		this.cfg.cases = this.cfg.cases.concat(cs);
	}
	return this;
};

fMultiWaySwitch.prototype.split = function(fn) {
	this.cfg.split = fn;
	return this;
};

fMultiWaySwitch.prototype.combine = function(fn) {
	this.cfg.combine = fn;
	return this;
};

exports.fMultiWaySwitch = fMultiWaySwitch;

exports.MWS = function() {
	return new fMultiWaySwitch();
};

function fCase(stage) {
	this.cfg = new cfg();
	this.stage(stage);
}

fCase.prototype.evaluate = function(fn) {
	this.cfg.evaluate = fn;
	return this;
};

fCase.prototype.stage = function(_fn) {
	if (_fn) {
		var fn = _fn;
		if (!(_fn instanceof Base)) {
			if (_fn instanceof Function) {
				fn = new fStage(_fn);
			} else if (_fn instanceof Object) {
				fn = new fStage();
				fn.cfg = new cfg(_fn);
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

fCase.prototype.split = function(fn) {
	this.cfg.split = fn;
	return this;
};

fCase.prototype.combine = function(fn) {
	this.cfg.combine = fn;
	return this;
};

fCase.prototype.build = function(fn) {
	if (this.cfg.stage && this.cfg.stage instanceof Base) {
		this.cfg.stage = this.cfg.stage.build();
	}
	return this.cfg.clone();
};

exports.MWCase = function(fn) {
	return new fCase(fn);
};

exports.fCase = fCase;