const global = (typeof window !== 'undefined') ? window : self;

const requestFileSystem = global.requestFileSystem || global.webkitRequestFileSystem
const mutableFile = global.IDBMutableFile

if(requestFileSystem) {
  module.exports = require('random-access-chrome-file')
}  else if(mutableFile) {
  module.exports = require('@sammacbeth/random-access-idb-mutable-file')
} else {
  module.exports = require('random-access-idb')
}
