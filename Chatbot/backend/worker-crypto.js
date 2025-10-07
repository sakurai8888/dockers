import { pbkdf2Sync } from "crypto";
import { parentPort, workerData } from "worker_threads";

const { iterations, salt } = workerData;

function heavyCrypto(iter, s) {
  return pbkdf2Sync("topsecret", s, iter, 64, "sha512").toString("hex");
}

// perform the computation
const result = heavyCrypto(iterations, salt);

// send result back
parentPort.postMessage(result);