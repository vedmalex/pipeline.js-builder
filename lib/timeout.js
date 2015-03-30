var promise = require('mpromise');
var pipeline = require('pipeline.js');
var Stage = pipeline.Stage;
var schema = require('js-schema');
var util = require('util');
var Base = require('./base.js');
var fStage = require('./stage.js').fStage;

var validate = schema({
	stage: [Stage],
	timeout: [null, Number, Function],
	overdue: [Stage]
});

function fTimeout(stage) {
	Base.apply(this);
	this.stage(stage);
}

util.inherits(fTimeout, Base);

fTimeout.prototype.isValid = function() {
	fTimeout.super_.prototype.isValid.apply(this);
	var valid = validate(this.cfg);
	if (!valid) {
		throw new Error(JSON.stringify(validate.errors(this.cfg)));
	}
};

fTimeout.prototype.build = function() {
	if (this.cfg.stage instanceof Base) this.cfg.stage = this.cfg.stage.build();
	if (this.cfg.overdue instanceof Base) this.cfg.overdue = this.cfg.overdue.build();
	this.isValid();
	return new pipeline.Timeout(this.cfg);
};

fTimeout.prototype.stage = function(_fn) {
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

fTimeout.prototype.timeout = function(inp) {
	this.cfg.timeout = inp;
	return this;
};

fTimeout.prototype.overdue = function(_fn) {
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
		this.cfg.overdue = fn;
	}
	return this;
};

exports.fTimeout = fTimeout;

exports.Timeout = function(st) {
	return new fTimeout(st);
};