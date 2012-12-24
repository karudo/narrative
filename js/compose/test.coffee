async = require 'async'

a =
  q: 1
  w: 2
  e: 3


async.map a, ((i, cb)-> cb no, i*2), (err, r)-> console.log r