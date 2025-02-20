import 'server-only';
import { z } from 'zod';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { findUserByEmail, getCustomers, insertUser } from './db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const secretKey = process.env.SECRET_KEY;
const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ userId, expiresAt });

  (await cookies()).set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt
  });
}

export async function deleteSession() {
  (await cookies()).delete('session');
}

type SessionPayload = {
  userId: string;
  expiresAt: Date;
};

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256']
    });
    return payload;
  } catch (error) {
    console.log('Failed to verify session');
  }
}

export async function login(username: string, password: string) {
  try {
    const data = await findUserByEmail(username); //Checking if user already exists
    //Verifying if the user exists in the database
    if (data.length === 0) {
      return { error: 'User is not registered' };
    } else {
      let message;
      const result = await bcrypt.compare(password, data[0].password);

      //Comparing the hashed password
      if (result === true) {
        //Checking if credentials match

        message = { message: 'User Signed in!' };
      } else {
        //Declaring the errors
        if (!result) {
          console.log('herrere');
          message = { error: 'Incorrect password' };
        }
      }

      return message;
    }
  } catch (err) {
    console.log(err);
    return { error: 'Database error occurred while signing in' };
  }
}

export async function getUser() {
  const cookieStore = await cookies();
  const decryptedValue = await decrypt(cookieStore.get('session')?.value);

  if (typeof decryptedValue?.userId === 'string') {
    const user = await findUserByEmail(decryptedValue?.userId);

    return user[0];
  }
}

export async function getAllCustomers() {
  const cookieStore = await cookies();
  const decryptedValue = await decrypt(cookieStore.get('session')?.value);

  if (typeof decryptedValue?.userId === 'string') {
    const user = await findUserByEmail(decryptedValue?.userId);

    const selectedUser = user[0];

    if (selectedUser.isAdmin) {
      const customers = await getCustomers();
      console.log(customers);
      return customers;
    }
  }
}

const loginSchema = z.object({
  username: z.string().email({ message: 'Invalid email address' }).trim(),
  password: z
    .string()
    // .min(8, { message: 'Password must be at least 8 characters' })
    .trim()
});

export async function createCustomer(payload: FormData) {
  let flag = 1; //Declaring a flag
  const result = loginSchema.safeParse(Object.fromEntries(payload));
  console.log(result, Object.fromEntries(payload));
  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors
    };
  }
  const { username, password } = result.data;

  try {
    const data = await findUserByEmail(username); //Checking if user already exists

    if (data.length != 0) {
      return new NextResponse(
        JSON.stringify({
          error: 'Email already there, No need to register again.'
        }),
        { status: 400 }
      );
    } else {
      await bcrypt.hash(password, 10, async (err, hash) => {
        if (err)
          return new NextResponse(
            JSON.stringify({
              error: 'Server error'
            }),
            { status: 500 }
          );

        const user = {
          username,
          password: hash
        };

        //Inserting data into the database

        if (typeof user.password !== 'string') {
          return new NextResponse(
            JSON.stringify({
              error: 'Error hasing password'
            }),
            { status: 500 }
          );
        }
        await insertUser(user.password, user.username);

        if (err) {
          flag = 0; //If user is not inserted is not inserted to database assigning flag as 0/false.
          console.error(err);
          return new NextResponse(
            JSON.stringify({
              error: 'Database error'
            }),
            { status: 500 }
          );
        } else {
          flag = 1;
          return new NextResponse(
            JSON.stringify({
              message: 'User added to database, not verified'
            }),
            { status: 200 }
          );
        }
      });
      if (flag) {
        const token = jwt.sign(
          //Signing a jwt token
          {
            email: username
          },
          process.env.SECRET_KEY as jwt.PrivateKey
        );
        console.log(token);
        return new NextResponse(
          JSON.stringify({
            data: token,
            message: 'Register Success'
          }),
          { status: 200 }
        );
      }
    }
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({
        message:
          'Database error while registring user!", //Database connection error'
      }),
      { status: 500 }
    );
  }
}
