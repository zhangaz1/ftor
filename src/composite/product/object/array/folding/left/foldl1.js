module.exports = foldl1 = f => xs => xs.reduce((acc, v, k) => f(acc) (v, k));