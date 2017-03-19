"use strict";


// dependencies


const {A, alwaysFalse, alwaysTrue, K, negf, negf2, raise_} = require("../generic");


const {eq, eq_, lt_, lte_, gt_, gte_, neq, neq_} = require("../primitive/generic");


// private


const ternarySum = (f, g, h) => fy => fx => {
  const x = Ordering.fromEnum(fx),
   y  = Ordering.fromEnum(fy);

  return x < y
   ? f()
   : x > y
    ? g()
    : h();
};


const ternarySum_ = (f, g, h) => (fx, fy) => {
  const x = Ordering.fromEnum(fx),
   y  = Ordering.fromEnum(fy);

  return x < y
   ? f()
   : x > y
    ? g()
    : h();
};


// type representative


const Ordering = {}; // kind *


// constructors (nullary)


const LT = ({type: Ordering, tag: "LT"})


const EQ = ({type: Ordering, tag: "EQ"})


const GT = ({type: Ordering, tag: "GT"})


// general


Ordering.cata = pattern => ({tag}) => pattern[tag]();


// Bounded


Ordering.minBound = Ordering.LT;


Ordering.maxBound = Ordering.GT;


// Setoid


Ordering.eq = ternarySum(alwaysFalse, alwaysFalse, alwaysTrue);


Ordering.eq_ = ternarySum_(alwaysFalse, alwaysFalse, alwaysTrue);


Ordering.neq = ternarySum(alwaysTrue, alwaysTrue, alwaysFalse);


Ordering.neq_ = ternarySum_(alwaysTrue, alwaysTrue, alwaysFalse);


// Ord


Ordering.compare = ternarySum(K(LT), K(GT), K(EQ));


Ordering.compare_ = ternarySum_(K(LT), K(GT), K(EQ));


Ordering.lt = ternarySum(alwaysTrue, alwaysFalse, alwaysFalse)


Ordering.lt_ = ternarySum_(alwaysTrue, alwaysFalse, alwaysFalse)


Ordering.lte = ternarySum(alwaysTrue, alwaysFalse, alwaysTrue)


Ordering.lte_ = ternarySum_(alwaysTrue, alwaysFalse, alwaysTrue)


Ordering.gt = ternarySum(alwaysFalse, alwaysTrue, alwaysFalse)


Ordering.gt_ = ternarySum_(alwaysFalse, alwaysTrue, alwaysFalse)


Ordering.gte = ternarySum(alwaysFalse, alwaysTrue, alwaysTrue)


Ordering.gte_ = ternarySum_(alwaysFalse, alwaysTrue, alwaysTrue)


// Enum


Ordering.pred = A(({tag}) => ({
  LT: raise_(TypeError, "invalid pred invocation with LT"),
  EQ: LT,
  GT: EQ
})[tag]);


Ordering.succ = A(({tag}) => ({
  LT: EQ,
  EQ: GT,
  GT: raise_(TypeError, "invalid succ invocation with GT")
})[tag]);


Ordering.fromEnum = A(({tag}) => ({LT: 0, EQ: 1, GT: 2})[tag]);


Ordering.toEnum = A(n => {
  switch (n) {
    case 0: return LT;
    case 1: return EQ;
    case 2: return GT;
    default: raise_(RangeError, "argument for toEnum out of range");
  }
});


// Semigroup


Ordering.concat = sy => ({tag}) => ({LT, EQ: sy, GT})[tag]);


Ordering.concat_ = ({tag}, sy) => ({LT, EQ: sy, GT})[tag]);


// Monoid


Ordering.append = Ordering.concat;


Ordering.append_ = Ordering.concat_;


Ordering.empty = () => EQ;


// API


module.exports = {Ordering, LT, EQ, GT};