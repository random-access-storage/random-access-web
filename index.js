const global = (typeof window !== 'undefined') ? window : self;

const requestFileSystem = global.requestFileSystem || global.webkitRequestFileSystem
const mutableFile = global.IDBMutableFile

const DEFAULT_DB_NAME = 'random-access-web'

let init = async (options={}) => {
  if(typeof options === 'string') options = {name: options}
  const name = options.name || DEFAULT_DB_NAME
  return require('random-access-idb')(name)
}

if(requestFileSystem) {
  init = async (options) => {
    return require('random-access-chrome-file')
  }
} else if(mutableFile) {
  init = async (options) => {
    const RandomAccess = require('@sammacbeth/random-access-idb-mutable-file')

    return RandomAccess.mount()
  }
}

module.exports = {
  init
}
