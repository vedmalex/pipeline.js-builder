var promise = require('mpromise');
var pipeline = require('pipeline.js');
var Stage = pipeline.Stage;
var schema = require('js-schema');
var util = require('util');
var Base = require('./base.js');

var validate = schema({
	stage: [Function, Stage, Object],
	retry: [null, Number, Function]
});

function fRetryOnError(stage) {
	this.cfg = {};
	this.stage(stage);
}

util.inherits(fRetryOnError, Base);

fRetryOnError.prototype.validate = function() {
	fRetryOnError.super.validate.apply(this);
	var valid = validate(this.cfg);
	if (!valid) {
		throw new Error(validate.errors(this.cfg));
	}
};

fRetryOnError.prototype.build = function() {
	if(this.cfg.stage instanceof Base) this.cfg.stage = this.cfg.stage.build();
	return new pipeline.RetryOnError(this.cfg);
};

fRetryOnError.prototype.stage = function(fn) {
	this.cfg.stage = fn;
	return this;
};

fRetryOnError.prototype.retry = function(fn) {
	this.cfg.retry = fn;
	return this;
};

exports.IfThrows = function(stage) {
	return new fRetryOnError(stage);
};