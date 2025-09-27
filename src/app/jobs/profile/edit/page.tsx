'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Loader2, FilePenLine } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FirebaseError } from 'firebase/app';

const formSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요.'),
  password: z.string().min(6, '비밀번호는 6자 이상이어야 합니다.').or(z.literal('')),
  confirmPassword: z.string().optional(),
}).refine((data) => {
    if (data.password) {
        return data.password === data.confirmPassword;
    }
    return true;
}, {
  message: "비밀번호가 일치하지 않습니다.",
  path: ["confirmPassword"],
});

export default function EditProfilePage() {
  const { user, updateUser, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/login');
    } else if (user) {
      form.setValue('name', user.name);
    }
  }, [user, isAuthLoading, router, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;
    setIsSubmitting(true);
    
    try {
        await updateUser(values.name, values.password || undefined);
        toast({
            title: '프로필 업데이트',
            description: '프로필 정보가 성공적으로 변경되었습니다.',
        });
        router.push('/jobs/profile');
    } catch (error) {
        let errorMessage = '프로필 업데이트 중 오류가 발생했습니다.';
        if (error instanceof FirebaseError) {
            if (error.code === 'auth/requires-recent-login') {
                errorMessage = '보안을 위해 다시 로그인한 후 비밀번호를 변경해주세요.';
            }
        }
        toast({
            variant: 'destructive',
            title: '업데이트 실패',
            description: errorMessage,
        });
    } finally {
        setIsSubmitting(false);
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
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FilePenLine className="h-6 w-6" /> 개인정보 수정
          </CardTitle>
          <CardDescription>
            이름 또는 비밀번호를 변경할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이름</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>새 비밀번호</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="새 비밀번호를 입력하세요 (선택 사항)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>새 비밀번호 확인</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="새 비밀번호를 다시 입력하세요" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                저장하기
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
