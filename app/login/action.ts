'use server';

import { z } from 'zod';
import {
  createSession,
  deleteSession,
  getUser,
  login as loginUser
} from '../../lib/sessions';

import { redirect } from 'next/navigation';

const loginSchema = z.object({
  username: z.string().email({ message: 'Invalid email address' }).trim(),
  password: z
    .string()
    // .min(8, { message: 'Password must be at least 8 characters' })
    .trim()
});

export async function login(prevState: any, formData: FormData) {
  const result = loginSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors
    };
  }

  const { username, password } = result.data;

  const data = await loginUser(username, password);

  console.log(data);

  if (data?.error) {
    return {
      errors: {
        password: ['Invalid email or password']
      }
    };
  }

  await createSession(username);

  redirect('/');
}

export async function logout() {
  await deleteSession();
  redirect('/login');
}
