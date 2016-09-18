module.exports = lazyFold = f => init => function* (iter) {
  let acc = init;
  for (x of iter) {
    acc = f(acc) (x);
    yield acc;
  }
};