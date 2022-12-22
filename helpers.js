const log = console.log

function blockCPU(ms, markedTime = Date.now()) {
  while (Date.now() - markedTime < ms) {
    // lock
  }
}

let _index = 1
function genID() {
  return _index++
}

function elapsedTime(markedTime = Date.now()) {
  return Date.now() - markedTime
}

function promiseDoneAfter(ms) {
  return new Promise((resolve) => setTimeout(() => resolve(), ms))
}

const BLOCK_TIME = 1000
const workerpool = require("workerpool")
const pool = workerpool.pool({
  workerType: 'thread'
})

function sync(id, invokeTime) {
  blockCPU(BLOCK_TIME, invokeTime)
  log(`IO\t${id} TAKEN ${elapsedTime(invokeTime)}ms`)
}

function worker(id, invokeTime) {
  pool
    .exec(blockCPU, [BLOCK_TIME, invokeTime])
    .then(() => log(`IO\t${id} TAKEN ${elapsedTime(invokeTime)}ms`))
    .catch((err) => log(err.message))
    .then(() => {
      if (pool.stats().pendingTasks === 0) {
        pool.terminate()
      }
    })
}

module.exports = {
  pool,
  log,
  genID,
  elapsedTime,
  promiseDoneAfter,
  sync,
  worker,
}
