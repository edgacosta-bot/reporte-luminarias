const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

const includeExt = new Set(['.html', '.js', '.json']);
const ignoreDirs = new Set(['.git', 'node_modules', 'security', 'scripts']);
const ignoreFiles = new Set(['env.js']);

const checks = [
  {
    id: 'supabase-url-hardcoded',
    regex: /https:\/\/[a-z0-9-]+\.supabase\.co/gi,
    message: 'URL de Supabase hardcodeada',
  },
  {
    id: 'jwt-like-hardcoded',
    regex: /eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/g,
    message: 'Token/JWT potencial hardcodeado',
  },
  {
    id: 'placeholder-anon-key',
    regex: /TU_ANON_KEY|your_anon_key_here|your_supabase_anon_key_here/g,
    message: 'Placeholder de llave no reemplazado',
  },
  {
    id: 'direct-supabase-create-client',
    regex: /supabase\s*\.\s*createClient\s*\(/g,
    message: 'Uso directo de supabase.createClient (usar createSupabaseClient)',
  },
  {
    id: 'window-supabase-create-client',
    regex: /window\s*\.\s*supabase\s*\.\s*createClient\s*\(/g,
    message: 'Uso directo de window.supabase.createClient (usar createSupabaseClient)',
  },
];

function walk(dir, out) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('.DS_Store')) continue;
    const abs = path.join(dir, entry.name);
    const rel = path.relative(root, abs);

    if (entry.isDirectory()) {
      if (ignoreDirs.has(entry.name)) continue;
      walk(abs, out);
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    if (!includeExt.has(ext)) continue;
    if (ignoreFiles.has(entry.name)) continue;

    out.push({ abs, rel });
  }
}

function lineOf(content, index) {
  return content.slice(0, index).split(/\r?\n/).length;
}

const files = [];
walk(root, files);

const findings = [];
for (const file of files) {
  const content = fs.readFileSync(file.abs, 'utf8');
  for (const check of checks) {
    check.regex.lastIndex = 0;
    let match;
    while ((match = check.regex.exec(content)) !== null) {
      if (file.rel === 'auth.js' && check.id === 'direct-supabase-create-client') {
        continue;
      }

      findings.push({
        file: file.rel,
        line: lineOf(content, match.index),
        id: check.id,
        message: check.message,
      });
    }
  }
}

if (findings.length === 0) {
  console.log('Security scan OK: no findings');
  process.exit(0);
}

console.error('Security scan FAILED: se encontraron riesgos');
for (const f of findings) {
  console.error(`- ${f.file}:${f.line} [${f.id}] ${f.message}`);
}

process.exit(1);
