/**
 * Starts the API (port 8787) and the website (port 8080) together:  npm run dev:all
 * Ctrl+C stops both.
 */
import { spawn } from 'node:child_process';

const run = (name, args) => {
  const p = spawn(process.execPath, args, { stdio: 'inherit' });
  p.on('exit', (code) => {
    console.log(`[${name}] exited with ${code}`);
    for (const other of procs) if (other !== p) other.kill();
    process.exit(code ?? 0);
  });
  return p;
};

const procs = [run('api', ['server/local.js']), run('web', ['node_modules/vite/bin/vite.js'])];
process.on('SIGINT', () => procs.forEach((p) => p.kill()));
