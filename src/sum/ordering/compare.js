"use strict";


// dependencies


const EQ = require("./EQ");
const GT = require("./GT");
const K = require("../../K");
const LT = require("./LT");
const {ternarySum, ternarySum_} = require("./ternarySum");


/**
 * @name compare
 * @type operator function
 * @example

   compare(EQ) (GT); // LT
   compare(GT) (GT); // EQ
   compare(GT) (LT); // GT

 */


// Ordering -> Ordering -> Ordering
const compare = ternarySum(K(LT), K(GT), K(EQ));


// (Ordering, Ordering) -> Ordering
const compare_ = ternarySum_(K(LT), K(GT), K(EQ));


// API


module.exports = {compare, compare_};