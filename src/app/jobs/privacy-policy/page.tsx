'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Shield className="h-6 w-6" /> 개인정보처리방침
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[60vh] p-4 border rounded-md">
                    <div className="space-y-6 text-sm text-muted-foreground">
                        <PolicySection title="제1조 (개인정보의 처리 목적)">
                            <p>PanelConnect (이하 '회사')는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
                            <ol className="list-decimal list-inside space-y-1 pl-4">
                                <li>회원 가입 및 관리: 회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리, 제한적 본인확인제 시행에 따른 본인확인, 서비스 부정이용 방지, 만 14세 미만 아동의 개인정보 처리 시 법정대리인의 동의여부 확인, 각종 고지·통지, 고충처리 등을 목적으로 개인정보를 처리합니다.</li>
                                <li>재화 또는 서비스 제공: 물품배송, 서비스 제공, 계약서·청구서 발송, 콘텐츠 제공, 맞춤서비스 제공, 본인인증, 연령인증, 요금결제·정산 등을 목적으로 개인정보를 처리합니다.</li>
                                <li>마케팅 및 광고에의 활용: 신규 서비스(제품) 개발 및 맞춤 서비스 제공, 이벤트 및 광고성 정보 제공 및 참여기회 제공, 인구통계학적 특성에 따른 서비스 제공 및 광고 게재, 접속빈도 파악 또는 회원의 서비스 이용에 대한 통계 등을 목적으로 개인정보를 처리합니다.</li>
                            </ol>
                        </PolicySection>

                        <PolicySection title="제2조 (개인정보의 처리 및 보유 기간)">
                            <p>① 회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의 받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</p>
                            <p>② 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.</p>
                             <ol className="list-decimal list-inside space-y-1 pl-4">
                                <li>회원 가입 및 관리 : 회원 탈퇴 시까지. 다만, 다음의 사유에 해당하는 경우에는 해당 사유 종료 시까지
                                    <ul className="list-disc list-inside pl-6">
                                        <li>관계 법령 위반에 따른 수사·조사 등이 진행중인 경우에는 해당 수사·조사 종료 시까지</li>
                                        <li>서비스 이용에 따른 채권·채무관계 잔존 시에는 해당 채권·채무관계 정산 시까지</li>
                                    </ul>
                                </li>
                                <li>재화 또는 서비스 제공 : 재화·서비스 공급완료 및 요금결제·정산 완료시까지.</li>
                            </ol>
                        </PolicySection>

                        <PolicySection title="제3조 (개인정보의 제3자 제공)">
                            <p>회사는 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.</p>
                        </PolicySection>

                         <PolicySection title="제4조 (정보주체와 법정대리인의 권리·의무 및 그 행사방법)">
                             <p>① 정보주체는 회사에 대해 언제든지 개인정보 열람·정정·삭제·처리정지 요구 등의 권리를 행사할 수 있습니다.</p>
                             <p>② 제1항에 따른 권리 행사는 회사에 대해 개인정보 보호법 시행령 제41조제1항에 따라 서면, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며 회사는 이에 대해 지체 없이 조치하겠습니다.</p>
                             <p>③ 제1항에 따른 권리 행사는 정보주체의 법정대리인이나 위임을 받은 자 등 대리인을 통하여 하실 수 있습니다. 이 경우 개인정보 보호법 시행규칙 별지 제11호 서식에 따른 위임장을 제출하셔야 합니다.</p>
                        </PolicySection>
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    </div>
  );
}

function PolicySection({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="space-y-2">
            <h3 className="text-base font-semibold text-foreground">{title}</h3>
            <div className="space-y-2">{children}</div>
        </div>
    );
}
