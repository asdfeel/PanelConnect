'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import JobCard from '@/components/job-card';
import JobDetailSheet from '@/components/job-detail-sheet';
import { categories } from '@/lib/dummy-data';
import type { Job } from '@/lib/dummy-data';
import { Search, MessagesSquare, FileText, ClipboardCheck, Beaker, Users, Mic, Building, UserPlus, Home, BookText, Film, Briefcase, Monitor } from 'lucide-react';
import { useJobStore } from '@/context/job-context';

const categoryIcons = {
    '좌담회': MessagesSquare,
    '설문조사': FileText,
    '품평회': ClipboardCheck,
    '테스트': Beaker,
    '패널조사': Users,
    '인터뷰': Mic,
    '단기 내근알바': Building,
    '유치조사': UserPlus,
    '가정방문조사': Home,
    '다이어리 작성': BookText,
    '시사회': Film,
    '워크샵': Briefcase,
    '모니터링': Monitor,
    '체험단': Users,
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
