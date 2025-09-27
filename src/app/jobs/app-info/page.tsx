
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Info } from 'lucide-react';

const appInfo = {
  version: '1.0.0',
  developer: 'PanelConnect Inc.',
  contact: 'asdfeel27@gmail.com',
  lastUpdated: '2025년 9월 16일',
};

export default function AppInfoPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-6 w-6" /> 앱 정보
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <InfoItem label="앱 버전" value={appInfo.version} />
          <Separator />
          <InfoItem label="개발사" value={appInfo.developer} />
          <Separator />
          <InfoItem label="문의" value={appInfo.contact} />
          <Separator />
          <InfoItem label="최신 업데이트" value={appInfo.lastUpdated} />
        </CardContent>
      </Card>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <p className="text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
