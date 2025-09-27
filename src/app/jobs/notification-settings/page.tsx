'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function NotificationSettingsPage() {
  const [allNotifications, setAllNotifications] = useState(true);
  const [newJobAlerts, setNewJobAlerts] = useState(true);
  const [applicationStatus, setApplicationStatus] = useState(true);

  const handleAllNotificationsChange = (checked: boolean) => {
    setAllNotifications(checked);
    setNewJobAlerts(checked);
    setApplicationStatus(checked);
  };
  
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-6 w-6" /> 알림 설정
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="all-notifications" className="text-base font-semibold">
              전체 알림
            </Label>
            <Switch
              id="all-notifications"
              checked={allNotifications}
              onCheckedChange={handleAllNotificationsChange}
            />
          </div>
          <Separator />
          <div className="space-y-4 pl-4 border-l-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="new-job-alerts" className="text-muted-foreground">
                신규 공고 알림
              </Label>
              <Switch
                id="new-job-alerts"
                checked={newJobAlerts}
                onCheckedChange={setNewJobAlerts}
                disabled={!allNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="application-status" className="text-muted-foreground">
                지원 현황 변동 알림
              </Label>
              <Switch
                id="application-status"
                checked={applicationStatus}
                onCheckedChange={setApplicationStatus}
                disabled={!allNotifications}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
