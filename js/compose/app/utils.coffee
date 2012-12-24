utils =
  doSeveralTimes: (cb, resultCb, times=10, interval=300)->
    tm = null
    func = ->
      res = cb()
      if res or times < 1
        clearInterval tm
        resultCb?(!res)
      else
        times--
    tm = setInterval func, interval

  uniqueId: do()->
    c = 0
    (prefix='uniq')-> prefix + (c++)



module.exports = utils