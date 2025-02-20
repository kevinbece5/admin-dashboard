import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { findUserByEmail } from './db';
import bcrypt from 'bcryptjs';

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
