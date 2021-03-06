var promise = require('mpromise');
var pipeline = require('pipeline.js');
var Stage = pipeline.Stage;
var schema = require('js-schema');
var util = require('util');
var Base = require('./base.js');
var fStage = require('./stage.js').fStage;
var cfg = require('./cfg.js');

var validate = schema({
	condition: [Function],
	success: [Stage],
	failed: [null, Stage]
});

function fIfElse(condition) {
	Base.apply(this);
	this.if(condition);
}

util.inherits(fIfElse, Base);

fIfElse.prototype.isValid = function() {
	fIfElse.super_.prototype.isValid.apply(this);
	var valid = validate(this.cfg);
	if (!valid) {
		throw new Error(JSON.stringify(validate.errors(this.cfg)));
	}
};

fIfElse.prototype.build = function() {
	if (this.cfg.success instanceof Base) this.cfg.success = this.cfg.success.build();
	if (this.cfg.failed instanceof Base) this.cfg.failed = this.cfg.failed.build();
	this.isValid();
	return new pipeline.IfElse(this.cfg.clone());
};

fIfElse.prototype.if = function(fn) {
	this.cfg.condition = fn;
	return this;
};

fIfElse.prototype.then = function(_fn) {
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
		this.cfg.success = fn;
	}
	return this;
};

fIfElse.prototype.else = function(_fn) {
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
		this.cfg.failed = fn;
	}
	return this;
};

exports.fIfElse = fIfElse;

exports.If = function(condition) {
	return new fIfElse(condition);
};