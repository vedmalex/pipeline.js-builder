var promise = require('mpromise');
var pipeline = require('pipeline.js');
var Stage = pipeline.Stage;
var schema = require('js-schema');

var validate = schema({
	name: [null, String],
	ensure: [null, Function],
	validate: [null, Function],
	schema: [null, Object],
	rescue: [null, Function],
});

function cfg(){}
cfg.prototype.rescue = undefined;
cfg.prototype.name = undefined;
cfg.prototype.validate = undefined;
cfg.prototype.schema = undefined;
cfg.prototype.ensure = undefined;
cfg.prototype.stage = undefined;
cfg.prototype.split = undefined;
cfg.prototype.combine = undefined;
cfg.prototype.success = undefined;
cfg.prototype.failed = undefined;
cfg.prototype.cases = undefined;
cfg.prototype.stages = undefined;
cfg.prototype.retry = undefined;
cfg.prototype.overdue = undefined;
cfg.prototype.prepare = undefined;
cfg.prototype.finalize = undefined;
cfg.prototype.timeout = undefined;

function fBase(stage) {
	this.cfg = new cfg();
}

fBase.prototype.isValid = function() {
	var valid = validate(this.cfg);
	if (!valid) {
		throw new Error(JSON.stringify(validate.errors(this.cfg)));
	}
};

fBase.prototype.rescue = function(fn) {
	this.cfg.rescue = fn;
	return this;
};

fBase.prototype.name = function(name) {
	this.cfg.name = name;
	return this;
};

fBase.prototype.validate = function(fn) {
	this.cfg.validate = fn;
	this.isValid();
	return this;
};

fBase.prototype.schema = function(obj) {
	this.cfg.schema = obj;
	return this;
};

fBase.prototype.ensure = function(fn) {
	this.cfg.ensure = fn;
	return this;
};

module.exports = fBase;