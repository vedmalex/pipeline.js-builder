var promise = require('mpromise');
var pipeline = require('pipeline.js');
var Stage = pipeline.Stage;
var schema = require('js-schema');
var util = require('util');
var Base = require('./base.js');

var validate = schema({
	timeout: [null, Number],
	stage: [Function, Stage, Object],
	overdue: [null, Function]
});

function fTimeout(ms) {
	this.cfg = {};
	this.timeout(ms);
}

util.inherits(fTimeout, Base);

fTimeout.prototype.validate = function() {
	fTimeout.super.validate.apply(this);
	var valid = validate(this.cfg);
	if (!valid) {
		throw new Error(validate.errors(this.cfg));
	}
};

fTimeout.prototype.build = function() {
	if(this.cfg.stage instanceof Base) this.cfg.stage = this.cfg.stage.build();
	return new pipeline.Timeout(this.cfg);
};

fTimeout.prototype.stage = function(fn) {
	this.cfg.stage = fn;
	return this;
};

fTimeout.prototype.timeout = function(inp) {
	this.cfg.timeout = inp;
	return this;
};

fTimeout.prototype.overdue = function(fn) {
	this.cfg.overdue = fn;
	return this;
};

exports.Timeout = function(ms) {
	return new fTimeout(ms);
};