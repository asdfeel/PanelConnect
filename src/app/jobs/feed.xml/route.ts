
import {NextResponse} from 'next/server';
import RSS from 'rss';
import {jobs} from '@/lib/dummy-data';

const SITE_URL = 'https://albaconnect.co.kr';

export async function GET() {
  const feed = new RSS({
    title: 'PanelConnect - 최신 리서치 알바 정보',
    description: 'PanelConnect에서 제공하는 최신 좌담회, 설문조사, 품평회 등 다양한 리서치 참여 기회를 확인하세요.',
    site_url: `${SITE_URL}/jobs`,
    feed_url: `${SITE_URL}/jobs/feed.xml`,
    language: 'ko',
    pubDate: '2024-01-01T00:00:00Z',
  });

  // Firestore에서 데이터를 가져오는 로직으로 대체할 수 있습니다.
  const allJobs = jobs;

  allJobs.forEach(job => {
    const jobUrl = `${SITE_URL}/jobs`; // 각 job 별 상세 페이지가 있다면 그 url을 사용합니다.
    feed.item({
      title: job.title,
      description: `
        <p><strong>회사:</strong> ${job.company}</p>
        <p><strong>위치:</strong> ${job.location}</p>
        <p><strong>참석비:</strong> ${job.participationFee}</p>
        <p><strong>유형:</strong> ${job.type}</p>
        <br/>
        ${job.description ? `<p>${job.description.replace(/\n/g, '<br/>')}</p>` : ''}
      `,
      url: jobUrl,
      guid: job.id,
      date: new Date(), // TODO: 실제 데이터가 추가되면 job.createdAt 같은 필드를 사용해야 합니다.
      author: job.company,
    });
  });

  return new NextResponse(feed.xml({indent: true}), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
