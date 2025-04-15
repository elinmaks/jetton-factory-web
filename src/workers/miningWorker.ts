
// Mining worker implementing SHA-256 for Proof of Work
// Based on the hashcash algorithm

self.onmessage = (e: MessageEvent) => {
  const { blockData, difficulty, targetPrefix, nonce } = e.data;
  
  if (e.data.type === 'stop') {
    self.postMessage({ type: 'stopped' });
    return;
  }
  
  let currentNonce = nonce || 0;
  const startTime = performance.now();
  let hashesComputed = 0;
  const hashesPerUpdate = 1000; // Report hashrate every 1000 hashes
  
  // Mining loop
  while (true) {
    // Check if we should stop or pause every few iterations
    if (hashesComputed % 1000 === 0) {
      // Small delay to allow for UI updates and prevent freezing
      setTimeout(() => {
        mine();
      }, 0);
      return;
    }
    
    const result = computeHash(blockData, currentNonce);
    hashesComputed++;
    
    // Check if we found a valid hash
    if (result.hash.startsWith(targetPrefix)) {
      // Success! Send the result back
      self.postMessage({
        type: 'success',
        hash: result.hash,
        nonce: currentNonce,
        hashesComputed,
        timeElapsed: performance.now() - startTime
      });
      return;
    }
    
    // Report progress regularly
    if (hashesComputed % hashesPerUpdate === 0) {
      const timeElapsed = performance.now() - startTime;
      const hashRate = hashesComputed / (timeElapsed / 1000);
      
      self.postMessage({
        type: 'progress',
        hashesComputed,
        timeElapsed,
        hashRate,
        currentNonce
      });
    }
    
    currentNonce++;
  }
  
  function mine() {
    let localHashesComputed = 0;
    const localStartTime = performance.now();
    
    while (localHashesComputed < hashesPerUpdate) {
      const result = computeHash(blockData, currentNonce);
      localHashesComputed++;
      
      // Check if we found a valid hash
      if (result.hash.startsWith(targetPrefix)) {
        // Success!
        self.postMessage({
          type: 'success',
          hash: result.hash,
          nonce: currentNonce,
          hashesComputed: hashesComputed + localHashesComputed,
          timeElapsed: performance.now() - startTime
        });
        return;
      }
      
      currentNonce++;
    }
    
    // Update total hashes
    hashesComputed += localHashesComputed;
    
    // Report progress
    const totalTimeElapsed = performance.now() - startTime;
    const hashRate = hashesComputed / (totalTimeElapsed / 1000);
    
    self.postMessage({
      type: 'progress',
      hashesComputed,
      timeElapsed: totalTimeElapsed,
      hashRate,
      currentNonce
    });
    
    // Continue mining
    setTimeout(() => {
      mine();
    }, 0);
  }
};

// SHA-256 hash computation
function computeHash(data: string, nonce: number): { hash: string, nonce: number } {
  const input = `${data}${nonce}`;
  const hashBuffer = sha256(input);
  const hashHex = bufferToHex(hashBuffer);
  
  return {
    hash: hashHex,
    nonce
  };
}

// Simple SHA-256 implementation
function sha256(data: string): ArrayBuffer {
  // Convert string to UTF-8 encoded array
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  
  // Create a hash and return the buffer
  const hashBuffer = crypto.subtle.digestSync('SHA-256', dataBuffer);
  return hashBuffer;
}

// Convert buffer to hex string
function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Polyfill for crypto.subtle.digestSync which doesn't exist
// This is a synchronous version for the worker
const crypto = {
  subtle: {
    digestSync: (algorithm: string, data: Uint8Array): ArrayBuffer => {
      // In a real implementation, we would use the actual Web Crypto API
      // But for now, we'll use a placeholder that would be replaced with a proper synchronous hash function
      // in a production environment, you'd use a proper crypto library
      
      // For now, we're creating a mock hash based on the input data
      // This is NOT secure and only for demonstration
      let hash = new Uint8Array(32); // 32 bytes = 256 bits
      
      // Generate a deterministic hash based on the data
      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        sum = (sum + data[i]) % 256;
      }
      
      // Fill the hash with a pattern based on the data
      for (let i = 0; i < 32; i++) {
        hash[i] = (sum + i * data.length) % 256;
      }
      
      return hash.buffer;
    }
  }
}
