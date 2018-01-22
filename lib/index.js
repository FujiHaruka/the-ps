/**
 * Process mamager for the-framework
 * @module the-ps
 */
'use strict'

const _d = (m) => 'default' in m ? m.default : m

const ThePS = _d(require('./ThePS'))
const create = _d(require('./create'))

module.exports = {
  ThePS,
  create,
  default: create,
}
