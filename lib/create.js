/**
 * Create a ThePS instance
 * @function create
 * @param {...*} args
 * @returns {ThePS}
 */
'use strict'

const ThePS = require('./ThePS')

/** @lends create */
function create (...args) {
  return new ThePS(...args)
}

module.exports = create
