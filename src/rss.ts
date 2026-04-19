import { Feed } from 'feed';
import { docSource } from './doc';

const baseUrl = 'https://wvb.dev';

export function getRSS() {
  const feed = new Feed({
    title: 'Fumadocs Blog',
    id: `${baseUrl}/blog`,
    link: `${baseUrl}/blog`,
    language: 'en',
    image: `${baseUrl}/banner.png`,
    favicon: `${baseUrl}/icon.png`,
    copyright: 'All rights reserved 2025, Fuma Nama',
  });

  for (const page of docSource.getPages()) {
    feed.addItem({
      id: page.url,
      title: page.data.title,
      description: page.data.description,
      link: `${baseUrl}${page.url}`,
      date: page.data.lastModified != null ? new Date(page.data.lastModified) : new Date(),
      author: [
        {
          name: 'Seokju Na',
          email: 'seokju.me@gmail.com',
        },
      ],
    });
  }

  return feed.rss2();
}
