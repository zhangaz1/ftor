"use strict";

const {init, last} = require("./product/array");

const {LT, EQ, GT} = require("./sum/Ordering");

const generic = {};


generic.lift = f => g => h => x => f(g(x)) (h(x));


generic.localeCompare_ = (x, y) => x.localeCompare(y);


generic.localeCompare = y => x => x.localeCompare(y);


generic.log_ = (...args) => console.log(...args);


generic.log = (...args) => x => console.log(x, ...args);


generic.negf = f => x => !f(x);


generic.negf2 = f => x => y => !f(x) (y);


generic.negf2_ = f => (x, y) => !f(x, y);


generic.negf3 = f => x => y => z => !f(x) (y) (z);


generic.negf3_ = f => (x, y, z) => !f(x, y, z);


generic.negf4 = f => w => x => y => z => !f(w) (x) (y) (z);


generic.negf4_ = f => (w, x, y, z) => !f(w, x, y, z);


generic.negf5 = f => v => w => x => y => z => !f(v) (w) (x) (y) (z);


generic.negf5_ = f => (v, w, x, y, z) => !f(v, w, x, y, z);


generic.or_ = (x, y) => x || y;


generic.or = y => x => x || y;


generic.partial_ = (f, ...args) => (...args2) => f(...args, ...args2);


generic.partial = f => (...args) => (...args2) => f(...args, ...args2);


generic.print = template => (...args) => template.replace(/\$\{(\d+)}/g, (_, i) => args[i]);


generic.raise_ = (cons, template) => (...args) => { throw new cons(template(...args)) };


generic.raise = cons => template => (...args) => { throw new cons(template(...args)) };


generic.repeat = n => f => x => {
  const next = (x, n) => n > 0 ? next(f(x), n - 1) : x;
  return next(x, n);
};


generic.repeatWhile = n => pred => f => x => {
  const next = (x, n, prev) => pred(n, x) ? next(f(x), n - 1, x) : prev;
  return next(x, n, x);
};


generic.sequence = f => (x, y) => {
  const aux = (acc, z) => z <= y
   ? aux(acc.concat(z), f(z))
   : acc;

  return aux([], x);
};


generic._sequence = f => (x, y) => {
  function* aux() {
    while (true) {
      yield x;
      x = f(x);
      if (x > y) break;
    }
  }

  return aux();
};


generic.strict = f => g => f(g());


generic.strict2 = f => x => g => f(x) (g());


generic.strict3 = f => x => y => g => f(x) (y) (g());


generic.strict4 = f => x => y => z => g => f(x) (y) (z) (g());


generic.strict5 = f => w => x => y => z => g => f(w) (x) (y) (z) (g());


generic.swap = f => (x, y) => f(y, x);


generic.T = x => f => f(x);


generic.T2 = x => y => f => f(x) (y);


generic.T3 = x => y => z => f => f(x) (y) (z);


generic.T4 = w => x => y => z => f => f(w) (x) (y) (z);


generic.T5 = v => w => x => y => z => f => f(v) (w) (x) (y) (z);


generic.tap = f => x => (f(x), x);


generic.tap0 = f => x => (f(), x);


generic.tap2 = f => x => y => (f(x) (y), y);


generic.tap3 = f => x => y => z => (f(x) (y) (z), z);


generic.tap4 = f => w => x => y => z => (f(w) (x) (y) (z), z);


generic.tap5 = f => v => w => x => y => z => (f(v) (w) (x) (y) (z), z);


generic.times = n => f => repeat (n) (x => (f(x), x + 1)) (0);


generic.trace = tag => generic.tap(generic.partial(log) (tag));


generic.trace2 = tag => generic.tap2(generic.partial(log) (tag));


generic.trace3 = tag => generic.tap3(generic.partial(log) (tag));


generic.trace4 = tag => generic.tap4(generic.partial(log) (tag));


generic.trace5 = tag => generic.tap5(generic.partial(log) (tag));


generic.U = f => f(f);


generic.xor = _default => y => x => !x === !y ? _default : x || y;


generic.xor_ = (x, y, _default) => !x === !y ? _default : x || y;


module.exports = generic;