var pull     = require('pull-stream')
var defer    = require('pull-defer')
var Readable = require('stream').Readable
var duplex   = require('../')

var test = require('tape')

test('backpressure', function (t) {

  t.plan(10)

  var s = duplex(
    pull.asyncMap(function (e, cb) {
      setTimeout(function () {
        cb(null, e.toString() + '\n')
      }, 10)
    })
  )

  s.on('data', function (c) {
    t.ok(c, 'data')
  })

  s.once('end', function () {
    t.ok(true, 'end')
  })


  var i = 0
  var r = new Readable({
    read: function (size) {
      // this stream generates 10 elements and ends
      // with a delay of 10ms after the first read

      var self = this
      while (i <= 10) {
        run(i)
        i++
      }

      function run (j) {
        setTimeout(function () {
          if (j === 10) {
            self.push(null)
          } else {
            self.push(new Buffer(i + '-hello'))
          }
        }, 10)
      }
    }
  })

  r.pipe(s)
})
