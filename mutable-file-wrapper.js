
module.exports = function mutableStorage (options) {
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
        if (!mounted && !loading) {
          loading = doMount()
        }
        if(loading) {
          loading.then(() => {
            this._open(req)
          }, (err) => {
            req.callback(err)
          })
          return
        }

        file = mounted(name)

        req.callback()
      },
      write: function (req) {
        file.write(req.offset, req.data, function(err, data) {
          req.callback(err, data)
        })
      },
      read: function (req) {
        file.read(req.offset, req.size,  function(err, data) {
          req.callback(err, data)
        })
      },
      del: function (req) {
        file.del(req.offset, req.size,  function(err, data) {
          req.callback(err, data)
        })
      },
      stat: function (req) {
        file.stat( function(err, data) {
          req.callback(err, data)
        })
      },
      close: function (req) {
        file.close( function(err, data) {
          req.callback(err, data)
        })
      },
      destroy: function (req) {
        file.destroy( function(err, data) {
          req.callback(err, data)
        })
      }
    })
  }
}
