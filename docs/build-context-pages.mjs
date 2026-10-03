import fs from 'node:fs';

export const languages = {typescript: 'TypeScript', python: 'Python', dotnet: '.NET (C#)', golang: 'Go', rust: 'Rust'};
export const providers = {sqlserver: 'SQL Server', postgresql: 'PostgreSQL', mysql: 'MySQL', sqlite: 'SQLite', googlesheets: 'Google Sheets', nbase: 'NBase'};

// Generate ordinary Jekyll pages so shared links and refreshes work on Pages.
const source = fs.readFileSync('docs/guides/vector-search.md', 'utf8');
const output = 'docs/context-pages';
fs.mkdirSync(output, {recursive: true});
for (const code of Object.keys(languages)) {
  for (const provider of Object.keys(providers)) {
    const page = source.replace(/^---\n/, `---\ndocs_variant: true\ndocs_code: ${code}\ndocs_provider: ${provider}\npermalink: /${code}/${provider}/guides/vector-search/\n`);
    fs.writeFileSync(`${output}/${code}-${provider}.md`, page);
  }
}
// The template URL is also a usable entry point to the chooser.
fs.writeFileSync(`${output}/choose.md`, source.replace(/^---\n/, '---\ndocs_variant: true\nsitemap: false\npermalink: /{code}/{provider}/guides/vector-search/\n'));
console.log('Generated 30 language/provider vector-search pages and the chooser route.');
