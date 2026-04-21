const cluster = require('cluster');
const os = require('os');

const cpuCount = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Master process ${process.pid} started`);
  console.log(`Spawning ${cpuCount} workers...`);

  for (let i = 0; i < cpuCount; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });

} else {
  console.log(`Worker ${process.pid} started`);
  require('./index.js');
}
