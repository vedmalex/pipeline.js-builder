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
	prepare: [null, Function],
	finalize: [null, Function]
});

function fWrap(stage) {
	Base.apply(this);
	this.stage(stage);
}

util.inherits(fWrap, Base);

fWrap.prototype.isValid = function() {
	fWrap.super_.prototype.isValid.apply(this);
	var valid = validate(this.cfg);
	if (!valid) {
		throw new Error(JSON.stringify(validate.errors(this.cfg)));
	}
};

fWrap.prototype.build = function() {
	if(this.cfg.stage instanceof Base) this.cfg.stage = this.cfg.stage.build();
	this.isValid();
	return new pipeline.Wrap(this.cfg.clone());
};

fWrap.prototype.stage = function(_fn) {
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

fWrap.prototype.prepare = function(fn) {
	this.cfg.prepare = fn;
	return this;
};

fWrap.prototype.finalize = function(fn) {
	this.cfg.finalize = fn;
	return this;
};

exports.fWrap = fWrap;

exports.Wrap = function(stage) {
	return new fWrap(stage);
};