import { mkdir, readdir, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { renderPage } from '../src/page.ts';

const output = resolve(process.argv[2] ?? 'dist');

async function listFiles(directory, prefix = '') {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
  const files = [];
  for (const entry of entries) {
    const name = prefix + entry.name;
    if (entry.isDirectory()) {
      files.push(...await listFiles(join(directory, entry.name), name + '/'));
    } else if (entry.isFile()) {
      files.push(name);
    }
  }
  return files.sort();
}

const files = await listFiles(join(output, 'line-1'));
await mkdir(output, { recursive: true });
await writeFile(join(output, 'index.html'), renderPage(files));
console.log(`Built ${join(output, 'index.html')}; listed ${files.length} files. Existing files preserved.`);
