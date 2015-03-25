var promise = require('mpromise');
var pipeline = require('pipeline.js');
var Stage = pipeline.Stage;
var schema = require('js-schema');
var util = require('util');
var Base = require('./base.js');

Stage.prototype.toFunction = function() {
	var self = this;
	return function(ctx, callback) {
		self.execute(ctx, callback);
	};
};

// продумать, скорее контекст чем stage должен биндиться...
Stage.prototype.toPromise = function(ctx, callback) {
	// so far promis has memory and it is not reenterable, we need to fix context.
	var self = this;
	var resPromise = new promise(callback);
	self.execute(ctx, function(err, ctx) {
		if (err) {
			resPromise.reject(err);
		} else {
			resPromise.fulfill(ctx);
		}
	});
	return resPromise;
};

var validate = schema({
	run: [Function]
});

function fStage(stage) {
	this.cfg = {};
	this.stage(stage);
}

util.inherits(fStage, Base);

fStage.prototype.validate = function() {
	fStage.super.validate.apply(this);
	var valid = validate(this.cfg);
	if (!valid) {
		throw new Error(validate.errors(this.cfg));
	}
};

fStage.prototype.build = function() {
	return new pipeline.Stage(this.cfg);
};

fStage.prototype.stage = function(fn) {
	this.cfg.run = fn;
	return this;
};

exports.Stage = function(fn) {
	return new fStage(fn);
};