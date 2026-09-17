#!/usr/bin/env node
/**
 * Scans /public/her-tech-era-photos/ for image files and writes a JSON manifest.
 * Run manually or add to your build/dev scripts:
 *   node scripts/generate-gallery-manifest.js
 *
 * Supported formats: .jpg, .jpeg, .png, .webp, .avif, .gif, .svg
 * HEIC files are skipped (not browser-compatible).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PHOTOS_DIR = path.resolve(__dirname, '../public/her-tech-era-photos');
const MANIFEST_PATH = path.resolve(PHOTOS_DIR, 'manifest.json');
const SUPPORTED_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.svg']);

function scanDir(dir, basePath = '') {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      results.push(...scanDir(fullPath, path.join(basePath, entry.name)));
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (SUPPORTED_EXTS.has(ext)) {
        const relativePath = basePath ? `${basePath}/${entry.name}` : entry.name;
        results.push(relativePath);
      }
    }
  }

  return results.sort();
}

const images = scanDir(PHOTOS_DIR);
fs.writeFileSync(MANIFEST_PATH, JSON.stringify(images, null, 2) + '\n');
console.log(`✅ Gallery manifest: ${images.length} image(s) → ${MANIFEST_PATH}`);
