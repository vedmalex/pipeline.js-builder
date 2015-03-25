var promise = require('mpromise');
var pipeline = require('pipeline.js');
var Stage = pipeline.Stage;
var schema = require('js-schema');
var util = require('util');
var Base = require('./base.js');

var validate = schema({
	stage: [Function, Stage, Object],
	prepare: [null, Function],
	finalize: [null, Function]
});

function fWrap(stage) {
	this.cfg = {};
	this.stage(stage);
}

util.inherits(fWrap, Base);

fWrap.prototype.validate = function() {
	fWrap.super.validate.apply(this);
	var valid = validate(this.cfg);
	if (!valid) {
		throw new Error(validate.errors(this.cfg));
	}
};

fWrap.prototype.build = function() {
	if(this.cfg.stage instanceof Base) this.cfg.stage = this.cfg.stage.build();
	return new pipeline.Wrap(this.cfg);
};

fWrap.prototype.stage = function(fn) {
	this.cfg.stage = fn;
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

exports.Wrap = function(stage) {
	return new fWrap(stage);
};