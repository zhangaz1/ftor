"use strict";


/**
 * @name guarded function
 * @type higher order function
 * @example
 *

   const div = y => x => x / y;
   const safeDiv = guard2(div) (x => _ => x !== 0);
   const div0 = safeDiv(0);

   div(0) (3); // Infinity
   div0(3); // 3

 */


// (a -> b) -> (a -> Boolean) -> a -> a|b
const guard = f => pred => x => pred(x) ? f(x) : x;


// ((a -> b), (a -> Boolean)) -> a -> a|b
const guard_ = (f, pred) => x => pred(x) ? f(x) : x;


// (a -> b -> c) -> (a -> b -> Boolean) -> a -> b -> b|c
const guard2 = f => pred => x => y => pred(x) (y) ? f(x) (y) : y;


// ((a -> b -> c), (a -> b -> Boolean), a) -> b -> b|c
const guard2_ = (f, pred, x) => y => pred(x) (y) ? f(x) (y) : y;


// (((a, b) -> c), ((a, b) -> Boolean), a) -> b -> b|c
const guard2__ = (f, pred, x) => y => pred(x, y) ? f(x, y) : y;


// (a -> b -> c -> d) -> (a -> b -> c -> Boolean) -> a -> b -> c -> c|d
const guard3 = f => pred => x => y => pred(x) (y) (z) ? f(x) (y) (z) : z;


// ((a -> b -> c -> d), (a -> b -> c -> Boolean), a) -> b -> c -> c|d
const guard3_ = (f, pred, x, y) => z => pred(x) (y) (z) ? f(x) (y) (z) : z;


// (((a, b, c) -> d), ((a, b, c) -> Boolean), a) -> b -> c -> c|d
const guard3__ = (f, pred, x, y) => z => pred(x, y, z) ? f(x, y, z) : z;


// API


module.exports = {guard, guard_, guard2, guard2_, guard2__, guard3, guard3_, guard3__};