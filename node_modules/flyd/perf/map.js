var Benchmark = require('benchmark');
var oflyd = require('../oldflyd.js');
var flyd = require('../flyd.js');

global.flyd = flyd;
global.oflyd = oflyd;

var suite = new Benchmark.Suite();

suite.add('map', {
  setup: function() {
    var s = flyd.stream();
    var s2 = flyd.map(function() { }, s);
  },
  fn: function() {
    s(1);
  },
}).add('old map', {
  setup: function() {
    var s = oflyd.stream();
    var s2 = oflyd.map(function() { }, s);
  },
  fn: function() {
    s(1);
  },
})
// add listeners
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
// run async
.run({async: true});
