var promise = require('mpromise');
var pipeline = require('pipeline.js');
var Stage = pipeline.Stage;
var schema = require('js-schema');
var util = require('util');
var Base = require('./base.js');
var fStage = require('./stage.js').fStage;

var validate = schema({
	stage: [Stage],
	retry: [null, Number, Function]
});

function fRetryOnError(stage) {
	this.cfg = {};
	this.stage(stage);
}

util.inherits(fRetryOnError, Base);

fRetryOnError.prototype.isValid = function() {
	fRetryOnError.super_.prototype.isValid.apply(this);
	var valid = validate(this.cfg);
	if (!valid) {
		throw new Error(JSON.stringify(validate.errors(this.cfg)));
	}
};

fRetryOnError.prototype.build = function() {
	if(this.cfg.stage instanceof Base) this.cfg.stage = this.cfg.stage.build();
	this.isValid();
	return new pipeline.RetryOnError(this.cfg);
};

fRetryOnError.prototype.stage = function(_fn) {
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

fRetryOnError.prototype.retry = function(fn) {
	this.cfg.retry = fn;
	return this;
};

exports.fRetryOnError = fRetryOnError;

exports.RetryOnError = function(stage) {
	return new fRetryOnError(stage);
};