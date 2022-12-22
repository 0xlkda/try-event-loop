const {
  pool,
  log,
  sync,
  worker,
  genID,
  promiseDoneAfter,
  elapsedTime,
} = require("./helpers")

// TRY EVENT LOOP NON_BLOCKING & BLOCKING
const USE_SYNC = process.argv[2] === 'sync'
const CONNECTIONS = 8
const FAKE_PROMISE_WAIT_MS = 500
const APP_TIME = Date.now()
const createConnectionList = (num) => Array(num).fill(true)

function job(id = genID(), invokeTime = Date.now()) {
  USE_SYNC
    ? sync(id, invokeTime)
    : worker(id, invokeTime)

  promiseDoneAfter(FAKE_PROMISE_WAIT_MS)
    .then(() => log(`PROMISE\t${id} TAKEN ${elapsedTime(APP_TIME)}ms`))
}

;(async function () {
  console.log(`[START REQUEST] use sync ${USE_SYNC}`)
  const connections = createConnectionList(CONNECTIONS).map(() => Promise.resolve(job()))
  await Promise.all(connections)
  console.log(`[END REQUEST]\tTAKEN ${elapsedTime(APP_TIME)}ms`)
})()
