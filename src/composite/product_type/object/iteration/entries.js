const append_ = require("../..object/array/accumulation/append_");
const comp = require("../../../../polymorphic/composition/comp");
const foldl = require("../..object/array/folding/foldl");
const keys = require("../reflection/keys");
const values = require("../..object/array/iteration/values");

module.exports = entries = o => comp(values) (foldl(acc => x => append_(acc) ([x, o[x]])) ([])) (keys(o));