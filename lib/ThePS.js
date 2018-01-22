/**
 * @class ThePS
 * @param {string} filename - PID filename
 * @param {Object} [options={}] - Optional settings
 * @param {boolean} [options.logging=false] - Enable logs
 */
'use strict'

const path = require('path')
const mkdirp = require('mkdirp')
const fs = require('fs')
const npid = require('npid')
const terminate = require('terminate')
const {isProduction} = require('the-check')
const yesno = require('yesno')

/** @lends ThePS */
class ThePS {

  constructor (filename = 'var/the.pid', options = {}) {
    const {
      logging = !isProduction(),
      killPolicy = 'ask',
    } = options
    this.filename = filename
    this.pid = null
    this.logging = logging
    this.killPolicy = killPolicy
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

  async kill (pid) {
    return new Promise((resolve, reject) =>
      terminate(pid, (err) => err ? reject(err) : resolve(pid))
    )
  }

  log (...messages) {
    this.logging && console.log(...messages)
  }

  async canKill (pid) {
    switch (this.killPolicy) {
      case 'never':
        return false
      case 'ask': {
        return await new Promise((resolve) =>
          yesno.ask(`[the-ps] There is another process (pid: ${pid}) exists. Do you want to kill it? [y/n]`, false, (res) => resolve(res))
        )
      }
      default:
        return true
    }
  }

  /**
   * Generate pid and remove on exit.
   * @returns {Promise<void>}
   */
  async acquire () {
    const pid = this.read()
    if (pid) {
      const isMe = String(pid) !== String(process.pid)
      if (isMe) {
        return
      }
      const abort = !(await this.canKill(pid))
      if (abort) {
        console.error(`[the-ps] Failed to acquire`)
        process.exit(1)
      }
      try {
        const killed = await this.kill(pid)
        if (killed) {
          this.log(`[the-ps] Process killed:`, killed)
        }
      } catch (e) {
        // Do nothing
      }
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
