const global = typeof window !== 'undefined' ? window : self

const DEFAULT_DB_NAME = 'random-access-web'

async function init (options) {
  if (typeof options === 'string') options = { name: options }

  const candidates = [
    buildChromeFileStorage,
    buildIDBMutableFileStorage,
    buildIDBStorage,
    buildMemoryStorage
  ]

  let storage = null
  for (const candidate of candidates) {
    storage = await candidate(options)
    if (storage) return storage
  }

  throw new Error('Unable to build Web Storage')
}

async function buildChromeFileStorage () {
  const requestFileSystem =
    global.requestFileSystem || global.webkitRequestFileSystem
  if (!requestFileSystem) return null

  // FIX: catch when user does not grant permissions
  return require('random-access-chrome-file')
}

async function buildIDBMutableFileStorage (options) {
  const mutableFile = global.IDBMutableFile
  if (!mutableFile) return null

  const randomaccess = require('@sammacbeth/random-access-idb-mutable-file')

  return randomaccess.mount()
}

async function buildIDBStorage (options) {
  try {
    const name = options.name || DEFAULT_DB_NAME
    return require('random-access-idb')(name)
  } catch (err) {
    return null
  }
}

async function buildMemoryStorage () {
  return require('random-access-memory')()
}

module.exports = init
