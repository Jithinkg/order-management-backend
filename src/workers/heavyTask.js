const { workerData, parentPort } = require('worker_threads');

// Simulate heavy CPU work — counts to a large number
const { limit } = workerData;

let count = 0;
for (let i = 0; i < limit; i++) {
  count++;
}

// Send result back to main thread
parentPort.postMessage({ result: count });
