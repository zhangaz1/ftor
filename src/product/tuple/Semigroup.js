"use strict";


// dependencies


const Tuple = require("./Tuple");


/**
 * @name Semigroup type class
 * @type type representative
 * @kind * -> *
 */


const Semigroup = {};


/**
 * @name concat
 * @type higher order function
 * @example

   const Tuple = (...args) => f => f(...args);
   const Pair = (x, y) => f => f(x, y);
   const toArray = (...args) => args;

   const Semigroup = {};
   Semigroup.concat2 = (Rep1, Rep2) => t2 => t1 => t1((w, x) => t2((y, z) => Tuple(Rep1.concat(y) (w), Rep2.concat(z) (x))));

   const pair1 = Pair(1, "a");
   const pair2 = Pair(2, "b");

   const Num = {concat: y => x => x + y}
   const Str = {concat: y => x => x + y}

   Semigroup.concat2(Num, Str) (pair2) (pair1) (toArray); // [3, "ab"]

 */


// Semigroup a => Object -> (a -> b) -> (a -> b) -> (a -> b)
Semigroup.concat = Rep => t2 => t1 => t1(x => t2(y => Tuple(Rep.concat(y) (x))));


// (Semigroup a, Semigroup b) => (Object, Object) -> ((a, b) -> c) -> ((a, b) -> c) -> ((a, b) -> c)
Semigroup.concat2 = (Rep1, Rep2) => t2 => t1 => t1((w, x) => t2((y, z) => Tuple(Rep1.concat(y) (w), Rep2.concat(z) (x))));


// (Semigroup a, Semigroup b, Semigroup c) => (Object, Object, Object) -> ((a, b, c) -> d) -> ((a, b, c) -> d) -> ((a, b, c) -> d)
Semigroup.concat3 = (Rep1, Rep2, Rep3) => t2 => t1 => t1((u, v, w) => t2((x, y, z) => Tuple(Rep1.concat(x) (u), Rep2.concat(y) (v), Rep3.concat(z) (w))));


// (Semigroup a, Semigroup b, Semigroup c, Semigroup d) => (Object, Object, Object, Object) -> ((a, b, c, d) -> e) -> ((a, b, c, d) -> e) -> ((a, b, c, d) -> e)
Semigroup.concat4 = (Rep1, Rep2, Rep3, Rep4) => t2 => t1 => t1((s, t, u, v) => t2((w, x, y, z) => Tuple(Rep1.concat(w) (s), Rep2.concat(x) (t), Rep3.concat(y) (u), Rep4.concat(z) (v))));


// (Semigroup a, Semigroup b, Semigroup c, Semigroup d, Semigroup e) => (Object, Object, Object, Object, Object) -> ((a, b, c, d, e) -> f) -> ((a, b, c, d, e) -> f) -> ((a, b, c, d, e) -> f)
Semigroup.concat5 = (Rep1, Rep2, Rep3, Rep4, Rep5) => t2 => t1 => t1((q, r, s, t, u) => t2((v, w, x, y, z) => Tuple(Rep1.concat(v) (q), Rep2.concat(w) (r), Rep3.concat(x) (s), Rep4.concat(y) (t), Rep5.concat(z) (u))));


// API


module.exports = Semigroup;