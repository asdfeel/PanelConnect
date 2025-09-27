'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import JobCard from '@/components/job-card';
import JobDetailSheet from '@/components/job-detail-sheet';
import { categories } from '@/lib/dummy-data';
import type { Job } from '@/lib/dummy-data';
import { Search, MessagesSquare, FileText, ClipboardCheck, Beaker, Users, Mic, Building, UserPlus, Home } from 'lucide-react';
import { useJobStore } from '@/context/job-context';

// 타입 안전성을 위한 카테고리 타입 정의
type CategoryName = '좌담회' | '설문조사' | '품평회' | '맛테스트' | '패널조사' | '인터뷰' | '단기 내근알바' | '유치조사' | '가정방문조사';

const categoryIcons: Record<CategoryName, React.ComponentType<{ className?: string }>> = {
    '좌담회': MessagesSquare,
    '설문조사': FileText,
    '품평회': ClipboardCheck,
    '맛테스트': Beaker,
    '패널조사': Users,
    '인터뷰': Mic,
    '단기 내근알바': Building,
    '유치조사': UserPlus,
    '가정방문조사': Home,
};

function JobsPageContent() {
    const { jobs } = useJobStore();
    const searchParams = useSearchParams();
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);

    // URL에서 jobId 처리 개선
    useEffect(() => {
        const jobId = searchParams.get('jobId');
        if (jobId) {
            const jobFromUrl = jobs.find(j => j.id === jobId);
            if (jobFromUrl) {
                setSelectedJob(jobFromUrl);
            } else if (jobs.length > 0) {
                // jobs가 로드되었지만 해당 job을 찾을 수 없는 경우
                console.warn(`Job with id ${jobId} not found`);
            }
        }
    }, [searchParams, jobs]);

    // 필터링 로직 메모이제이션으로 성능 최적화
    const filteredJobs = useMemo(() => {
        return jobs.filter(job => {
            const lowerSearchText = searchText.toLowerCase();
            const matchesSearch =
                job.title.toLowerCase().includes(lowerSearchText) ||
                job.company.toLowerCase().includes(lowerSearchText) ||
                job.type.toLowerCase().includes(lowerSearchText);
            const matchesCategory = selectedCategory ? job.type === selectedCategory : true;
            return matchesSearch && matchesCategory;
        });
    }, [jobs, searchText, selectedCategory]);

    // 타입 안전한 CategoryIcon 컴포넌트
    const CategoryIcon = ({ name }: { name: string }) => {
        const Icon = categoryIcons[name as CategoryName];
        return Icon ? <Icon className="h-6 w-6 text-primary" /> : null;
    };

    // 카테고리 선택 핸들러
    const handleCategorySelect = (categoryName: string) => {
        setSelectedCategory(prev => prev === categoryName ? null : categoryName);
    };

    // Job 선택 핸들러
    const handleJobSelect = (job: Job) => {
        setSelectedJob(job);
    };

    // Job 상세 시트 닫기 핸들러
    const handleJobDetailClose = (open: boolean) => {
        if (!open) {
            setSelectedJob(null);
        }
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
                            className={`p-4 flex flex-col items-center justify-center cursor-pointer transition-all hover:shadow-md hover:border-primary/50 ${
                                selectedCategory === category.name ? 'ring-2 ring-primary shadow-lg' : 'shadow-sm'
                            }`}
                            onClick={() => handleCategorySelect(category.name)}
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
                <h2 className="text-2xl font-bold font-headline mb-4">
                    최신 리서치 알바 정보 
                    {filteredJobs.length > 0 && (
                        <span className="text-base font-normal text-muted-foreground ml-2">
                            ({filteredJobs.length}개)
                        </span>
                    )}
                </h2>
                {filteredJobs.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredJobs.map(job => (
                            <JobCard 
                                key={job.id} 
                                job={job} 
                                onSelectJob={() => handleJobSelect(job)} 
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 text-muted-foreground bg-card rounded-lg">
                        <p>검색 결과가 없습니다.</p>
                        {searchText && (
                            <p className="mt-2 text-sm">
                                "{searchText}"에 대한 검색 결과가 없습니다.
                            </p>
                        )}
                    </div>
                )}
            </div>

            <JobDetailSheet
                job={selectedJob}
                open={!!selectedJob}
                onOpenChange={handleJobDetailClose}
            />
        </div>
    );
}

export default function JobsPage() {
    return (
        <React.Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Loading...</div>
            </div>
        }>
            <JobsPageContent />
        </React.Suspense>
    );
}