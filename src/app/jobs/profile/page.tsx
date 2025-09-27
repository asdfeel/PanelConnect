'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Bell, HelpCircle, Info, LogOut, ChevronRight, FilePenLine, LogIn, Shield, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import Link from 'next/link';

const menuItems = [
    { title: '개인정보 수정', icon: FilePenLine, href: '/jobs/profile/edit' },
    { title: '알림 설정', icon: Bell, href: '/jobs/notification-settings' },
    { title: '고객센터', icon: HelpCircle, href: '/jobs/customer-service' },
    { title: '앱 정보', icon: Info, href: '/jobs/app-info' },
    { title: '개인정보처리방침', icon: Shield, href: '/jobs/privacy-policy' },
];

export default function ProfilePage() {
    const { user, logout, isLoading } = useAuth();

    if (isLoading) {
        return (
             <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    if (!user) {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>로그인 필요</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                         <p>서비스를 이용하려면 로그인이 필요합니다.</p>
                        <div className="flex gap-4">
                            <Button asChild className="w-full">
                                <Link href="/login">
                                    <LogIn className="mr-2 h-4 w-4" />
                                    로그인
                                </Link>
                            </Button>
                             <Button asChild variant="secondary" className="w-full">
                                <Link href="/signup">회원가입</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Card className="overflow-hidden">
                <CardContent className="pt-6 flex flex-col items-center text-center">
                    <Avatar className="h-24 w-24 mb-4">
                        <AvatarImage src="https://picsum.photos/seed/user-profile/100/100" data-ai-hint="person portrait" />
                        <AvatarFallback>{user.name?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <h2 className="text-2xl font-bold font-headline">{user.name}</h2>
                    <p className="text-muted-foreground">{user.email}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>계정 설정</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col">
                        {menuItems.map((item, index) => (
                            <div key={index}>
                                <Button variant="ghost" className="w-full justify-start h-14 px-4 text-base rounded-none" asChild>
                                    <Link href={item.href}>
                                        <item.icon className="w-5 h-5 mr-4 text-muted-foreground" />
                                        <span>{item.title}</span>
                                        <ChevronRight className="w-5 h-5 ml-auto text-muted-foreground/50" />
                                    </Link>
                                </Button>
                                {index < menuItems.length - 1 && <Separator />}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-2">
                    <Button variant="ghost" className="w-full justify-start h-14 px-4 text-base text-destructive hover:text-destructive" onClick={logout}>
                        <LogOut className="w-5 h-5 mr-4" />
                        <span>로그아웃</span>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
