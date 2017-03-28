"use strict";


/**
 * @name recursive combinator
 * @type higher order function
 * @example
 *

   const fib = U(h => n => n === 0 ? n : n + h(h)(n - 1));
   fib(5); // 15

 */


// ?
const U = f => f(f);


// API


module.exports = U;