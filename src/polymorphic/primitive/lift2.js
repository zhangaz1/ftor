module.exports = lift2 = f => g => h => x => f(g(x)) (h(x));