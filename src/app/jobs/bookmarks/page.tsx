'use client';

import { useJobStore } from '@/context/job-context';
import JobCard from '@/components/job-card';
import JobDetailSheet from '@/components/job-detail-sheet';
import { useState } from 'react';
import type { Job } from '@/lib/dummy-data';
import { Bookmark } from 'lucide-react';

export default function BookmarksPage() {
    const { jobs, bookmarkedJobs } = useJobStore();
    const bookmarked = jobs.filter(job => bookmarkedJobs.includes(job.id));
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);

    return (
        <div className="space-y-8">
            {bookmarked.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {bookmarked.map(job => (
                        <JobCard key={job.id} job={job} onSelectJob={() => setSelectedJob(job)} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-center py-20 rounded-lg bg-card shadow-sm">
                    <Bookmark className="w-16 h-16 text-muted-foreground/50" />
                    <h3 className="mt-4 text-xl font-semibold">즐겨찾기한 알바가 없습니다</h3>
                    <p className="mt-2 text-sm text-muted-foreground">마음에 드는 알바를 즐겨찾기 해보세요.</p>
                </div>
            )}
            <JobDetailSheet
                job={selectedJob}
                open={!!selectedJob}
                onOpenChange={(open) => { if (!open) setSelectedJob(null); }}
            />
        </div>
    );
}
