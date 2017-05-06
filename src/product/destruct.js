"use strict";


/**
 * @name destruct
 * @type higher order function
 * @example

   ?

 */


// (a -> b) -> String -> Object -> b
const destruct = f => x => ({[x]:a}) => f(a);


// (a -> b -> c) -> (String, String) -> Object -> c
const destruct2 = f => (x, y) => (({[x]:a}), ({[y]:b})) => f(a) (b);


// (a -> b -> c -> d) -> (String, String, String) -> Object -> d
const destruct3 = f => (x, y, z) => (({[x]:a}), ({[y]:b}), ({[z]:c})) => f(a) (b) (c);


// API


module.exports = {destruct, destruct2, destruct3};