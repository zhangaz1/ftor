module.exports = foldl = f => acc => xs => xs.reduce((acc, v, k) => f(acc) (v, k), acc);