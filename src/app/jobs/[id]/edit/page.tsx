'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useJobStore } from '@/context/job-context';
import { categories } from '@/lib/dummy-data';
import { Loader2, X, PlusCircle, Pencil } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const formSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.'),
  company: z.string().min(1, '회사명을 입력해주세요.'),
  location: z.string().min(1, '위치를 입력해주세요.'),
  participationFee: z.string().min(1, '참석비를 입력해주세요.'),
  duration: z.string().min(1, '소요시간을 입력해주세요.'),
  schedule: z.array(z.object({ value: z.string() })).min(1, '일정은 최소 1개 이상이어야 합니다.'),
  type: z.string().min(1, '유형을 선택해주세요.'),
  status: z.enum(['모집중', '마감임박']),
  description: z.string().optional(),
  requirements: z.array(z.object({ value: z.string() })).min(1, '대상 조건은 최소 1개 이상이어야 합니다.'),
  isHot: z.boolean(),
  applyLink: z.string().url('유효한 URL을 입력해주세요.').optional().or(z.literal('')),
});

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const { jobs, updateJob } = useJobStore();
  const [isLoading, setIsLoading] = useState(false);
  
  const jobId = params.id as string;
  const job = jobs.find(j => j.id === jobId);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      company: '',
      location: '',
      participationFee: '',
      duration: '',
      schedule: [{ value: '' }],
      type: '',
      status: '모집중',
      description: '',
      requirements: [{ value: '' }],
      isHot: false,
      applyLink: '',
    },
  });

  useEffect(() => {
    if (job) {
      form.reset({
        ...job,
        schedule: job.schedule.map(value => ({ value })),
        requirements: job.requirements.map(value => ({ value })),
        applyLink: job.applyLink || '',
      });
    }
  }, [job, form]);
  
  const { fields: reqFields, append: appendReq, remove: removeReq } = useFieldArray({ control: form.control, name: "requirements" });
  const { fields: scheduleFields, append: appendSchedule, remove: removeSchedule } = useFieldArray({ control: form.control, name: "schedule" });


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!job) return;
    setIsLoading(true);
    try {
        const updatedJob = {
            id: job.id,
            ...values,
            schedule: values.schedule.map(s => s.value),
            requirements: values.requirements.map(r => r.value),
            creatorId: job.creatorId,
        };
      await updateJob(updatedJob);
      toast({
        title: '공고 수정 완료',
        description: '채용 공고가 성공적으로 수정되었습니다.',
      });
      router.push('/jobs');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: '수정 실패',
        description: '공고 수정 중 오류가 발생했습니다.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!job) {
    return (
        <div className="flex justify-center items-center h-64">
            <p>채용 공고를 찾을 수 없습니다.</p>
        </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Pencil className="h-6 w-6"/>채용공고 수정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="title" render={({ field }) => (
                        <FormItem>
                            <FormLabel>제목</FormLabel>
                            <FormControl><Input placeholder="예: [신입/경력] UX 리서처 모집" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="company" render={({ field }) => (
                        <FormItem>
                            <FormLabel>회사명</FormLabel>
                            <FormControl><Input placeholder="예: PanelConnect" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="location" render={({ field }) => (
                        <FormItem>
                            <FormLabel>위치</FormLabel>
                            <FormControl><Input placeholder="예: 서울 강남구" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="participationFee" render={({ field }) => (
                        <FormItem>
                            <FormLabel>참석비</FormLabel>
                            <FormControl><Input placeholder="예: 건당 50,000원" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <FormField control={form.control} name="duration" render={({ field }) => (
                        <FormItem>
                            <FormLabel>소요시간</FormLabel>
                            <FormControl><Input placeholder="예: 약 1시간" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>
                
                <FormField control={form.control} name="type" render={({ field }) => (
                    <FormItem>
                        <FormLabel>유형</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="채용 유형을 선택하세요" /></SelectTrigger></FormControl>
                            <SelectContent>
                                {categories.map(cat => <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />

                 <FormField control={form.control} name="applyLink" render={({ field }) => (
                    <FormItem>
                        <FormLabel>지원 링크</FormLabel>
                        <FormControl><Input placeholder="https://example.com/apply" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                
                <div>
                    <FormLabel>일정</FormLabel>
                    <div className="space-y-2 mt-2">
                    {scheduleFields.map((field, index) => (
                        <FormField
                        key={field.id}
                        control={form.control}
                        name={`schedule.${index}.value`}
                        render={({ field }) => (
                            <FormItem className="flex items-center gap-2">
                                <FormControl><Input {...field} placeholder="예: 10월 25일 (수) 14:00" /></FormControl>
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeSchedule(index)} disabled={scheduleFields.length <= 1}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </FormItem>
                        )}
                        />
                    ))}
                    </div>
                    <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendSchedule({ value: "" })}>
                        <PlusCircle className="mr-2 h-4 w-4" /> 일정 추가
                    </Button>
                </div>
                
                <div>
                    <FormLabel>대상 조건</FormLabel>
                    <div className="space-y-2 mt-2">
                    {reqFields.map((field, index) => (
                        <FormField
                        key={field.id}
                        control={form.control}
                        name={`requirements.${index}.value`}
                        render={({ field }) => (
                            <FormItem className="flex items-center gap-2">
                                <FormControl><Input {...field} placeholder="예: 20대 여성" /></FormControl>
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeReq(index)} disabled={reqFields.length <= 1}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </FormItem>
                        )}
                        />
                    ))}
                    </div>
                    <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendReq({ value: "" })}>
                        <PlusCircle className="mr-2 h-4 w-4" /> 조건 추가
                    </Button>
                </div>
                
                <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                        <FormLabel>상세 내용(선택)</FormLabel>
                        <FormControl><Textarea placeholder="채용 공고에 대한 상세한 내용을 입력하세요." rows={5} {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <FormField control={form.control} name="status" render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel>상태</FormLabel>
                            <FormControl>
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl><RadioGroupItem value="모집중" /></FormControl>
                                        <FormLabel className="font-normal">모집중</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl><RadioGroupItem value="마감임박" /></FormControl>
                                        <FormLabel className="font-normal">마감임박</FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                     <FormField
                        control={form.control}
                        name="isHot"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className="space-y-0.5">
                                    <Label htmlFor="isHot">HOT 공고</Label>
                                </div>
                            </FormItem>
                        )}
                        />
                </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                수정 완료
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}

    