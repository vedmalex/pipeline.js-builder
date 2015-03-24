var q = require('q');

var pipeline = require('pipeline.js');
var Stage = require('pipeline.js').Stage;
var Context = require('pipeline.js').Context;
var Pipeline = require('pipeline.js').Pipeline;
var Sequential = require('pipeline.js').Sequential;
var Parallel = require('pipeline.js').Parallel;
var IfElse = require('pipeline.js').IfElse;
var Timeout = require('pipeline.js').Timeout;
var Wrap = require('pipeline.js').Wrap;
var RetryOnError = require('pipeline.js').RetryOnError;
var MultiWaySwitch = require('pipeline.js').MultiWaySwitch;
var DoWhile = require('pipeline.js').DoWhile;
var Empty = require('pipeline.js').Empty;

var alias = {
	Stage: 'Stage',
	Stg: 'Stage',
	Ctx: 'Context',
	Pipeline: 'Pipeline',
	Pipe: 'Pipeline',
	Sequential: 'Sequential',
	Seq: 'Sequential',
	Parallel: 'Parallel',
	Par: 'Parallel',
	IfElse: 'IfElse',
	Timeout: 'Timeout',
	Wrap: 'Wrap',
	RetryOnError: 'RetryOnError',
	Retry: 'RetryOnError',
	MultiWaySwitch: 'MultiWaySwitch',
	MWS: 'MultiWaySwitch',
	DoWhile: 'DoWhile',
	While: 'DoWhile',
	Empty: 'Empty',
	E: 'Empty'
};

function init() {
	var keys = Object.keys(alias);
	var sType;
	for (var i = 0, len = keys.length; i < len; i++) {
		sType = keys[i];
		exports[sType] = (
			function(sType) {
				return function() {
					return new fluentStage(alias[sType]);
				};
			})(sType);
	}
}

Stage.prototype.toFunction = function() {
	var self = this;
	return function(ctx, callback) {
		self.execute(ctx, callback);
	};
};

// продумать, скорее контекст чем stage должен биндиться...
Stage.prototype.toPromise = function() {
	var self = this;
	return function(ctx, callback) {
		self.execute(ctx, callback);
	};
};

function fluentStage(sType) {
	this._name = sType;
}

fluentStage.prototype.build = function() {
	return new pipeline[this._name](this);
};

fluentStage.prototype.stage = function(fn) {
	this.run = fn;
	return this;
};

fluentStage.prototype.rescue = function(fn) {
	this.rescue = fn;
	return this;
};

fluentStage.prototype.name = function(name) {
	this.name = name;
	return this;
};

fluentStage.prototype.validate = function(fn) {
	this.validate = fn;
	return this;
};

fluentStage.prototype.schema = function(obj) {
	this.schema = obj;
	return this;
};

fluentStage.prototype.ensure = function(fn) {
	this.ensure = fn;
	return this;
};

fluentStage.prototype.success = function(fn) {
	this.success = fn;
	return this;
};

fluentStage.prototype.failed = function(fn) {
	this.failed = fn;
	return this;
};

fluentStage.prototype.condition = function(fn) {
	this.condition = fn;
	return this;
};

fluentStage.prototype.split = function(fn) {
	this.split = fn;
	return this;
};

fluentStage.prototype.combine = function(fn) {
	this.combine = fn;
	return this;
};

fluentStage.prototype.reachEnd = function(fn) {
	this.reachEnd = fn;
	return this;
};

fluentStage.prototype.case = function(obj) {
	if (!this.cases) this.cases = [];
	this.cases.push(obj);
	return this;
};

fluentStage.prototype.evaluate = function(obj) {
	this.evaluate = fn;
	return this;
};

fluentStage.prototype.stages = function(obj) {
	if (!this.cases) this.stages = [];
	this.cases.push(obj);
	return this;
};

fluentStage.prototype.timeout = function(ms) {
	this.timoeut = ms;
	return this;
};

fluentStage.prototype.overdue = function(fn) {
	this.overdue = fn;
	return this;
};

fluentStage.prototype.prepare = function(fn) {
	this.prepare = fn;
	return this;
};

fluentStage.prototype.finalize = function(fn) {
	this.finalize = fn;
	return this;
};

init();