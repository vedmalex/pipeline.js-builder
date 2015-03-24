var util = require('util');
var assert = require('assert');
var builder = require('../index.js');

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

describe('it works', function() {
	it('create stage', function(done) {
		var stage = builder.Stage().stage(function(ctx) {
				return;
			})
			.validate()
			.schema()
			.build();
		assert(stage instanceof Stage);
		done();
	});

	it('create stage throws', function(done) {
		assert.throws(function() {
			var stage = builder.Stage().stage(function(ctx) {
					return;
				})
				.validate()
				.schema()
				.build();
			stage.stage();
		});
		done();
	});

	it('create stage toFunction not throws', function(done) {
		var stage = builder.Stage().stage(function(ctx) {
				return;
			})
			.validate()
			.schema()
			.build()
			.toFunction();
		assert(stage instanceof Function);
		done();
	});
});