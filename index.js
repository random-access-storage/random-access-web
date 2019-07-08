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
    return mutableStorage(options)
  }
} else if (idb) {
  storage = (options = {}) => {
    if (typeof options === 'string') options = { name: options }
    const name = options.name || DEFAULT_DB_NAME
    return require('random-access-idb')(name, options)
  }
}

module.exports = storage

function mutableStorage (options) {
  const randomAccess = require('random-access-storage')
  const mutableAccess = require('random-access-idb-mutable-file')

  let mounted = null
  let loading = null

  function doMount () {
    return mutableAccess.mount(options).then((requestFile) => {
      mounted = requestFile
      loading = null
    })
  }

  return (name) => {
    let file = null

    return randomAccess({
      open: function (req) {
        if (!mounted) {
          loading = doMount()
        }
        if (loading) {
          loading.then(() => {
            this._open(req)
          }, (err) => {
            req.callback(err)
          })
          return
        }

        file = mounted(name)

        file._open(req)
      },
      openReadonly: function (req) {
        if (!mounted) {
          loading = doMount()
        }
        if (loading) {
          loading.then(() => {
            this._openReadonly(req)
          }, (err) => {
            req.callback(err)
          })
          return
        }

        file = mounted(name)

        file._openReadonly(req)
      },
      write: function (req) {
        file._write(req)
      },
      read: function (req) {
        file._read(req)
      },
      del: function (req) {
        file._del(req)
      },
      stat: function (req) {
        file._stat(req)
      },
      close: function (req) {
        file._close(req)
      },
      destroy: function (req) {
        file._destroy(req)
      }
    })
  }
}
