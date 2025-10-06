import { parentPort, workerData } from "worker_threads";

// Same heavy CPU function
function heavyTask(iterations) {
  let sum = 0;
  for (let i = 0; i < iterations; i++) {
    sum += i;
  }
  return sum;
}

const result = heavyTask(workerData);
parentPort.postMessage(result);