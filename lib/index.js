/**
 * Process mamager for the-framework
 * @module the-ps
 */
'use strict'

const _d = (m) => 'default' in m ? m.default : m

const ThePs = _d(require('./ThePs'))
const create = _d(require('./create'))

module.exports = {
  ThePs,
  create,
  default: create,
}
