import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const target = new URL('../node_modules/astro/dist/core/create-vite.js', import.meta.url);
const before = '      astroDevToolbar({ settings, logger }),';
const after = '      settings.config.devToolbar.enabled && astroDevToolbar({ settings, logger }),';

if (!existsSync(target)) {
  process.exit(0);
}

const source = readFileSync(target, 'utf8');

if (source.includes(after)) {
  process.exit(0);
}

if (!source.includes(before)) {
  console.warn('Astro dev toolbar patch skipped: target pattern was not found.');
  process.exit(0);
}

writeFileSync(target, source.replace(before, after));
