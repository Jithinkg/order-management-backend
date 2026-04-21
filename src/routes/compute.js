const express = require('express');
const router = express.Router();
const { Worker } = require('worker_threads');
const path = require('path');

// BAD — blocks the event loop
router.get('/blocking', (req, res) => {
  let count = 0;
  for (let i = 0; i < 5_000_000_000; i++) {
    count++;
  }
  res.json({ result: count });
});

// GOOD — offloads to worker thread
router.get('/non-blocking', (req, res) => {
  const worker = new Worker(
    path.join(__dirname, '../workers/heavyTask.js'),
    { workerData: { limit: 5_000_000_000 } }
  );

  worker.on('message', (data) => {
    res.json({ result: data.result });
  });

  worker.on('error', (err) => {
    res.status(500).json({ message: err.message });
  });
});

module.exports = router;
