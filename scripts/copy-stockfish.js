const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const srcDir = path.join(root, 'node_modules', 'stockfish.js');
const destDir = path.join(root, 'public', 'stockfish');

const files = ['stockfish.js', 'stockfish.wasm'];

if (!fs.existsSync(srcDir)) {
  console.warn('[copy-stockfish] stockfish.js not installed.');
  process.exit(0);
}

fs.mkdirSync(destDir, { recursive: true });

for (const file of files) {
  const src = path.join(srcDir, file);
  const dest = path.join(destDir, file);
  fs.copyFileSync(src, dest);
}

console.log('[copy-stockfish] Copied Stockfish files to public/stockfish.');
