
// Web Worker for mining tokens
import { sha256 } from 'js-sha256';

// Mining state
let running = false;
let hashesComputed = 0;
let startTime = Date.now();
let lastReportTime = Date.now();
let targetPrefix = '';
let blockData = '';

// Function to mine a block with a given difficulty
const mineBlock = (blockData: string, targetPrefix: string) => {
  let nonce = 0;
  let hash = '';
  
  // Start mining
  running = true;
  startTime = Date.now();
  lastReportTime = Date.now();
  hashesComputed = 0;
  
  // Report progress function
  const reportProgress = () => {
    const currentTime = Date.now();
    const timeElapsed = (currentTime - startTime) / 1000; // in seconds
    const timeSinceLastReport = (currentTime - lastReportTime) / 1000; // in seconds
    
    // Calculate hash rate
    const hashRate = hashesComputed / timeElapsed;
    
    // Send progress update to main thread
    self.postMessage({
      type: 'progress',
      hashRate,
      hashesComputed,
      timeElapsed,
      nonce
    });
    
    lastReportTime = currentTime;
  };
  
  // Set up progress reporting interval
  const progressInterval = setInterval(() => {
    if (running) {
      reportProgress();
    } else {
      clearInterval(progressInterval);
    }
  }, 1000);
  
  // Mining loop
  while (running) {
    // Prepare data with nonce
    const dataWithNonce = `${blockData}|${nonce}`;
    
    // Compute hash
    hash = sha256(dataWithNonce);
    hashesComputed++;
    
    // Check if hash matches target prefix
    if (hash.startsWith(targetPrefix)) {
      // Found a valid hash!
      running = false;
      clearInterval(progressInterval);
      
      // Report final stats
      const timeElapsed = (Date.now() - startTime) / 1000; // in seconds
      
      // Send success message to main thread
      self.postMessage({
        type: 'success',
        hash,
        nonce,
        timeElapsed,
        hashesComputed,
        blockData: dataWithNonce
      });
      
      // Exit mining loop
      break;
    }
    
    // Try next nonce
    nonce++;
    
    // Every 10,000 hashes, check if we should continue and report progress
    if (hashesComputed % 10000 === 0) {
      // Yield to allow messages to be processed
      // This is a trick to allow the worker to process messages
      setTimeout(() => {}, 0);
    }
  }
  
  // If mining was stopped before finding a valid hash
  if (!running) {
    clearInterval(progressInterval);
    reportProgress();
  }
};

// Message handler
self.onmessage = (e) => {
  const data = e.data;
  
  if (data.type === 'stop') {
    // Stop mining
    running = false;
  } else {
    // Start mining with provided parameters
    blockData = data.blockData || '';
    targetPrefix = data.targetPrefix || '0000';
    
    // Start mining
    mineBlock(blockData, targetPrefix);
  }
};

export {};
