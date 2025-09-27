'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, CreditCard, Clock, Briefcase, Timer, Calendar } from 'lucide-react';
import type { Job } from '@/lib/dummy-data';
import { useJobStore } from '@/context/job-context';
import { cn } from '@/lib/utils';

interface JobCardProps {
    job: Job;
    onSelectJob: (job: Job) => void;
}

export default function JobCard({ job, onSelectJob }: JobCardProps) {
    
    return (
        <Card className="flex flex-col h-full cursor-pointer hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden" onClick={() => onSelectJob(job)}>
            <CardHeader className="pb-4">
                <div className="flex justify-between items-start gap-4">
                    <CardTitle className="text-lg font-bold font-headline">{job.title}</CardTitle>
                </div>
                <div className="flex items-center flex-wrap gap-2 text-sm text-muted-foreground pt-1">
                    <span>{job.company}</span>
                    {job.isHot && <Badge variant="destructive" className="bg-red-500 text-white">HOT</Badge>}
                    <Badge variant={job.status === '마감임박' ? 'destructive' : 'secondary'} className={cn('font-normal', job.status === '마감임박' ? '' : 'bg-primary/20 text-primary hover:bg-primary/30')}>{job.status}</Badge>
                </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-3 text-sm">
                {job.schedule?.[0] && <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-muted-foreground" /> <span className="flex-1 truncate">{job.schedule[0]}</span></div>}
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-muted-foreground" /> <span className="flex-1 truncate">{job.location}</span></div>
                <div className="flex items-center gap-2"><CreditCard className="w-4 h-4 text-muted-foreground" /> <span className="flex-1 truncate">{job.participationFee}</span></div>
                <div className="flex items-center gap-2"><Timer className="w-4 h-4 text-muted-foreground" /> <span className="flex-1 truncate">{job.duration}</span></div>
                <div className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-muted-foreground" /> <span className="flex-1 truncate">{job.type}</span></div>
            </CardContent>
        </Card>
    );
}
