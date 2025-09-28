
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
// import { createJobPosting } from '@/ai/flows/create-job-posting';
import { Loader2, X, PlusCircle, BrainCircuit } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/auth-context';

const formSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.'),
  company: z.string().min(1, '회사명을 입력해주세요.'),
  location: z.string().min(1, '위치를 입력해주세요.'),
  participationFee: z.string().min(1, '참석비를 입력해주세요.'),
  duration: z.string().min(1, '소요시간을 입력해주세요.'),
  schedule: z.array(z.object({ value: z.string() })).min(1, '일정은 최소 1개 이상이어야 합니다.'),
  type: z.string().min(1, '유형을 선택해주세요.'),
  status: z.enum(['모집중', '마감임박']),
  description: z.string().min(1, '상세 내용을 입력해주세요.'),
  requirements: z.array(z.object({ value: z.string() })).min(1, '대상 조건은 최소 1개 이상이어야 합니다.'),
  isHot: z.boolean(),
  applyLink: z.string().url('유효한 URL을 입력해주세요.').optional().or(z.literal('')),
});

export default function NewJobPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { addJob } = useJobStore();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/login');
    }
  }, [user, isAuthLoading, router]);


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
  
  const { fields: scheduleFields, append: appendSchedule, remove: removeSchedule } = useFieldArray({ control: form.control, name: "schedule" });
  const { fields: reqFields, append: appendReq, remove: removeReq } = useFieldArray({ control: form.control, name: "requirements" });

  const handleAiGenerate = async () => {
      const { title, company } = form.getValues();
      if (!title || !company) {
          toast({
              variant: 'destructive',
              title: 'AI 생성 오류',
              description: 'AI가 내용을 생성하려면 \'제목\'과 \'회사명\'을 먼저 입력해야 합니다.',
          });
          return;
      }
      setIsAiLoading(true);
      try {
          // const result = await createJobPosting({
          //     title,
          //     company,
          // });
          // form.setValue('description', result.description);
          
          // form.setValue('requirements', []);
          // result.requirements.forEach(req => appendReq({ value: req }));
          

          toast({
              title: 'AI 기능 비활성화됨',
              description: '현재 AI 기능을 사용할 수 없습니다.',
          });
      } catch (error) {
          console.error('AI generation failed', error);
          toast({
              variant: 'destructive',
              title: 'AI 생성 실패',
              description: '내용 자동 생성 중 오류가 발생했습니다.',
          });
      } finally {
          setIsAiLoading(false);
      }
  };


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
        toast({
            variant: 'destructive',
            title: '로그인 필요',
            description: '공고를 등록하려면 로그인이 필요합니다.',
        });
        return;
    }
    setIsLoading(true);
    try {
        const newJobData = {
            ...values,
            schedule: values.schedule.map(s => s.value),
            requirements: values.requirements.map(r => r.value),
        };
      await addJob(newJobData);
      toast({
        title: '공고 등록 완료',
        description: '새로운 채용 공고가 성공적으로 등록되었습니다.',
      });
      router.push('/jobs');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: '등록 실패',
        description: '공고 등록 중 오류가 발생했습니다.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthLoading || !user) {
      return (
          <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
          </div>
      )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>새 채용공고 등록</CardTitle>
              {/*
              <Button type="button" onClick={handleAiGenerate} disabled={isAiLoading} variant="outline">
                {isAiLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <BrainCircuit className="mr-2 h-4 w-4" />
                )}
                AI로 내용 채우기
              </Button>
              */}
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                        <FormLabel>선택사항 입력</FormLabel>
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
                채용 공고 등록하기
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}

    
