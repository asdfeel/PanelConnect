
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useJobStore } from '@/context/job-context';
import type { Job } from '@/lib/dummy-data';
// import { shouldPromptForCoverLetter } from '@/ai/flows/job-application-cover-letter';
import { Loader2, Pencil, Trash, Share2, Link as LinkIcon } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import copy from 'copy-to-clipboard';

interface JobDetailSheetProps {
    job: Job | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const NaverBlogIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.2857 3H7.71429C5.11429 3 3 5.11429 3 7.71429V16.2857C3 18.8857 5.11429 21 7.71429 21H16.2857C18.8857 21 21 18.8857 21 16.2857V7.71429C21 5.11429 18.8857 3 16.2857 3Z" fill="#03C75A"/>
        <path d="M11.3143 10.2429L8.74286 13.7571V8H6.85714V16H8.74286L11.3143 12.4857V16H13.2V8H11.3143V10.2429Z" fill="white"/>
        <path d="M14.0571 8H15.9429V16H17.1429V12.4857L14.0571 8Z" fill="white" />
    </svg>
);

const FacebookIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM15.5 12H13.5V18H10.5V12H9V9H10.5V7.5C10.5 6.12 11.62 5 13 5H15V8H13.5C13.22 8 13 8.22 13 8.5V9H15L14.5 12H13V11.5H15.5V12Z" fill="#1877F2"/>
        <path d="M15 8H13.5C13.22 8 13 8.22 13 8.5V9H15L14.5 12H13.5V18H10.5V12H9V9H10.5V7.5C10.5 6.12 11.62 5 13 5H15V8Z" fill="white"/>
    </svg>
);


export default function JobDetailSheet({ job, open, onOpenChange }: JobDetailSheetProps) {
    const { toast } = useToast();
    const router = useRouter();
    const { applyForJob, isApplied, deleteJob } = useJobStore();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showCoverLetterDialog, setShowCoverLetterDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    
    const applied = job ? isApplied(job.id) : false;
    
    const canManage = user && job && (user.isAdmin || user.id === job.creatorId);

    const handleShare = (platform: 'facebook' | 'naver' | 'link') => {
        if (!job) return;

        const baseUrl = 'https://albaconnect.co.kr/jobs';
        const jobUrl = `${baseUrl}?jobId=${job.id}`;
        const jobTitle = job.title;

        let shareUrl = '';

        if (platform === 'facebook') {
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(jobUrl)}`;
        } else if (platform === 'naver') {
            shareUrl = `https://share.naver.com/web/shareView?url=${encodeURIComponent(jobUrl)}&title=${encodeURIComponent(jobTitle)}`;
        } else if (platform === 'link') {
            copy(jobUrl);
            toast({
              title: '링크 복사 완료',
              description: '채용 공고 링크가 클립보드에 복사되었습니다.',
            });
            return;
        }

        window.open(shareUrl, '_blank', 'noopener,noreferrer');
    };

    const handleApply = async () => {
        if (!job) return;

        if (job.applyLink) {
            window.open(job.applyLink, '_blank');
            applyForJob(job.id);
            onOpenChange(false);
            return;
        }

        setIsLoading(true);
        try {
            // const { shouldPrompt } = await shouldPromptForCoverLetter({
            //     jobDescription: job.description,
            //     jobRequirements: job.requirements,
            // });

            // if (shouldPrompt) {
            //     setShowCoverLetterDialog(true);
            // } else {
            //     completeApplication();
            // }
            completeApplication();
        } catch (error) {
            console.error('AI check failed:', error);
            toast({
                variant: 'destructive',
                title: '오류 발생',
                description: '지원 과정에서 오류가 발생했습니다. 다시 시도해주세요.',
            });
            completeApplication(); // Fallback to normal application
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = () => {
        if (job) {
            router.push(`/jobs/${job.id}/edit`);
            onOpenChange(false);
        }
    }

    const handleDelete = () => {
        setShowDeleteDialog(true);
    };

    const confirmDelete = async () => {
        if (!job) return;
        setIsDeleting(true);
        try {
            await deleteJob(job.id);
            toast({
                title: '삭제 완료',
                description: '채용 공고가 삭제되었습니다.',
            });
            onOpenChange(false);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: '삭제 실패',
                description: '공고 삭제 중 오류가 발생했습니다.',
            });
        } finally {
            setIsDeleting(false);
            setShowDeleteDialog(false);
        }
    };


    const completeApplication = () => {
        if (!job) return;
        applyForJob(job.id);
        toast({
            title: '지원 완료',
            description: '해당 알바에 지원이 완료되었습니다.',
        });
        onOpenChange(false);
        setShowCoverLetterDialog(false);
    };

    if (!job) return null;

    return (
        <>
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
                    <div className="p-6">
                        <SheetHeader className="text-left">
                            <SheetTitle className="text-2xl font-headline">{job.title}</SheetTitle>
                            <SheetDescription>{job.company}</SheetDescription>
                        </SheetHeader>
                    </div>
                    <ScrollArea className="flex-1">
                        <div className="p-6 pt-0 space-y-6">
                            <DetailSection title="모집 정보">
                                <p><strong>위치:</strong> {job.location}</p>
                                <p><strong>참석비:</strong> {job.participationFee}</p>
                                <p><strong>소요시간:</strong> {job.duration}</p>
                                <p><strong>유형:</strong> {job.type}</p>
                            </DetailSection>
                            <Separator />
                            <DetailSection title="일정">
                                <ul className="list-disc list-inside space-y-1">
                                    {job.schedule.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </DetailSection>
                            <Separator />
                             <DetailSection title="대상 조건">
                                <ul className="list-disc list-inside space-y-1">
                                    {job.requirements.map((req, i) => <li key={i}>{req}</li>)}
                                </ul>
                            </DetailSection>
                            <Separator />
                            <DetailSection title="상세 내용">
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{job.description}</p>
                            </DetailSection>
                            <Separator />
                            <DetailSection title="공유하기">
                                <div className="flex items-center gap-2">
                                     <Button variant="outline" size="icon" onClick={() => handleShare('link')} aria-label="링크 복사">
                                        <LinkIcon className="h-5 w-5" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="p-1.5" onClick={() => handleShare('naver')} aria-label="네이버 블로그에 공유">
                                        <NaverBlogIcon />
                                    </Button>
                                    <Button variant="outline" size="icon" className="p-1.5" onClick={() => handleShare('facebook')} aria-label="페이스북에 공유">
                                        <FacebookIcon />
                                    </Button>
                                </div>
                            </DetailSection>
                        </div>
                    </ScrollArea>
                    <SheetFooter className="p-4 border-t bg-background grid grid-cols-6 gap-2">
                        {canManage ? (
                            <>
                                <Button
                                    variant="outline"
                                    className="col-span-1"
                                    size="lg"
                                    onClick={handleEdit}
                                >
                                    <Pencil className="h-5 w-5" />
                                    <span className="sr-only">수정하기</span>
                                </Button>
                                <Button
                                    variant="destructive"
                                    className="col-span-1"
                                    size="lg"
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash className="h-5 w-5" />}
                                    <span className="sr-only">삭제하기</span>
                                </Button>
                            </>
                        ) : <div className="col-span-2"/>}
                        <Button
                            className={`w-full ${canManage ? 'col-span-4' : 'col-span-6'}`}
                            size="lg"
                            onClick={handleApply}
                            disabled={applied || isLoading}
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {applied ? '지원 완료' : '지원하기'}
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            <AlertDialog open={showCoverLetterDialog} onOpenChange={setShowCoverLetterDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>자기소개서 추천</AlertDialogTitle>
                        <AlertDialogDescription>
                            이 포지션은 간단한 자기소개서를 첨부하면 합격 확률이 올라갈 수 있습니다. 이대로 지원하시겠습니까?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>취소</AlertDialogCancel>
                        <AlertDialogAction onClick={completeApplication}>그대로 지원</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>정말로 삭제하시겠습니까?</AlertDialogTitle>
                        <AlertDialogDescription>
                            이 작업은 되돌릴 수 없습니다. 채용 공고가 영구적으로 삭제됩니다.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>취소</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">삭제</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

function DetailSection({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="space-y-2">
            <h3 className="text-lg font-semibold font-headline">{title}</h3>
            <div className="text-sm text-muted-foreground space-y-1">{children}</div>
        </div>
    );
}

    
