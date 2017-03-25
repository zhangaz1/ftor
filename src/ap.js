"use strict";


/**
 * @name applicative apply
 * @type higher order function
 * @example
 *

   ?

 */


// (r -> a -> b) -> (r -> a) -> r -> b
const ap = f => g => x => f(x) (g(x));


// API


module.exports = ap;