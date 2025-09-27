import { MetadataRoute } from 'next';
import { jobs } from '@/lib/dummy-data';
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://albaconnect.co.kr';

  const jobEntries: MetadataRoute.Sitemap = jobs.map(job => ({
    url: `${baseUrl}/jobs`, // 상세 페이지가 있다면 `${baseUrl}/jobs/${job.id}` 로 변경해야 합니다.
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/jobs`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/jobs/new`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
     {
      url: `${baseUrl}/jobs/customer-service`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/jobs/app-info`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/jobs/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/jobs/feed.xml`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
  ];

  return [...staticEntries, ...jobEntries];
}
