import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { renderPage } from '../src/page.ts';

test('empty page has only the requested heading and no external assets', () => {
  const page = renderPage([]);
  assert.match(page, /<h1>second project<\/h1>/);
  assert.doesNotMatch(page, /<ul>|<script|<img/);
  assert.match(page, /<link rel="icon" href="data:,">/);
  assert.match(page, /<html lang="en">/);
  assert.match(page, /width=device-width, initial-scale=1/);
});

test('build preserves and links nested files with escaped labels and relative URLs', async () => {
  const scratch = resolve('test/scratch');
  await mkdir(scratch, { recursive: true });
  const output = await mkdtemp(join(scratch, 'export-'));
  const runBuild = () => execFileSync(process.execPath, ['scripts/build.mjs', output]);
  runBuild();
  assert.doesNotMatch(await readFile(join(output, 'index.html'), 'utf8'), /<ul>/);
  await mkdir(join(output, 'line-1', 'nested'), { recursive: true });
  const names = ['read me #1.txt', 'nested/<report>&".txt', 'résumé.txt'];
  for (const name of names) await writeFile(join(output, 'line-1', name), name);
  runBuild();
  const page = await readFile(join(output, 'index.html'), 'utf8');
  assert.equal((page.match(/<li>/g) ?? []).length, names.length);
  assert.match(page, /&lt;report&gt;&amp;&quot;/);
  for (const name of names) {
    const href = './line-1/' + name.split('/').map(encodeURIComponent).join('/');
    assert.ok(page.includes(`href="${href}"`));
    assert.equal(await readFile(resolve(output, decodeURIComponent(href)), 'utf8'), name);
  }
  runBuild();
  assert.equal(await readFile(join(output, 'index.html'), 'utf8'), page);
});
