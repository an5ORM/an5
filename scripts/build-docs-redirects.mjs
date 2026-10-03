import fs from 'node:fs';
import path from 'node:path';

const output = process.argv[2] || '_site';
const guides = ['agent-tools', 'api-reference', 'architecture', 'browser-support', 'cli', 'configuration', 'crud', 'deployment', 'examples', 'feature-status', 'getting-started', 'queries', 'relations', 'schema', 'transactions', 'troubleshooting', 'vector-search', 'vscode-mcp'];
const routes = ['', 'architecture/', 'genkit/', ...guides.map(g => `guides/${g}/`)];
for (const code of ['typescript', 'python', 'dotnet', 'golang', 'rust', '{code}']) {
  for (const provider of code === '{code}' ? ['{provider}'] : ['sqlserver', 'postgresql', 'mysql', 'sqlite', 'googlesheets', 'nbase']) {
    for (const guide of ['queries', 'vector-search']) routes.push(`${code}/${provider}/guides/${guide}/`);
  }
}
function page(route, fallback = false) {
  const target = `https://an5orm.github.io/docs/${route}`;
  return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AN5 documentation has moved</title><meta name="google-site-verification" content="YPl9-lLljuNKiIdvvjlQomRtiXDxEnY8twmu1QIPFis"><link rel="canonical" href="${target}"><meta http-equiv="refresh" content="0;url=${target}"><p>Documentation has moved to <a href="${target}">${target}</a>.</p><script>location.replace(${fallback ? "'https://an5orm.github.io/docs/' + location.pathname.replace(/^\\/an5\\/?/, '')" : JSON.stringify(target)} + location.search + location.hash);</script></html>`;
}
for (const route of routes) {
  const dir = path.join(output, route);
  fs.mkdirSync(dir, {recursive: true});
  fs.writeFileSync(path.join(dir, 'index.html'), page(route));
}
fs.writeFileSync(path.join(output, '404.html'), page('', true));
fs.writeFileSync(path.join(output, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: https://an5orm.github.io/docs/sitemap.xml\n');
fs.writeFileSync(path.join(output, '.nojekyll'), '');
console.log(`Generated ${routes.length} legacy documentation redirects.`);
