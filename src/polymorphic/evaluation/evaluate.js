module.exports = evaluate = x => typeof x === "function" ? x() : x;