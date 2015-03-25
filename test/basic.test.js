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

	it('create MWSCase not throws when in builds', function(done) {
		var stage = builder.MWSCase().stage(function(ctx) {
				return;
			})
			.validate()
			.schema()
			.build();
		stage.validate();
		assert(stage);
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

var validate = require('validate.js');
describe('validators', function() {
	it('validate.js', function(done) {
		validate.validators.mutex = function(value, options, key, validatee) {
			if (Array.isArray(options)) {
				var result;
				var rec;
				for (var i = 0, len = options.length; i < len; i++) {
					rec = validatee[options[i]];
					result |= !!rec;
				}
				if (result)
					return "is in mutual exclusion with " + options.join(',');
			}
		};

		validate.validators.isFunction = function(value, options, key, validatee) {
			if (options.is && validate.isFunction(value)) return "must be a function";
			if (!options.is && !validate.isFunction(value)) return "must not be a function";
		};

		var tCase = {
			ensure: function() {},
			validate: function() {},
			// schema: {sone:1}
		};
		var contstraint = {
			ensure: {
				mutex: ['schema', 'validate'],
				isFunction: {
					is: true
				},
				presence: true
			},
			schema: {
				mutex: ['validate'],
				presence: true
			},
			validate: {
				mutex: ['schema'],
				presence: true,
				isFunction: {
					is: true
				}
			}
		};
		var t = validate(tCase, contstraint);
		assert(t);
		console.log(t);
		var t1 = validate({
			name: 1,

		}, contstraint);
		assert(!t1);

		done();
	});

	it('js-schema', function(done) {
		var schema = require('js-schema');
		var checker = schema({
			cfg: [{
				ensure: Function,
				schema: null,
				validate: null
			}, {
				ensure: null,
				schema: Function,
				validate: null
			}, {
				ensure: null,
				schema: null,
				validate: Function
			}]
		});
		var obj = {
			cfg: {
				schema: function() {},
				// ensure: function(),
				validate: function() {}
			}
		};
		var res = checker(obj);
		console.log(checker.errors(obj));
		res = checker({
			schema: Number,
			ensure: undefined,
			validate: function() {}
		});
		console.log(res);
		done();
	});
});