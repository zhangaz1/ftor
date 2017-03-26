"use strict";


/**
 * @name constant
 * @type primitive combinator
 * @example
 *

   const True = K(true);
   True(false); // true

 */


// a -> b => a
const K = x => _ => x;


// API


module.exports = K;