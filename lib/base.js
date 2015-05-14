var promise = require('mpromise');
var pipeline = require('pipeline.js');
var Stage = pipeline.Stage;
var schema = require('js-schema');
var cfg = require('./cfg.js');

var validate = schema({
	name: [null, String],
	ensure: [null, Function],
	validate: [null, Function],
	schema: [null, Object],
	rescue: [null, Function],
});

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