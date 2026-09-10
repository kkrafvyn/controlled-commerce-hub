import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const require = createRequire(import.meta.url);

// Use generated auth confirmation as the live visual source of truth.
const source = fs.readFileSync(path.join(root, 'supabase/templates/confirmation.html'), 'utf8');
const preview = source
  .replaceAll('{{ .ConfirmationURL }}', 'https://www.ajynworld.com/auth?verified=1')
  .replace(
    '<body class="body ajyn-body-bg ajyn-font-sans"',
    '<body class="body ajyn-body-bg ajyn-font-sans"',
  );

const outDir = path.join(root, 'docs/security');
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, 'email-template-preview.html');
fs.writeFileSync(outPath, preview, 'utf8');
console.log(outPath);
