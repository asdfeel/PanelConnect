export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  participationFee: string;
  duration: string;
  schedule: string[];
  type: string;
  status: '모집중' | '마감임박';
  description: string;
  requirements: string[];
  isHot: boolean;
  applyLink?: string;
  creatorId: string;
};

export const jobs: Job[] = [
    {
      id: "1",
      title: '[대모집] 칸타 가구패널 모집',
      company: '칸타코리아',
      location: '전국(제주도 제외)',
      participationFee: '매주 1,000-1,300점',
      duration: '매주 5분',
      schedule: ['상시모집'],
      type: '패널조사',
      status: '모집중',
      description: '본인이 사용하는 스마트폰에 칸타모바일패널 어플을 설치하신 후 본인이 구매한 제품의 바코드를 스캔하여 전송하는 패널활동',
      requirements: [
        '제주도 제외 전국 거주자',
        '식료품 및 생활용품 주 구매자',
        '본인 명의 스마트폰 사용자'
      ],
      isHot: true,
      applyLink: 'https://www.panelconnect.com',
      creatorId: 'admin',
    },
    {
      id: "2",
      title: '화장품 품평회 참가자 모집',
      company: '뷰티리서치',
      location: '서울 강남구',
      participationFee: '10만원',
      duration: '약 1시간 30분',
      schedule: ['10월 25일 (수) 14:00', '10월 26일 (목) 16:00'],
      type: '품평회',
      status: '모집중',
      description: '신제품 화장품 사용 후 솔직한 리뷰를 작성해주실 분을 모집합니다',
      requirements: ['20-35세 여성', '화장품에 관심이 많은 분', '서울 거주자'],
      isHot: false,
      creatorId: 'admin',
    },
    {
      id: "3",
      title: '음료 맛테스트 참가자 모집',
      company: '푸드테스트랩',
      location: '서울 마포구',
      participationFee: '5만원',
      duration: '약 30분',
      schedule: ['매주 주말'],
      type: '맛테스트',
      status: '마감임박',
      description: '신제품 음료의 맛을 평가하고 피드백을 제공해주실 분을 모집합니다',
      requirements: ['19세 이상', '알레르기 없는 분', '서울/경기 거주자'],
      isHot: true,
      applyLink: 'https://www.panelconnect.com',
      creatorId: 'admin',
    }
  ];

export const categories = [
    { name: '좌담회', icon: 'MessagesSquare' },
    { name: '설문조사', icon: 'FileText' },
    { name: '품평회', icon: 'ClipboardCheck' },
    { name: '맛테스트', icon: 'Beaker' },
    { name: '패널조사', icon: 'Users' },
    { name: '인터뷰', icon: 'Mic' },
    { name: '단기 내근알바', icon: 'Building' },
    { name: '유치조사', icon: 'UserPlus' },
    { name: '가정방문조사', icon: 'Home' }
] as const;
