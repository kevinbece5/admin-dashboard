import 'server-only';
import { db, findUserByEmail, insertUser } from 'lib/db';
import { NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  let flag = 1; //Declaring a flag

  const { username, password } = await request.json();

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
