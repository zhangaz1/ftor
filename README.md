<pre>
   ad88                                   
  d8"      ,d                             
  88       88                             
MM88MMM  MM88MMM  ,adPPYba,   8b,dPPYba,  
  88       88    a8"     "8a  88P'   "Y8  
  88       88    8b       d8  88          
  88       88,   "8a,   ,a8"  88          
  88       "Y888  `"YbbdP"'   88          
</pre>

# Status

<img src="https://i.stack.imgur.com/UqCPm.png?s=328&g=1" height="110" alt="ftor" align="left">

<br>

Version 0.9.20 (unstable)

**Please note:** This repo is experimental and still work in progress.
<br><br>

ftor will need at least another six month to reach a more stable status (as of Feb., 2018). It has a great impact on the way Javascript is encoded, but there are no best practices yet, so conceptual details may still change.

## What

ftor enables ML-like type-directed, functional programming with Javascript including reasonable debugging. In essence, it consists of a runtime type system and a functional programming library building upon it.

There is a separated API [documentation](https://github.com/kongware/ftor/blob/master/LIBRARY.md) (under construction) for the typed functional library.

## Why

Programming in an untyped environment sucks.

## Goal

This is the still unfinished proof that a Haskell-like runtime type checker for Javascript is actually useful, not just for learning purposes but also for production.

## Features

* pluggable through proxy virtualization
* parametric polymorphism
* row polymorphism
* rank-2 polymorphism
* type-safe ADTs
* Scott encoded sum types including functional pattern matching
* newtype for single constructor, single field types
* homogeneous Arrays and Maps
* real Tuples and Records
* type hints for partially applied combinators
* strict type evaluation

## Pluggable

ftor doesn't have a compiler that erases type information from your code base during compilation. Instead your code remains as-is and you can simply disable the type system when you don't need it anymore. To ensure good performance, the type checker is designed to have a small footprint as soon as it is disabled.

You may be worried now that your packages become bloated with useless additional information. However, most of this extra bytes consists of type annotations whose self-documenting character you will probably appriciate quickly.

Enabling the type checker is as easy as setting a flag:

```Javascript
import * as F from ".../ftor.js";

// type checker is enabled by default
F.type(false);
```
## Impact and Limitations

As most dynamically typed languages Javascript has the capability to introspect types at runtime. With functions, however, this only works to a very limited extent, because there is only a single `Function` type. To infer the type of a function we would have to parse and evaluate its entire body. Since Javascript allows side effects not only at `;` but literally everywhere, this would be a pretty hopeless endeavor.

As an unfortunate consequence we have to type functions manually so that the type checker can combine them with automatically introspected types. This way ftor is able to unify types of arbitrarily complex function expressions.

Writing explicit type annotations is laborious and requires a mature sense for types and their corresponding implementations. Therefore the real power of ftor's type system will arise from the combination with a typed functional library. Consumers of this library can focus on composing typed functions and combinators instead of worrying about type definitions all the time.

Another extensive consequence is that everything must be expressed with a function. Javascript's native operators, for instance, are replaced with the corresponding functional counterparts or loops by recursion. Before you know it, you're knee-deep in the functional paradigm.

## Invalid Type Signatures

Functional languages based on the the Hindley-Milner type system like Haskell infer the type of a function and if an explict type annotation is given, unify both. In doing so the inferred type must be at least as polymorphic than the explicit one, otherwise the function declaration is rejected:

```Haskell
id :: a -> b
id x = x -- type error, infers a -> a
```
Since ftor doesn't conduct type inference, it needs an additional proof that a type annotation is at least valid, that is the type is inhabited, because corresponding implementations exists. This proof doesn't include a guarantee that an explicit type annotation matches the associated implementation, though. Only the developer is responsible for this.

## Differences to _Flow_ and _TypeScript_

* ftor focuses on parametric and row polymorphism<sup>1</sup> and doesn't support subtyping
* it mainly relies on nominal instead of structural typing<sup>2</sup>
* it is designed to facilitate purely functional programming

<sub><sup>1</sup>also known as static duck typing</sub><br>
<sub><sup>2</sup>Nominal typing means that types are distinguished by name rather than by structure</sub>

## Type Classes

Why is ftor not shipped with type classes? Because they require either a compilation step or the runtime must have access to all type information to dynamically dispatch the right type class. ftor is a pluggable type checker and doesn't meet these requirements. It uses explicit type dictionary passing instead, which allow multiple type classes per type. Abandoning the singleton property may be burden or a relief - this depends on the problem you're trying to solve.

## Higher Order Types

ftor won't support higher order types for two reasons. It would make the type checker far more complex because it requires a kind system and several adaptions to the parser and the typing rules. More importantly, it would greatly increase the mental burden of users. In my opinion higher-order types are exactly the abstraction that makes type systems hard to comprehend and confusing for beginners. As a consequence of renouncing higher order types, you cannot express the general functor or monad type with ftor, but only the specialized forms. I think, however, that this is a reasonable trade-off.

## Interoperability

Fantasy Land has done a great deal for the functional Javascript community. However, its focus on type classes based on the prototype system makes it quite difficult for ftor to be compliant. Anyway, I am open for suggestions!

## Native Type Support

Currently ftor neither supports `Iterator`s, `Generator`s nor `Promise`s. The former two are inherently stateful and hence not particularly functional, so you'd try to avoid them anyway. `Promise`s on the other hand are very hard to type, because they are optimized for an untyped environment and to be convenient for programmers that are unfamiliar with monadic computations. It is very likely that ftor won't support them ever, but will provide a corresponding wrapper.

## Immutability

For common types like `Array` and `Record` ftor restricts the possibilty of mutation rather than imposing strict immutability. Algebraic data types on the other hand are immutable and other functional data types like `Tries` will follow.

## Upcoming Features

- [ ] incorporate a tautoligy check for explicit type signatures
- [ ] allow type system extensions through CONSTRAINED dynamic types (e.g. variadic compostion: `... (c -> d) -> (b -> c) -> (a -> b)`)
- [ ] reject impredicative types (instantiation of rank-2 type at a polytype)
- [ ] incorporate subsumption rule (considering co-/contra-variance phenomenon)
- [ ] add section from CPS to Scott encoding to readme
- [ ] provide common functional combinators/patterns
- [ ] revise error messages and underlyning
- [ ] pretty print unified types
- [ ] add unit tests
- [ ] replace monolithic parser with functional parser combinators
- [ ] add homogeneous Set type
- [ ] incorporate a special effect type / corresponding runtime
- [ ] add persistant data structures
- [ ] mimick type classes with explicit rank-2 types

# Types

Let's get to the extended types without any further ado.

## Function Type

You can easily create typed functions with the `Fun` constructor. It takes a mandatory type signature and an arrow function - that's all:

```Javascript
const add = Fun(
  "(add :: Number -> Number -> Number)",
  m => n => m + n
);

add(2) (3); // 5
add(2) ("3"); // type error
```
Please note that the name portion (`add :: `) in the signature is optional and used to give the corresponding anonymous function sequence a name.

### Pure Functions

ftor relies on functions being pure<sup>1</sup> but cannot enfoce this characteristic in Javascript. There will be a special data type in the near future, with which effects can be expressed in such a pure environment.

<sub><sup>1</sup>a function is pure if it is referential transparent</sub>

### Curried Functions

ftor doesn't support multi-argument functions but only functions in curried form, that is sequences with exactly one argument per call.

Currying leads to lots of partially applied anonymous functions throughout the code. One of the most annoying aspects of working with such anonymous functions in Javascript consists in debugging them. For that reason ftor automatically assigns the name portion of type signatures to each subsequent lambda:

```Javascript
const add = Fun(
  "(add :: Number -> Number -> Number)",
  n => m => n + m
);

add(2).name; // "add"
```
#### Readability

A lot of people are concerned about the readability of the typical curry function call pattern (`fun(x) (y) (z)`). It is considered as less readable than calling multi-argument functions (`fun(x, y, z)`) and non-idiomatic in general.

I find the criticism exaggerated and above all emotionally motivated. It is much more important that currying entails great benefits like partial application and abstraction over arity. Moreover it greatly simplyfies the design of the type checker.

#### Performance

If you are concerned about performance and micro optimizations rather than code reuse, productivity and more robust programs you should prefer imperative algorithms and mutations anyway. _Flow_ or _TypeScript_ are more suitable in this case.

#### Pseudo Multi-Argument Functions

You can, however, utilize variadic functions using the rest parameter and destructuring assignment to mimic multi-argument functions:

```Javascript
const repeatStr = Fun(
  "(repeatStr :: ...[String, Number] -> String)",
  (...[s, n]) => Array(n + 1).join(s)
);

repeatStr("x", 3); // "xxx"
```
### Meaningful Error Messages

Verbose error messages provide a better debugging experience:

```Javascript
const inc = Fun(
  "(inc :: Number -> Number)",
  n => n + 1
);

inc(true); // throws the following type error

Uncaught TypeError: inc expects

(inc :: Number -> Number)
        ^^^^^^

Boolean received


    at _throw (<anonymous>:3541:9)
    at verifyArgT (<anonymous>:1884:34)
    at Object.apply (<anonymous>:1680:22)
    at <anonymous>:1:1
```
Please not that both error messages themselves and their pretty printing is quite bad at the moment and will be revised any time soon.

### Strict Function Call Arity

ftor handles function call arities strictly:

```Javascript
const inc = Fun(
  "(inc :: Number -> Number)",
  n => n + 1
);

inc(); // arity error
inc(2); // 3
inc(2, 3); // arity error
```
### Variadic Functions

You can define variadic functions using the rest parameter:

```Javascript
const sum = Fun(
  "(sum :: ...[Number] -> Number)",
  (...ns) => ns.reduce((acc, n) => acc + n, 0)
);

sum(); // 0
sum(1, 2, 3); // 6
sum(1, "2"); // type error
```
Usually the rest parameter constructs an homogeneous array. As mentioned in the curried function section you can also let it construct a tuple if you want to mimic multi-argument functions.

### Nullary Functions / Thunks

You can explicitly express non-strict evaluation with thunks:

```Javascript
const thunk = Fun("(() -> String)", () => "foo" + "bar");

thunk(); // "foobar"
thunk("baz"); // arity error
```
### Parametric Polymorphic Functions

ftor supports parametric polymorphism:

```Javascript
const k = Fun(
  "(k :: a -> b -> a)",
  x => y => x
);

const snd = Fun(
  "(snd :: a -> a -> a)",
  x => y => y
);

k(true) (false); // true
k("foo") ("bar"); // "foo"
k("foo") (123); // "foo"

snd(true) (false); // false
snd("foo") ("bar"); // "bar"
snd("foo") (123); // type error
```
`a` and `b` are type variables, that is they can be substituted with any type. They can, but do not have to be of different type:

### Higher Order Functions

Let's treat functions the same way as data. The following applicator helps to illustrate the underlying principle:

```Javascript
const ap = Fun(
  "(ap :: (a -> b) -> a -> b)",
  f => x => f(x)
);

const inc = Fun(
  "(inc :: Number -> Number)",
  n => n + 1
);

const toStr = Fun(
  "(toStr :: Number -> String)",
  n => String(n)
);

ap(inc) (2); // 3
ap(inc) ("2"); // type error

ap(toStr) (2); // "3"
ap(toStr) (true); // type error
```
### Strict Evaluation

The type checker immediately evaluates partially applied functions and is therefore able to throw type errors eagerly:

```Javascript
const ap_ = Fun(
  "(ap_ :: (a -> a) -> a -> a)",
  f => x => f(x)
);

const inc = Fun(
  "(inc :: Number -> Number)",
  n => n + 1
);

const add = Fun(
  "(add :: Number -> Number -> Number)",
  m => n => m + n
);

const toArr = Fun(
  "(toArr :: a -> [a])",
  x => Arr([x]) // typed array
);

ap_(inc); // passes
ap_(add); // type error
ap_(toArr); // type error
```
### Type Hints

As soon as you combine monomorphic and polymorphic curried functions in various ways, you quickly lose track of the partial applied function's intermediate types:

```Javascript
const comp = Fun(
  "(comp :: (b -> c) -> (a -> b) -> a -> c)",
  f => g => x => f(g(x))
);

const inc = Fun(
  "(inc :: Number -> Number)",
  n => n + 1
);

comp(inc); // ?
```
This is still a trivial case but it may not be so easy to solve for someone unfamiliar with the functional paradigm. Let's ask ftor for help:

```Javascript
comp(inc) [TS]; // "(comp :: (a -> Number) -> a -> Number)"
```
Just use the `TS` Symbol to access the current type signature of a typed function. Let's look at a more complex example:

```Javascript
const comp = Fun(
  "(comp :: (b -> c) -> (a -> b) -> a -> c)",
  f => g => x => f(g(x))
);

const compx = comp(comp),
  compy = comp(comp) (comp);

compx[TS]; // "(comp :: (a -> b0 -> c0) -> a -> (a0 -> b0) -> a0 -> c0)"
compy[TS]; // "(comp :: (b1 -> c1) -> (a0 -> a1 -> b1) -> a0 -> a1 -> c1)"
```
You can derive from the type signatures that `compx` takes a binary function, a value, an unary function and another value, whereas `compy` takes an unary and then a binary function and two values. As a matter of fact `compy` is a pretty useful function, since it allows us to use a binary function as the inner one of the composition.

Instead of examining implementations we can stick with type signatures to comprehend complex function expressions. By leaving implementation details behind, we've reached another level of abstraction and ftor helps us to keep track of the right types.

### Abstraction over Arity

If the type signature of an higher order function returns a type variable, this means it can return any type thus also another function. As a result such higher order function types can abstract over the passed function argument's arity:

```Javascript
const ap = Fun(
  "(ap :: (a -> b) -> a -> b)",
  f => x => f(x)
);

const add = Fun(
  "(add :: Number -> Number -> Number)",
  n => m => n + m
);

const k = Fun(
  "(k :: a -> b -> a)",
  x => y => x
);

ap(add) (2) (3); // 5
ap(k) ("foo") ("bar"); // "foo"
```
Even though `ap` merely accepts unary functions it can handle function arguments of arbitrary arity.

### Parametricity

<a href="https://en.wikipedia.org/wiki/Parametricity">Parametricity</a> is a property of parametric polymorphism that prevents polymorphic functions from knowing anything about the types of their arguments or return values. In return you get the ability to deduce or at least narrow down a function's behavior just from its type signature. To enforce parametricity a type checker must analyze the  entire function body at compile time. Since ftor isn't a static type checker it can't preclude pseudo-polymorphic functions violating this property:

```Javascript
const append = Fun(
  "(append :: a -> a -> a)",
  x => y => {
    switch (typeof x) {
      case "string":
      case "number": return x + y;
      case "boolean": return x && y;
      default: return null;
    }
  }
);

append(2) (3); // 5
append("2") ("3"); // "23"
append(true) (false); // false
append({}) ({}); // type error (returns null instead of {})
```
As with purity it is ultimately your responsibility to maintain this property.

### Expressiveness

I think that fixed-point combinators and anonymous recursion are good candidates for testing the expressiveness of a type system. I chose the simplified version of the `Y` combinator for this practice and since Javascript is a strictly evaluated language, I have to implement the eta-expanded version:

```Javascript
const fix = Fun(
  "(fix :: ((a -> b) -> a -> b) -> a -> b)",
  f => x => f(fix(f)) (x)
);

const fact = fix(Fun(
  "(fact :: (Number -> Number -> Number) -> Number -> Number -> Number)",
  rec => acc => n => n === 0 ? acc : rec(n * acc) (n - 1)
)) (1); // acc's initial value

fact(5); // 120

```
It took me a while to comprehend the type machinery in this case, so don't be discouraged.

## Typed Arrays

### Construction

You can create typed arrays with the `Arr` constructor. Unlike `Fun` you don't have to provide an explicit type signature but let the type checker introspect the type for you:

```Javascript
const xs = Arr([1, 2, 3]);
const ys = Arr(["foo", "bar", "baz"]);

xs[TS]; // "[Number]"
ys[TS]; // "[String]"
```
Please note that an empty typed array has the polymorphic type `[a]`.

### Homogeneity

Typed arrays must be homogeneous, that is all element values must be of the same type:

```Javascript
Arr([1, "foo", true]); // type error
```
### Index Gaps

They must have a continuous index without gaps:

```Javascript
const xs = [1, 2, 3];
xs[10] = 4;

Arr(xs); // type error
```
### Property Access

You must not access unknown properties:

```Javascript
const xs = Arr([1, 2, 3]);

xs[0]; // 1
xs[10]; // type error

ys.concat; // function
ys.foo; // type error
```
### Duck Typing

Duck typing for properties with numeric keys works as usual:

```Javascript
const xs = Arr([1, 2, 3]),
  x = 0 in xs ? xs[0] : 0, // 1
  y = 10 in xs ? xs[10] : 0; // 0
```
However, you must not duck type with non-numeric keys:

```Javascript
const xs = Arr([1, 2, 3]),
  foo = "foo" in xs ? xs.foo : false;
```
Other forms of meta-programming are restricted as well:

```Javascript
const xs = Arr([1, 2, 3]);
Object.keys(xs); // type error
```
As a general advice typed arrays should be used as arrays rather than plain old Javascript objects.

### Mutations

Typed arrays are immutable for properties with non-numeric keys:

```Javascript
const xs = Arr([1, 2, 3]);
xs.foo = "bar"; // type error
```

Indexed properties can be added or removed as long as there are no index gaps:

```Javascript
const xs = Arr([1, 2, 3]),
  ys = Arr([1, 2, 3]);

xs.push(4); // passes
xs[10] = 5; // type error

delete ys[2]; // passes
delete ys[1]; // type error
```
Mutations must not alter the typed array's type:

```Javascript
const xs = Arr([1, 2, 3]);

xs[1] = 20; // 20
xs[1] = "2"; // type error
```
### Type Coercion

ftor prevents implicit type conversions whenever possible:

```Javascript
const xs = Arr([1, 2, 3]),
  s = xs + "!"; // type error
```
Since there is no way to distinguish implicit from explicit conversions you unfortunatelly have to convert types manually.

### Function Passing

You can pass typed arrays to typed functions as usual:

```Javascript
const append = Fun(
  "(append :: [a] -> [a] -> [a])",
  xs => ys => xs.concat(ys)
);

const xs = Arr([1, 2]),
  ys = Arr([3, 4]),
  zs = Arr["foo", "bar"]);
  
append(xs) (ys); // [1, 2, 3, 4]
append(xs) (zs); // type error
```
### Delete Operator

Please don't use the `delete` operator or the corresponding `Reflect.deleteProperty` function, because they silently produce index gaps. Since `Array.prototype.pop` and `Array.prototype.unshift` internally also use `delete` I cannot disable it by default.

```Javascript
const xs = Arr([1, 2, 3]);
delete xs[2]; // passes, but evil
```
## Typed Maps

Since typed maps share a lot of properties with typed arrays, I am going to focus on the differences.

### Construction

You can create a typed maps by passing an ES2015 map to the `_Map` constructor:

```Javascript
const m = _Map(new Map([["Kalib", 42], ["Liz", 38], ["Dev", 35]]));

m.get("Liz"); // 42
m.get("Byron"); // type error
m.has("Byron"); // false
m.set("Byron", 30); // passes
m.set("Zara", "50"); // type error

m[TS]; // "{String::Number}"
```
The type signature of typed maps differs from that of typed records in that the key value pair is seperated by two consecutive colons without spaces.

Please note that the type of the empty typed map is `{k::v}`.

### Function Passing

You can pass typed maps to typed functions as usual:

```Javascript
const getOr = Fun(
  "(getOr :: Number -> String -> {String::Number} -> Number)",
  n => k => m => m.has(k) ? m.get(k) : n
);

const m = _Map(new Map([["Kalib", 42], ["Liz", 38], ["Dev", 35]]));

getOr(0) ("Dev") (m); // 35
getOr(0) ("Byron") (m); // 0
```
## Typed Records

Since typed records share a lot of properties with typed arrays, I am going to focus on the differences.

### Construction

Use the `Rec` constructor and pass it a plain old Javascript object as argument to cronstruct a typed record:

```Javascript
const r = Rec("{foo: "abc", bar: 123}");

r.foo; // "bar"
r.baz; // 123

r[TS]; // "{foo: String, bar: Number}"
```
Please note that empty records are not allowed.

### Mutations

Typed records are mutable but sealed, that is all properties are determined at declaration time:

```Javascript
const r = Rec("{foo: "abc", bar: 123}");

r.foo = "FOO"; // "FOO"
r.baz = true; // type error
```
As with typed arrays record fields must not change their type during mutation:

```Javascript
const r = Rec("{foo: "abc", bar: 123}");
r.foo = true; // type error
```
### Duck Typing

Since record types are sealed and you should know your types in the typed environemnt provided by ftor, there is no need for duck typing in conjunction with typed records. In fact, ftor raises an type error for any corresponding attempt:

```Javascript
const r = Rec("{foo: "abc", bar: 123}");
"foo" in r; // type error
```
### Function Passing

You can pass typed records to typed functions as usual:

```Javascript
const showName = Fun(
  "(showName :: {first: String, last: String} -> String)",
  person => `${person.first} ${person.last}`
);

const o = Rec({first: "John", last: "Doe"}),
  p = Rec({first: "John", last: null}),
  q = Rec({first: "John"}),

showName(o); // "John Doe"
showName(p); // type error
showName(q); // type error
```
So far all records have a static type, which makes their handling quite awkward:

```Javascript
const showName = Fun(
  "(showName :: {first: String, last: String} -> String)",
  person => `${person.first} ${person.last}`
);

const o = Rec({first: "John", last: "Doe", age: 30});
showName(o); // type error
```
As you can see typed records require exact type matches. That is, of course, intolerable.

### Row Polymorphism

Forunately, with row polymorphism there is a property that offers more flexibility:

```Javascript
const showName = Fun(
  "(showName :: {first: String, last: String, ..r} -> String)",
  o => `${o.first} ${o.last}`
);

const o = Rec({first: "John", last: "Doe", age: 30}),
  p = Rec({first: "Jane", last: "Doe", gender: "f"});

showName(o); // "John Doe"
showName(p); // "Jane Doe"
```
`r` is a so-called row variable, which includes the types of all unnecessary properties. Apart form that row variables act like any other type variable in a parametric polymorphic function type:

```Javascript
const showName = Fun(
  "(showName :: {first: String, last: String, ..r} -> {first: String, last: String, ..r} -> String)",
  o => p => `${o.first} ${p.last}`
);

const showName_ = Fun(
  "(showName_ :: {first: String, last: String, ..r} -> {first: String, last: String, ..s} -> String)",
  o => p => `${o.first} ${p.last}`
);

const o = Rec({first: "Sean", last: "Penn", age: 60}),
  p = Rec({first: "Juliette", last: "Binoche", age: 45}),
  q = Rec({first: "Stan", last: "Kubrick", gender: "m"});

showName(o) (p); // "Sean Binoche"
showName(o) (q); // type error

showName_(o) (p); // "Sean Binoche"
showName_(o) (q); // "Sean Kubrick"
```
Row polymorphism is also known as static duck typing, that is to say duck typing with static type guarantees.

## Typed Tuples

Since typed tuples share a lot of properties with typed records, I am going to focus on the differences.

### Construction

You can create a typed tuple by passing an array to the `Tup` constructor:

```Javascript
const t = Tup([123, "foo", true]);

t[0]; // 123
t[1]; // "foo"

t[TS]; // "[Number, String, Boolean]"
```
The type signature of typed tuples differs from that of typed arrays in that there are several fields. 

Please note that typed tuples must not be empty but have to contain at least 2 fields.

### Function Passing

You can pass typed tuples to typed functions as usual:

```Javascript
const fst = Fun(
  "(fst :: [a] -> a)",
  t => t[0]
);

const snd = Fun(
  "(snd :: [a] -> a)",
  t => t[1]
);

const t = Tup([123, "foo", true]);

fst(t); // 123
snd(t); // "foo"
```
## Algebraic Data Types

ADTs allow you to declare sums of products, that is you can declare sum types (aka tagged unions), product types and any combination of them. ftor uses Scott encoding to express sum types in Javascript and plain old Javascript objects for single constructor/field types.

Scott encoding entails somewhat scary type signatures. However, you can deduce them in a rather mechanical way, because their types have a recurring structure across different ADTs. Scott encoding is definitly worth the price, because it enables functional pattern matching.

### Single Constructor/Field Types

The `Reader` type is a common algebraic data type with a single data constructor and field. It uses the simple `Data1` constructor:

```Javascript
const Reader = Data1(
  function Reader() {}, "run",
  "(Reader :: (e -> a) -> Reader<e, a>)"
) (Reader => f => Reader(f));

const runReader = Fun(
  "(runReader :: Reader<e, a> -> e -> a)",
  tf => x => tf.run(x)
);

const tf = Reader(inc);

tf[TS]; // "Reader<Number, Number>"

runReader(tf) (5); // 6
runReader(tf) ("foo"); // type error
```
In case you're wondering, the applicative and monad instance of the `Reader` type is much more useful.

### Sum Types

The `Option` type is a simple sum type. It is constructed with `Type` and `Data`, which are the type and data constructor respectively. As opposed to `Reader` sum types are based on Scott encoding:

```Javascript
const Option = Type(
  function Option() {},
  "Option<a>",
  "({Some: (a -> r), None: r} -> r)"
);

const Some = Data(
  "(Some :: a -> Option<a>)",
  x => Option(cases => cases.Some(x))
);

const None = Option(cases => cases.None);

const runOption = Fun(
  "(runOption :: {Some: (a -> r), None: r} -> Option<a> -> r)",
  cases => tx => tx.run(cases)
);

const inc = Fun(
  "(Number -> Number)",
  n => n + 1
);

const safeInc = runOption(
  Rec({
    Some: inc,
    None: 0
  })
);

const brokenSafeInc = runOption(
  Rec({
    Some: inc,
    Foo: 0
  })
);

const tx = Some(5);
const ty = None;

safeInc(tx); // 6
safeInc(ty); // 0
brokenSafeInc(tx); // type error
```
### Sums of Products

`List` is both a sum (`Cons`/`Nil`) and a product, because `Cons` accepts more than one argument:

```Javascript
const List = Type(
  function List() {},
  "List<a>",
  "({Cons: (a -> List<a> -> r), Nil: r} -> r)"
);

const Cons = Data(
  "(Cons :: a -> List<a> -> List<a>)",
  x => tx => List(cases => cases.Cons(x) (tx))
);

const Nil = List(cases => cases.Nil);

const runList = Fun(
  "(runList :: {Cons: (a -> List<a> -> r), Nil: r} -> List<a> -> r)",
  cases => tx => tx.run(cases)
);

const empty = runList(
  Rec({
    Cons: F.Fun("(a -> List<a> -> Boolean)", x => tx => false),
    Nil: true
  })
);

const xs = Cons("foo") (Nil);
const ys = Nil;

empty(xs); // false
empty(ys); // true
```
Moreover, `List` is a recursive data type. You can easily define recursive and even mutual recursive types with Scott encoded ADTs.

# Missing Topics

- [ ] Explore issues caused by ftor's use of proxies with regard to object identity
- [ ] Note that creating dependencies to ftor's pluggable type system is bad
