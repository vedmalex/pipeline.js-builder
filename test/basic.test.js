var util = require('util');
var assert = require('assert');

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
var sb = require('../lib/index.js');

describe('Stage', function() {
	it('Stage inits Base', function(done) {

		var st = sb.Stage(function(err, ctx, done) {
				done();
			})
			.ensure(function(ctx) {
				return true;
			})
			.name('typeicalStage')
			.validate(function(ctx) {
				return true;
			})
			.schema({
				name: Number
			})
			.rescue(function() {
				return;
			});

		assert(st.cfg.name === 'typeicalStage');
		assert(st.cfg.schema);
		assert(st.cfg.ensure);
		assert(st.cfg.rescue);
		assert(st.cfg.validate);
		assert.throws(function() {
			var stg = st.build();
		});
		// assert(stg instanceof Stage);
		done();
	});
	it('Stage is built', function(done) {
		var st = sb.Stage(function(err, ctx, done) {
				done();
			})
			.ensure(function(ctx) {
				return true;
			})
			.name('typeicalStage')
			.schema({
				name: Number
			});
		var stg = st.build();
		assert(stg instanceof Stage);
		done();
	});
	it("not Throws on empty stages", function(done) {
		assert.doesNotThrow(function() {
			var pipe = sb.Stage()
				.stage(function() {})
		});

		done();
	});
	it("throws on empty stages", function(done) {
		assert.throws(function() {
			var pipe = sb.Stage()
				.stage(1)
		});

		done();
	});
});

describe('Pipeline', function() {
	it("Works inits", function(done) {
		var pipe = sb.Pipeline(function() {})
			.then(function() {})
			.then(new sb.fStage(function() {}))
			.then({
				run: function() {},
				schema: {}
			})
			.then(new Stage(function() {}));
		assert(pipe.cfg.stages);
		assert(pipe.cfg.stages.length === 5);
		done();
	});

	it("Built", function(done) {
		var pipe = sb.Pipeline(function() {})
			.then(function() {})
			.then(new sb.fStage(function() {}))
			.then({
				run: function() {},
				schema: {}
			})
			.then(new Stage(function() {}));

		assert(pipe.cfg.stages.length === 5);
		var p = pipe.build();
		assert(p instanceof Pipeline);
		assert(p.stages.every(function(st) {
			return st instanceof Stage;
		}));
		done();
	});

	it("not Throws on empty stages", function(done) {
		assert.doesNotThrow(function() {
			var pipe = sb.Pipeline()
				.then(function() {})
				.then()
				.then({
					run: function() {},
					schema: {}
				})
				.then(new Stage(function() {}));
			assert(pipe.cfg.stages.length === 3);
		});

		done();
	});
	it("Throws on wrong stages", function(done) {
		assert.throws(function() {
			var pipe = sb.Pipeline(false)
				.then(function() {})
				.then(1)
				.then({
					run: function() {},
					schema: {}
				})
				.then(new Stage(function() {}));
		});

		done();
	});
});

describe('Parallel', function(done) {
	it("inits", function(done) {
		var par = sb.Parallel(function() {})
			.split(function() {})
			.combine(function() {});
		assert(par.cfg.combine);
		assert(par.cfg.split);
		assert(par.cfg.stage);
		done();
	});
	it("Built", function(done) {
		var par = sb.Parallel(function() {})
			.split(function() {})
			.combine();
		var p = par.build();
		assert(p instanceof Parallel);
		done();
	});
	it("not throws on empty stage", function(done) {
		assert.doesNotThrow(function() {
			var par = sb.Parallel()
				.stage(function() {})
				.split(function() {})
				.combine();
			par.build();
		});
		done();
	});
	it("throws on wrong stage", function(done) {
		assert.throws(function() {
			var par = sb.Parallel()
				.stage(true)
				.split(function() {})
				.combine();
			par.build();
		});
		done();
	});
});

describe('Sequential', function(done) {
	it("inits", function(done) {
		var par = sb.Sequential(function() {})
			.split(function() {})
			.combine(function() {});
		assert(par.cfg.combine);
		assert(par.cfg.split);
		assert(par.cfg.stage);
		done();
	});
	it("Built", function(done) {
		var par = sb.Sequential(function() {})
			.split(function() {})
			.combine();
		var p = par.build();
		assert(p instanceof Sequential);
		done();
	});
	it("not throws on empty stage", function(done) {
		assert.doesNotThrow(function() {
			var par = sb.Sequential()
				.stage(function() {})
				.split(function() {})
				.combine();
			par.build();
		});
		done();
	});
	it("throws on wrong stage", function(done) {
		assert.throws(function() {
			var par = sb.Sequential()
				.stage(true)
				.split(function() {})
				.combine();
			par.build();
		});
		done();
	});
});

describe('RetryOnError', function(done) {
	it("inits", function(done) {
		var par = sb.RetryOnError(function() {})
			.retry(function() {});
		assert(par.cfg.stage);
		assert(par.cfg.retry);
		done();
	});
	it("Built", function(done) {
		var par = sb.RetryOnError(function() {})
			.retry(function() {});
		var p = par.build();
		assert(p instanceof RetryOnError);
		done();
	});
	it("not throws on empty stage", function(done) {
		assert.doesNotThrow(function() {
			var par = sb.RetryOnError()
				.stage(function() {})
				.retry(function() {});
			var p = par.build();
		});
		done();
	});
	it("throws on wrong stage", function(done) {
		assert.throws(function() {
			var par = sb.RetryOnError(function() {})
				.stage(1)
				.retry(function() {});
			var p = par.build();
		});
		done();
	});
});

describe('Timeout', function(done) {
	it("inits", function(done) {
		var par = sb.Timeout(function() {})
			.overdue(function() {})
			.timeout(function() {});
		assert(par.cfg.stage);
		assert(par.cfg.timeout);
		assert(par.cfg.overdue);
		done();
	});
	it("Built", function(done) {
		var par = sb.Timeout(function() {})
			.overdue(function() {})
			.timeout(10);
		var p = par.build();
		assert(p instanceof Timeout);

		par = sb.Timeout(function() {})
			.overdue(function() {})
			.timeout(function() {});
		p = par.build();

		done();
	});
	it("not throws on empty stage", function(done) {
		assert.doesNotThrow(function() {
			var par = sb.Timeout()
				.stage(function() {})
				.overdue(function() {})
				.timeout(10);
			par.build();
		});
		done();
	});
	it("throws on wrong stage", function(done) {
		assert.throws(function() {
			var par = sb.Timeout(function() {})
				.stage(1)
				.overdue(function() {})
				.timeout(10);
			par.build();
		});
		done();
	});
});

describe('Wrap', function(done) {
	it("inits", function(done) {
		var par = sb.Wrap(function() {})
			.prepare(function() {})
			.finalize(function() {});
		assert(par.cfg.stage);
		assert(par.cfg.prepare);
		assert(par.cfg.finalize);
		done();
	});
	it("Built", function(done) {
		var par = sb.Wrap(function() {})
			.prepare(function() {})
			.finalize(function() {});
		var p = par.build();
		assert(p instanceof Wrap);
		done();
	});
	it("not throws on empty stage", function(done) {
		assert.doesNotThrow(function() {
			var par = sb.Wrap()
				.stage(function() {})
				.prepare(function() {})
				.finalize(function() {});
			par.build();
		});
		done();
	});
	it("throws on wrong stage", function(done) {
		assert.throws(function() {
			var par = sb.Wrap()
				.stage(1)
				.prepare(function() {})
				.finalize(function() {});
			par.build();
		});
		done();
	});
});

describe('DoWhile', function(done) {
	it("inits", function(done) {
		var par = sb.DoWhile(function() {})
			.split(function() {})
			.reachEnd(function() {});
		assert(par.cfg.stage);
		assert(par.cfg.split);
		assert(par.cfg.reachEnd);
		done();
	});
	it("Built", function(done) {
		var par = sb.DoWhile(function() {})
			.split(function() {})
			.reachEnd(function() {});
		var p = par.build();
		assert(p instanceof DoWhile);
		done();
	});
	it("not throws on empty stage", function(done) {
		assert.doesNotThrow(function() {
			var par = sb.DoWhile()
				.stage(function() {})
				.split(function() {})
				.reachEnd(function() {});
			par.build();
		});
		done();
	});
	it("throws on wrong stage", function(done) {
		assert.throws(function() {
			var par = sb.DoWhile()
				.stage(1)
				.split(function() {})
				.reachEnd(function() {});
			par.build();
		});
		done();
	});
});

describe('IfElse', function(done) {
	it("inits", function(done) {
		var par = sb.If(function() {})
			.then(function() {})
			.else(function() {});
		assert(par.cfg.condition);
		assert(par.cfg.success);
		assert(par.cfg.failed);
		done();
	});
	it("Built", function(done) {
		var par = sb.If(function() {})
			.then(function() {})
			.else();
		var p = par.build();
		assert(p instanceof IfElse);
		done();
	});
	it("not throws on empty stage", function(done) {
		assert.doesNotThrow(function() {
			var par = sb.If(function(){})
				.then()
				.then(function() {})
				.else(function() {});
			par.build();
		});
		done();
	});
	it("throws on wrong stage", function(done) {
		assert.throws(function() {
			var par = sb.If(1)
				.then(function() {})
				.else(function() {});
			par.build();
		});
		done();
	});
});

describe('MultiWaySwitch', function(done) {
	it('intis', function(done){
		var sw = sb.MWS()
			.name('MWS')
			.combine(function(){})
			.split(function(){})
			.case(sb.MWCase())
			.case({stage:new Stage})
			.case(function(){})
			.case();
		assert(sw.cfg.name);
		assert(sw.cfg.combine);
		assert(sw.cfg.split);
		assert(sw.cfg.cases.length === 3);
		done();
	});
	it('Built', function(done){
		var sw = sb.MWS()
			.name('MWS')
			.combine(function(){})
			.split(function(){})
			.case(sb.MWCase())
			.case({stage:new Stage})
			.case(function(){})
			.case();
		var swb = sw.build();
		assert(swb instanceof MultiWaySwitch);
		assert(swb.cases.length === 3);
		done();
	});
});