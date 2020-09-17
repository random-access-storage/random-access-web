var test = require('random-access-test')
const RAW = require('./')
const tape = require('tape')
const hyperdrive = require('hyperdrive')

const storage = RAW('tests-' + Math.random())

test(
  function (name, options, callback) {
    callback(storage(name, options))
  },
  {
    // Choose which test to exercise
    reopen: true, // tests that re-open same file (not applicable to ram)
    content: false, // tests that populates with options.content
    del: true, // tests that excersise advisory del API
    writable: true, // tests that excersise open with `options.writable`
    size: true, // tests that excersise open with `options.size`
    truncate: false // tests that excersise open with `options.truncate`
  }
)

tape('Works with hyperdrive', (t) => {
  const storage = RAW('tests-hyperdrive-' + Math.random())

  const archive = hyperdrive(storage)

  archive.writeFile('/example.txt', 'Hello World!', (err) => {
    t.notOk(err, 'able to write')
    archive.readFile('/example.txt', 'utf8', (err2, result) => {
      t.notOk(err2, 'able to read')
      t.equals(result, 'Hello World!')
      t.end()
    })
  })
})
