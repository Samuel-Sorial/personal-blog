import fs from 'node:fs';
import path from 'node:path';

const xml = fs.readFileSync('/tmp/samuel-blog-rss.xml', 'utf8');
const out = 'src/content/blog';
fs.mkdirSync(out, { recursive: true });
fs.mkdirSync('public/images/posts', { recursive: true });
const decode = (value = '') => value.replace(/^<!\[CDATA\[/, '').replace(/\]\]>$/, '').replaceAll('&amp;', '&');
const yaml = (value) => JSON.stringify(value);
const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((match) => match[1]);
const images = new Map();

for (const item of items) {
  const field = (name) => decode(item.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`))?.[1] ?? '');
  const title = field('title');
  const description = field('description').replace(/\.\.\.$/, '…');
  const link = field('link');
  const slug = new URL(link).pathname.slice(1);
  const publishDate = new Date(field('pubDate')).toISOString();
  const tags = [...item.matchAll(/<category>([\s\S]*?)<\/category>/g)].map((m) => decode(m[1]).trim()).filter(Boolean);
  let body = field('content:encoded');
  body = body.replace(/<a href="https:\/\/hashnode\.com\/post\/[^\"]+"[^>]*>[\s\S]*?<\/a>/g, '');
  body = body.replace(/https:\/\/cdn\.hashnode\.com\/res\/hashnode\/image\/upload\/[^\s"')]+/g, (url) => {
    const clean = url.replaceAll('&amp;', '&');
    const filename = new URL(clean).pathname.split('/').pop();
    images.set(clean, filename);
    return `/images/posts/${filename}`;
  });
  const frontmatter = [
    '---',
    `title: ${yaml(title)}`,
    `description: ${yaml(description)}`,
    `publishDate: ${publishDate}`,
    `tags: ${yaml(tags)}`,
    'draft: false',
    `canonicalUrl: ${yaml(link)}`,
    '---',
    '',
  ].join('\n');
  fs.writeFileSync(path.join(out, `${slug}.md`), frontmatter + body.trim() + '\n');
}

const curlConfig = [...images].flatMap(([url, filename]) => [
  `url = "${url}"`,
  `output = "public/images/posts/${filename}"`,
]).join('\n');
fs.writeFileSync('/tmp/samuel-blog-images.curl', curlConfig + '\n');
console.log(`Migrated ${items.length} posts and found ${images.size} images.`);
