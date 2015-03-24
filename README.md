# pipeline.js-builder
it is a fluent interface for building Stages

```javascript
	var builder = require('pipeline.js-builder');
	var st = builder
				.Stage()
				.stage(function(ctx){

				})
				.validate(function(){
					return true;
				})
				.build();//
		var st = builder
				.MWS()
				.split(function(ctx){
					return ...
				})
				.combine(function(){
					return ...
				})
				.case(builder.Stage()
						.stage()
						.split()
						.combine()
						.evaluate(true)
						.build()
				)
				.case(builder.Stage()
						.stage()
						.split()
						.combine()
						.evaluate(function(ctx){
							return ctx.ready;
						}).build()
				)
				.build();

```