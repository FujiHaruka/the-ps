/**
 * As pon task
 */
'use strict'

const thePS = require('./lib/create')

function thePSTask (dirname) {
  return async function task (ctx) {
    await thePS(dirname).acquire()
  }
}

module.exports = thePSTask
