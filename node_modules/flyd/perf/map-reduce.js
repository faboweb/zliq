var flyd = require('../flyd.js');

var s = flyd.stream(0);
var s2 = s.map(noop);

function noop() { };

for (n = 0; n < 20000000; ++n) {
  s(n);
}
