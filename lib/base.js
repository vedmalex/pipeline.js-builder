var promise = require('mpromise');
var pipeline = require('pipeline.js');
var Stage = pipeline.Stage;
var schema = require('js-schema');

var validate = schema({
	name: [null, String],
	ensure: [null, Function],
	validate: [null, Function],
	schema: [null, Function],
	rescue: [null, Function],
});

function fBase(stage) {
	this.cfg = {};
	this.stage(stage);
}

fBase.prototype.validate = function() {
	var valid = validate(this.cfg);
	if (!valid) {
		throw new Error(validate.errors(this.cfg));
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

exports.Base = fBase;