import { cpSync, mkdirSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = resolve(root, 'dist');
const publicFiles = ['index.html', 'app.js', 'data.js', 'tokens.css', 'base.css', 'style.css', 'assets'];
rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });
for (const name of publicFiles) cpSync(resolve(root, name), resolve(output, name), { recursive: true });
console.log('Static site prepared in dist/ (public application files only).');
