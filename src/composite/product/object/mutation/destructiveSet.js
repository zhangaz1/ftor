// rev1
module.exports = destructiveSet = (k, v) => o => (o[k] = v, o);