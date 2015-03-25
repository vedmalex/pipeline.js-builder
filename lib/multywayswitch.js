var promise = require('mpromise');
var pipeline = require('pipeline.js');
var Stage = pipeline.Stage;
var schema = require('js-schema');
var util = require('util');
var Base = require('./base.js');

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

function fMultiWaySwitch(cases) {
	this.cfg = {};
	this.cfg.cases = [];
}

util.inherits(fMultiWaySwitch, Base);

fMultiWaySwitch.prototype.validate = function() {
	fMultiWaySwitch.super.validate.apply(this);
	var valid = validate(this.cfg);
	if (!valid) {
		throw new Error(validate.errors(this.cfg));
	}
};

fMultiWaySwitch.prototype.build = function() {
	this.cfg.cases = this.cfg.cases.map(function(cs) {
		if (cs instanceof fCase)
			return cs.build();
	}).filter(function(cs) {
		return cs;
	});
	return new pipeline.MultiWaySwitch(this.cfg);
};

fMultiWaySwitch.prototype.case = function(fn) {
	if (fn) {
		if (!this.cfg.cases) this.cfg.cases = [];
		this.cfg.cases = this.cfg.cases.concat(fn);
	}
	return this;
};

exports.Switch = function(fn) {
	return new fMultiWaySwitch(fn);
};

function fCase(stage) {
	this.cfg = {};
	this.stage(stage);
}

fCase.prototype.evaluate = function(fn) {
	this.cfg.evaluate = fn;
	return this;
};

fCase.prototype.stage = function(fn) {
	this.cfg.stage = fn;
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
	return this.cfg;
};

exports.Case = function(fn) {
	return new fCase(fn);
};