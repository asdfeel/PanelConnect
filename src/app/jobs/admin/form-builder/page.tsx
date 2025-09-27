
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '@/context/auth-context';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, X, PlusCircle, ClipboardCopy } from 'lucide-react';

const formFieldSchema = z.object({
  label: z.string().min(1, '필드 라벨을 입력해주세요.'),
  type: z.enum(['text', 'email', 'textarea', 'radio', 'select', 'number', 'checkbox', 'hidden']),
  placeholder: z.string().optional(),
  options: z.string().optional(), // For radio and select
});

const formBuilderSchema = z.object({
  title: z.string().min(1, '폼 제목을 입력해주세요.'),
  description: z.string().optional(),
  fields: z.array(formFieldSchema).min(1, '최소 1개 이상의 필드가 필요합니다.'),
});

export default function FormBuilderPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && !user?.isAdmin) {
      toast({
        variant: 'destructive',
        title: '접근 권한 없음',
        description: '이 페이지는 관리자만 접근할 수 있습니다.',
      });
      router.push('/jobs');
    }
  }, [user, isAuthLoading, router, toast]);

  const form = useForm<z.infer<typeof formBuilderSchema>>({
    resolver: zodResolver(formBuilderSchema),
    defaultValues: {
      title: '',
      description: '',
      fields: [{ label: '', type: 'text', placeholder: '', options: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'fields',
  });

  const watchFieldArray = form.watch('fields');

  const onSubmit = async (values: z.infer<typeof formBuilderSchema>) => {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'forms'), {
        ...values,
        createdAt: new Date(),
        creatorId: user?.id,
      });
      toast({
        title: '폼 생성 완료',
        description: '새로운 폼이 성공적으로 생성되었습니다.',
      });
      form.reset();
    } catch (error) {
      console.error('Error creating form:', error);
      toast({
        variant: 'destructive',
        title: '생성 실패',
        description: '폼 생성 중 오류가 발생했습니다.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isAuthLoading || !user?.isAdmin) {
    return (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCopy className="h-6 w-6" />
                새 폼 만들기
              </CardTitle>
              <CardDescription>
                사용자로부터 데이터를 수집할 폼을 생성합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>폼 제목</FormLabel>
                    <FormControl>
                      <Input placeholder="예: 이벤트 참여 신청" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>폼 설명 (선택)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="폼에 대한 간단한 설명을 입력하세요." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <FormLabel>폼 필드</FormLabel>
                <div className="space-y-4 mt-2">
                  {fields.map((field, index) => {
                    const watchedField = watchFieldArray[index];
                    const showOptions = watchedField?.type === 'radio' || watchedField?.type === 'select';
                    
                    return (
                    <Card key={field.id} className="p-4 bg-muted/50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name={`fields.${index}.label`}
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>필드 라벨</FormLabel>
                                    <FormControl><Input placeholder="예: 이름" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`fields.${index}.type`}
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>필드 유형</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="text">텍스트</SelectItem>
                                            <SelectItem value="email">이메일</SelectItem>
                                            <SelectItem value="textarea">텍스트 영역</SelectItem>
                                            <SelectItem value="number">숫자</SelectItem>
                                            <SelectItem value="checkbox">체크박스</SelectItem>
                                            <SelectItem value="radio">라디오 버튼</SelectItem>
                                            <SelectItem value="select">셀렉트</SelectItem>
                                            <SelectItem value="hidden">히든</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name={`fields.${index}.placeholder`}
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>플레이스홀더</FormLabel>
                                    <FormControl><Input placeholder="예: 홍길동" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                             {showOptions && (
                                <FormField
                                    control={form.control}
                                    name={`fields.${index}.options`}
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>옵션 (쉼표로 구분)</FormLabel>
                                        <FormControl><Input placeholder="예: 옵션1,옵션2,옵션3" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            )}
                        </div>
                        <div className="flex justify-end mt-2">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => remove(index)}
                                disabled={fields.length <= 1}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </Card>
                  )})}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => append({ label: '', type: 'text', placeholder: '', options: '' })}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  필드 추가
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                폼 생성하기
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}

