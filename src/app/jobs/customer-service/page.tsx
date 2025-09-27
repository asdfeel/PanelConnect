
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: '어떻게 지원하나요?',
    answer:
      "상세 페이지에서 '지원하기' 버튼을 누르고 설문응답 진행하시면 지원이 완료됩니다. 일부 조사의 경우, 추가적인 좌담회 or 인터뷰 등을 참여해야 할 수도 있습니다.",
  },
  {
    question: '참석비는 언제 지급되나요?',
    answer:
      '참석비 지급일은 각 공고마다 다릅니다. 일반적으로 당일이나 조사 종료 후 1-2주 이내에 지급되며, 자세한 내용은 공고를 확인해주세요.',
  },
  {
    question: '지원 현황은 어디서 확인하나요?',
    answer:
      "메인 화면 하단의 '내 지원' 탭에서 지원하신 공고 목록과 현재 진행 상태를 확인하실 수 있습니다.",
  },
  {
    question: '회원 정보는 어떻게 수정하나요?',
    answer:
      "'마이페이지' > '개인정보 수정' 메뉴에서 이름과 비밀번호를 변경할 수 있습니다. 이메일 변경은 고객센터로 문의해주세요.",
  },
  {
    question: '좌담회 신청 시 유의사항',
    answer: (
      <ul className="list-disc space-y-2 pl-5">
        <li>참석 대상이 될 수 있는 분께만 개별적으로 연락을 드립니다.</li>
        <li>
          대상자로 선정되면 확정 문자를 드리며, 문자를 받지 못하신 분은 참석할 수 없습니다.
        </li>
        <li>전화 연결이 되지 않으면 다음 신청자에게 차례가 넘어갑니다.</li>
      </ul>
    ),
  },
];

export default function CustomerServicePage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-6 w-6" /> 고객센터
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
