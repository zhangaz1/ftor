"use strict";


// dependencies


const {$Const, $tag} = require("../interop");
const noop = require("../noop");


/**
 * @name Constant
 * @note Church encoded; combined namespace/constructor
 * @type sum type
 * @status stable
 * @example

  const $tag = Symbol.for("ftor/tag");
  const $Const = Symbol.for("ftor/Const");
  const $Ident = Symbol.for("ftor/Ident");

  const Const = x => {
    const Const = f => x;
    return (Const[$tag] = "Const", Const[$Const] = true, Const);
  };

  const Ident = x => {
    const Ident = f => f(x);
    return (Ident[$tag] = "Ident", Ident[$Ident] = true, Ident);
  };

  Const.map = f => tx => tx[$Const] && Const(tx(x => f(x)));

  const I = x => x;
  const sqr = x => x * x;

  const x = Const(5),
   y = Ident(5);

  Const.map(sqr) (x) (I); // 5
  Const.map(sqr) (y) (I); // TypeError

 */


// a -> (a -> r) -> a
const Const = x => {
  const Const = f => x;
  return (Const[$tag] = "Const", Const[$Const] = true, Const);
};


/**
 * @name fold
 * @type higher order function
 * @class Foldable
 * @status stable
 * @example

  const $tag = Symbol.for("ftor/tag");
  const $Const = Symbol.for("ftor/Const");

  const Const = x => {
    const Const = f => x;
    return (Const[$tag] = "Const", Const[$Const] = true, Const);
  };

  Const.fold = f => acc => tx => tx[$Const] && acc;
  const add = x => y => x + y;

  Const.fold(add) (2) (Const(3)); // 2

 */


// (b -> a -> b) -> b -> Const a -> b
Const.fold = f => acc => tx => tx[$Const] && acc;


/**
 * @name map
 * @type higher order function
 * @class Functor
 * @status stable
 * @example

  const $tag = Symbol.for("ftor/tag");
  const $Const = Symbol.for("ftor/Const");

  const Const = x => {
    const Const = f => x;
    return (Const[$tag] = "Const", Const[$Const] = true, Const);
  };

  Const.map = f => tx => tx[$Const] && tx;

  const B_ = (...fs) => x => fs.reduceRight((acc, f) => f(acc), x);
  const I = x => x;
  const sqr = x => x * x;
  const dbl = x => x * 2;

  const x = Const(5);

  B_(Const.map(sqr), Const.map(dbl)) (x) (I); // 5

 */


// (a -> b) -> Const a -> Const a
Const.map = f => tx => tx[$Const] && tx;


/**
 * @name traverse
 * @type higher order function
 * @class Traversable
 * @status stable
 * @example

  const $tag = Symbol.for("ftor/tag");
  const $Const = Symbol.for("ftor/Const");

  const Const = x => {
    const Const = f => x;
    return (Const[$tag] = "Const", Const[$Const] = true, Const);
  };

  Const.traverse = (of, map) => ft => tx => tx[$Const] && map(Const) (of(tx(noop)));

  const map = f => xs => xs.map(f);
  const of = x => [x];
  const I = x => x;
  const noop = () => null;

  const r1 = Const.traverse(of, map) (x => x === null ? [] : [x]) (Const(1)); // [Const(1)]
  const r2 = Const.traverse(of, map) (x => x === null ? [] : [x]) (Const(null)); // [Const(null)]

  r1 [0] (I); // 1
  r2 [0] (I); // null

 */


// Applicative f => (a -> f b) -> Const a -> f (Const a)
Const.traverse = (of, map) => ft => tx => tx[$Const] && map(Const) (of(tx(noop)));


/**
 * @name of
 * @type higher order function
 * @class Applicative
 * @status stable
 * @example

  @see ap

 */


// Monoid m => a -> Const m a
Const.of = empty => x => empty;


/**
 * @name apply
 * @type higher order function
 * @class Applicative
 * @status unstable
 * @example

  ???

 */


// Monoid m => Const m (a -> b) -> Const m a -> Const m b
Const.ap = concat => tf => tx => ty => tf[$Const] && tx[$Const] && tf(f => Const.map(concat) (tx));


// API


module.exports = Const;