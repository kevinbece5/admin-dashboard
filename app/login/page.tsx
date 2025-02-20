'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { useActionState } from 'react';
import { login } from './action';

export default function LoginPage() {
  const [state, loginAction] = useActionState(login, undefined);

  return (
    <div className="min-h-screen flex justify-center items-start md:items-center p-8">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
        </CardHeader>
        <CardFooter>
          <form action={loginAction} className="w-full">
            <Input name="username" label="Email" type="text" />
            <Input name="password" label="Password" type="password" />

            <Button type="submit" value="Submit">
              Sign In
            </Button>
            {state?.errors?.password && (
              <p className="text-red-500">{state.errors.password}</p>
            )}
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
