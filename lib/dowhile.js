var promise = require('mpromise');
var pipeline = require('pipeline.js');
var Stage = pipeline.Stage;
var schema = require('js-schema');
var util = require('util');
var Base = require('./base.js');
var fStage = require('./stage.js').fStage;
var cfg = require('./cfg.js');

var validate = schema({
	stage: [Stage],
	split: [null, Function],
	reachEnd: [null, Function]
});

function fDoWhile(stage) {
	Base.apply(this);
	this.stage(stage);
}

util.inherits(fDoWhile, Base);

fDoWhile.prototype.isValid = function() {
	fDoWhile.super_.prototype.isValid.apply(this);
	var valid = validate(this.cfg);
	if (!valid) {
		throw new Error(JSON.stringify(validate.errors(this.cfg)));
	}
};

fDoWhile.prototype.build = function() {
	if (this.cfg.stage instanceof Base) this.cfg.stage = this.cfg.stage.build();
	this.isValid();
	return new pipeline.DoWhile(this.cfg.clone());
};

fDoWhile.prototype.stage = function(_fn) {
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

fDoWhile.prototype.split = function(fn) {
	this.cfg.split = fn;
	return this;
};

fDoWhile.prototype.reachEnd = function(fn) {
	this.cfg.reachEnd = fn;
	return this;
};

exports.fDoWhile = fDoWhile;

exports.DoWhile = function(stage) {
	return new fDoWhile(stage);
};