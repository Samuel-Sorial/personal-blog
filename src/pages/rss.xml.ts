import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
export async function GET(context: { site?: URL }) {
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());
  return rss({
    title: "Samuel Sorial's Blog",
    description: 'Personal technical notes about back-end engineering and system design.',
    site: context.site!,
    items: posts.map((post) => ({ title: post.data.title, description: post.data.description, pubDate: post.data.publishDate, link: `/${post.id}` })),
  });
}
