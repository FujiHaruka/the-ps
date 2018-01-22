/**
 * @class ThePS
 * @param {string} filename - PID filename
 * @param {Object} [options={}] - Optional settings
 * @param {boolean} [options.logEnabled=false] - Enable logs
 */
'use strict'

const path = require('path')
const mkdirp = require('mkdirp')
const fs = require('fs')
const npid = require('npid')
const terminate = require('terminate')

/** @lends ThePS */
class ThePS {

  constructor (filename = 'var/the.pid', options = {}) {
    const {logEnabled = false} = options
    this.filename = filename
    this.pid = null
    this.logEnabled = logEnabled
  }

  write () {
    const {filename} = this
    mkdirp.sync(path.dirname(filename))
    this.pid = npid.create(filename, true)
  }

  del () {
    const {pid} = this
    if (!pid) {
      return
    }
    pid.remove()
    this.pid = null
  }

  read () {
    const {filename} = this
    try {
      return String(fs.readFileSync(filename)).trim()
    } catch (e) {
      return null
    }
  }

  async shunt () {
    const pid = this.read()
    if (!pid) {
      return
    }
    return new Promise((resolve, reject) =>
      terminate(pid, (err) => err ? reject(err) : resolve(pid))
    )
  }

  log (...messages) {
    this.logEnabled && console.log(...messages)
  }

  async acquire () {
    try {
      const killed = await this.shunt()
      if (killed) {
        this.log(`[the-ps] Process killed:`, killed)
      }
    } catch (e) {
      // Do nothing
    }
    const {filename} = this
    this.write()
    this.log(`[the-ps] PID file created:`, path.relative(process.cwd(), filename))
    process.setMaxListeners(process.getMaxListeners() + 1)
    process.on('exit', () => {
      this.log(`[the-ps] PID file deleted:`, path.relative(process.cwd(), filename))
      this.del()
    })
  }
}

module.exports = ThePS
