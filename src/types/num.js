"use strict";


/**
 * @name number
 * @note contract
 * @type action
 * @status stable
 * @todo replace with sum type
 * @example

  @see handleFun

 */


// Number -> Number|TypeError String [?]
const num = x => typeof x === "number" ? x : Err(TypeError) ("", "number", typeof x);


// API


module.exports = num;