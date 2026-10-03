import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const files = execFileSync('rg', ['--files', '--hidden', '-g', '*[Rr][Ee][Aa][Dd][Mm][Ee]*', ...['node_modules', '.git', 'target', 'dist', 'bin', 'obj', '_site'].map(dir => '-g=!**/' + dir + '/**')], {encoding:'utf8'}).trim().split('\n').filter(file => /^readme(?:\.|$)/i.test(path.basename(file))).sort();
const entries = [];
for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');
  const images = [...source.matchAll(/!\[[^\]]*\]\(([^\s)]+)(?:\s+"[^"]*")?\)|<img\b[^>]*\bsrc=["']([^"']+)["']/gi)];
  for (const match of images) {
    const url = (match[1] || match[2]).replaceAll('&amp;', '&');
    entries.push({file, line: source.slice(0, match.index).split('\n').length, url, badge: /shields\.io|badgen\.net|\/badge(?:\.svg|s?\/)/i.test(url)});
  }
}
const remote = new Map();
const requests = [...new Set(entries.map(e => e.url).filter(url => /^https?:\/\//.test(url)))];
const results = await Promise.allSettled(requests.map(async url => {
  const response = await fetch(url, {signal: AbortSignal.timeout(20000)});
  const type = response.headers.get('content-type') || '';
  const svg = type.includes('svg') ? await response.text() : '';
  const title = svg.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
  const error = !response.ok ? `HTTP ${response.status}` : !type.startsWith('image/') ? `Unexpected content type ${type}` : /badge not found|retired badge|inaccessible|invalid|rate limited|resource not found|no releases|no result|not available/i.test(title || svg.match(/aria-label="([^"]*)"/)?.[1] || '') ? `Badge service error: ${title}` : undefined;
  return {status:response.status, title, error};
}));
results.forEach((result, index) => remote.set(requests[index], result.status === 'fulfilled' ? result.value : {error:result.reason.message}));
for (const entry of entries) {
  if (remote.has(entry.url)) Object.assign(entry, remote.get(entry.url));
  else if (!entry.url.startsWith('data:') && !fs.existsSync(path.resolve(path.dirname(entry.file), entry.url.split('#')[0]))) entry.error = 'Local image missing';
}
const report = {readmes:files.length, badges:entries.filter(e=>e.badge).length, images:entries.length, failures:entries.filter(e=>e.error).length, files:files.map(file=>({file,badges:entries.filter(e=>e.file===file&&e.badge).length})), entries};
if (process.argv.includes('--json')) console.log(JSON.stringify(report, null, 2));
else {
  console.log(`${report.readmes} README files; ${report.badges} badges; ${report.images} images; ${report.failures} failures`);
  for (const entry of entries) console.log(`${entry.error ? 'FAIL' : 'OK'} ${entry.file}:${entry.line} ${entry.title || entry.url}${entry.error ? ' — '+entry.error : ''}`);
}
if (report.failures) process.exitCode = 1;
