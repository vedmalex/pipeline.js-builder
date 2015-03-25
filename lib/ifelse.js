var promise = require('mpromise');
var pipeline = require('pipeline.js');
var Stage = pipeline.Stage;
var schema = require('js-schema');
var util = require('util');
var Base = require('./base.js');

var validate = schema({
	condition: [Function],
	success: [Function, Stage, Object],
	failed: [Function, Stage, Object]
});

function fIfElse(condition) {
	this.cfg = {};
	this.if(condition);
}

util.inherits(fIfElse, Base);

fIfElse.prototype.validate = function() {
	fIfElse.super.validate.apply(this);
	var valid = validate(this.cfg);
	if (!valid) {
		throw new Error(validate.errors(this.cfg));
	}
};

fIfElse.prototype.build = function() {
	if(this.cfg.success instanceof Base) this.cfg.success = this.cfg.success.build();
	if(this.cfg.failed instanceof Base) this.cfg.failed = this.cfg.failed.build();
	return new pipeline.IfElse(this.cfg);
};

fIfElse.prototype.if = function(fn) {
	this.cfg.condition = fn;
	return this;
};

fIfElse.prototype.then = function(fn) {
	this.cfg.success = fn;
	return this;
};

fIfElse.prototype.else = function(fn) {
	this.cfg.failed = fn;
	return this;
};

exports.If = function(condition) {
	return new IfElse(condition);
};