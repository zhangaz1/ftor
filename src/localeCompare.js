"use strict";


// dependencies


const LT = require("./sum/ordering/LT");
const EQ = require("./sum/ordering/EQ");
const GT = require("./sum/ordering/GT");


/**
 * @name locale compare
 * @type operator function
 * @example
 *

   localeCompare_("a", "ä"); // LT

 */


const map = {"-1": LT, 0: EQ, 1: GT};


// a -> a -> Ordering
const localeCompare = y => x => map[x.localeCompare(y)];


// (a, a) -> Ordering
const localeCompare_ = (x, y) => map[x.localeCompare(y)];


// API


module.exports = {localeCompare, localeCompare_};