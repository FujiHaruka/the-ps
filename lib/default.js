/**
 * Default exports
 * @module default
 */
'use strict'

const acquire = require('./acquire')
const create = require('./create')
const ThePS = require('./ThePS')

const lib = create.bind(create)

// `module.exports` overrides these `exports.*`, but still needs them for lebab (https://github.com/lebab/lebab)
exports.ThePS = ThePS
exports.create = create

module.exports = Object.assign(lib, {
  ThePS,
  acquire,
})
