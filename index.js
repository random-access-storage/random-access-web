/* global self */
const global = (typeof window !== 'undefined') ? window : self

const requestFileSystem = global.requestFileSystem || global.webkitRequestFileSystem
const mutableFile = global.IDBMutableFile
const idb = global.indexedDB

const DEFAULT_DB_NAME = 'random-access-web'

let storage = () => require('random-access-memory')

if (requestFileSystem) {
  storage = (options) => {
    const RACF = require('random-access-chrome-file')
    if ((typeof options === 'object') && options.maxSize) {
      RACF.DEFAULT_MAX_SIZE = options.maxSize
    }

    return RACF
  }
} else if (mutableFile) {
  storage = (options = {}) => {
    if (typeof options === 'string') options = { name: options }
    return require('./mutable-file-wrapper.js')(options)
  }
} else if (idb) {
  storage = (options = {}) => {
    if (typeof options === 'string') options = { name: options }
    const name = options.name || DEFAULT_DB_NAME
    return require('random-access-idb')(name, options)
  }
}

module.exports = storage
