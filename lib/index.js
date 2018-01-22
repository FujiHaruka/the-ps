/**
 * Process manager for the-framework
 * @module the-ps
 */
'use strict'

const _d = (m) => 'default' in m ? m.default : m

const ThePS = _d(require('./ThePS'))
const acquire = _d(require('./acquire'))
const create = _d(require('./create'))

module.exports = {
  ThePS,
  acquire,
  create,
  default: create,
}
