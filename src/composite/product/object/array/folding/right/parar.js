const init = require("../../subarray/init");
const last = require("../../destructuring/last");

module.exports = parar = f => acc => xs => {
  const next = (head, acc, tail) => head === undefined
   ? acc
   : next(last(tail), f(head) (acc, tail), init(tail));

  return next(last(xs), acc, init(xs));
};