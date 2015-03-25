var promise = require('mpromise');
var pipeline = require('pipeline.js');
var Stage = pipeline.Stage;
var schema = require('js-schema');
var util = require('util');
var Base = require('./base.js');

var validate = schema({
	stages: Array.of([Function, Stage, Object])
});

function fPipeline(stage) {
	this.cfg = {};
	this.stage(stage);
}

util.inherits(fPipeline, Base);

fPipeline.prototype.validate = function() {
	fPipeline.super.validate.apply(this);
	var valid = validate(this.cfg);
	if (!valid) {
		throw new Error(validate.errors(this.cfg));
	}
};

fPipeline.prototype.build = function() {
	this.cfg.stages = this.cfg.stages.map(function(st) {
		if (st instanceof Base)
			return st.build();
	}).filter(function(st) {
		return st;
	});
	return new pipeline.Pipeline(this.cfg);
};

fPipeline.prototype.stage = function(fn) {
	if (fn) {
		if (!this.cfg.stages) this.cfg.stages = [];
		this.cfg.stages = this.cfg.stages.concat(fn);
	}
	return this;
};

fPipeline.prototype.then = function(fn) {
	this.cfg.stages = this.cfg.stages.concat(fn);
	return this;
};

exports.Pipeline = fPipeline;