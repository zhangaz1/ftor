"use strict";


/**
 * @name 4-tuple
 * @type data constructor
 * @example

   @see Pair
 
 */


// (a, b, c, d) -> ((a, b, c, d) => e) -> e
const Tuple4 = (w, x, y, z) => f => f(w, x, y, z);


// API


module.exports = Tuple4;