"use strict";


// dependencies


const {compare2, compare3, compare4, compare5} = require("./compare");


/**
 * @name lower than or equal
 * @type higher order function
 * @class Ord
 * @example

   const Ordering = {};
   const LT = ({type: Ordering, tag: "LT"});
   const EQ = ({type: Ordering, tag: "EQ"});
   const GT = ({type: Ordering, tag: "GT"});

   const compare2 = (Rep1, Rep2) => t2 => t1 => t1((w, x) => t2((y, z) => {
     switch (Rep1.compare(y) (w).tag) {
       case "LT": return LT;
       case "GT": return GT;
       case "EQ": {
         switch (Rep2.compare(z) (x).tag) {
           case "LT": return LT;
           case "GT": return GT;
           case "EQ": return EQ;
         }
       }
     }
   }));

   const Pair = (x, y) => f => f(x, y);

   const lte2 = (Rep1, Rep2) => t2 => t1 => {
     switch (compare2(Rep1, Rep2) (t2) (t1).tag) {
       case "LT":
       case "EQ": return true;
       default: return false;
     }
   };

   const Num = { compare: y => x => x < y ? LT : y < x ? GT : EQ }
   const Str = { compare: y => x => x < y ? LT : y < x ? GT : EQ }

   const pair1 = Pair(2, "a");
   const pair2 = Pair(2, "b");
   const pair3 = Pair(2, "a");
   const pair4 = Pair(1, "b");

   lte2(Num, Str) (pair2) (pair1); // true
   lte2(Num, Str) (pair3) (pair1); // true
   lte2(Num, Str) (pair4) (pair1); // false

 */


// Ord a => Object -> (a -> b) -> (a -> b) -> Boolean
const lte = Rep => t2 => t1 => t1(x => t2(y => Rep.lte(y) (x)));


// (Ord a, Ord b) => (Object, Object) -> ((a, b) -> c) -> ((a, b) -> c) -> Boolean
const lte2 = (Rep1, Rep2) => t2 => t1 => {
  switch (compare2(Rep1, Rep2) (t2) (t1).tag) {
    case "LT":
    case "EQ": return true;
    default: return false;
  }
};


// (Ord a, Ord b, Ord c) => (Object, Object, Object) -> ((a, b, c) -> d) -> ((a, b, c) -> d) -> Boolean
const lte3 = (Rep1, Rep2, Rep3) => t2 => t1 => {
  switch (compare3(Rep1, Rep2, Rep3) (t2) (t1).tag) {
    case "LT":
    case "EQ": return true;
    default: return false;
  }
};


// (Ord a, Ord b, Ord c, Ord d) => (Object, Object, Object, Object) -> ((a, b, c, d) -> e) -> ((a, b, c, d) -> e) -> Boolean
const lte4 = (Rep1, Rep2, Rep3, Rep4) => t2 => t1 => {
  switch (compare4(Rep1, Rep2, Rep3, Rep4) (t2) (t1).tag) {
    case "LT":
    case "EQ": return true;
    default: return false;
  }
};


// (Ord a, Ord b, Ord c, Ord d, Ord e) => (Object, Object, Object, Object, Object) -> ((a, b, c, d, e) -> f) -> ((a, b, c, d, e) -> f) -> Boolean
const lte5 = (Rep1, Rep2, Rep3, Rep4, Rep5) => t2 => t1 => {
  switch (compare5(Rep1, Rep2, Rep3, Rep4, Rep5) (t2) (t1).tag) {
    case "LT":
    case "EQ": return true;
    default: return false;
  }
};


// API


module.exports = {lte, lte2, lte3, lte4, lte5};