
'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import JobCard from '@/components/job-card';
import JobDetailSheet from '@/components/job-detail-sheet';
import { categories } from '@/lib/dummy-data';
import type { Job } from '@/lib/dummy-data';
import { Search, MessagesSquare, FileText, ClipboardCheck, Beaker, Users, Mic, Building, UserPlus, Home, BookText } from 'lucide-react';
import { useJobStore } from '@/context/job-context';

const categoryIcons = {
    '좌담회': MessagesSquare,
    '설문조사': FileText,
    '품평회': ClipboardCheck,
    '맛테스트': Beaker,
    '패널조사': Users,
    '인터뷰': Mic,
    '단기 내근알바': Building,
    '유치조사': UserPlus,
    '가정방문조사': Home,
    '다이어리 작성': BookText,
};

function JobsPageContent() {
    const { jobs } = useJobStore();
    const searchParams = useSearchParams();
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);

    useEffect(() => {
        const jobId = searchParams.get('jobId');
        if (jobId && jobs.length > 0) {
            const jobFromUrl = jobs.find(j => j.id === jobId);
            if (jobFromUrl) {
                setSelectedJob(jobFromUrl);
            }
        }
    }, [searchParams, jobs]);


    const filteredJobs = jobs.filter(job => {
        const lowerSearchText = searchText.toLowerCase();
        const matchesSearch =
            job.title.toLowerCase().includes(lowerSearchText) ||
            job.company.toLowerCase().includes(lowerSearchText) ||
            job.type.toLowerCase().includes(lowerSearchText);
        const matchesCategory = selectedCategory ? job.type === selectedCategory : true;
        return matchesSearch && matchesCategory;
    });

    const CategoryIcon = ({ name }: { name: (typeof categories)[number]['name'] }) => {
        const Icon = categoryIcons[name];
        return Icon ? <Icon className="h-6 w-6 text-primary" /> : null;
    };

    return (
        <div className="space-y-8">
            <div className="text-center py-8">
                <h1 className="text-4xl font-extrabold font-headline tracking-tight lg:text-5xl">
                    좌담회 알바, 이제 한 곳에서.
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    다양한 리서치 참여 기회를 놓치지 마세요.
                </p>
            </div>
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    placeholder="알바를 검색해보세요"
                    className="w-full rounded-full bg-card pl-12 py-6 text-base shadow-sm"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
            </div>
            
            <div>
                <h2 className="text-2xl font-bold font-headline mb-4">카테고리</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {categories.map((category) => (
                        <Card 
                            key={category.name}
                            className={`p-4 flex flex-col items-center justify-center cursor-pointer transition-all hover:shadow-md hover:border-primary/50 ${selectedCategory === category.name ? 'ring-2 ring-primary shadow-lg' : 'shadow-sm'}`}
                            onClick={() => setSelectedCategory(prev => prev === category.name ? null : category.name)}
                        >
                            <CardContent className="p-0 flex flex-col items-center gap-2">
                                <div className="p-3 bg-primary/10 rounded-full">
                                    <CategoryIcon name={category.name} />
                                </div>
                                <p className="text-sm font-medium">{category.name}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold font-headline mb-4">최신 리서치 알바 정보</h2>
                {filteredJobs.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredJobs.map(job => (
                            <JobCard key={job.id} job={job} onSelectJob={() => setSelectedJob(job)} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 text-muted-foreground bg-card rounded-lg">
                        <p>검색 결과가 없습니다.</p>
                    </div>
                )}
            </div>

            <JobDetailSheet
                job={selectedJob}
                open={!!selectedJob}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedJob(null);
                    }
                }}
            />
        </div>
    );
}

export default function JobsPage() {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <JobsPageContent />
        </React.Suspense>
    );
}
