import 'server-only';
import { findUserByEmail } from 'lib/db';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();
  try {
    const data = await findUserByEmail(username); //Checking if user already exists
    //Verifying if the user exists in the database

    if (data.length === 0) {
      return new NextResponse(
        JSON.stringify({
          error: 'Email already there, No need to register again.'
        }),
        { status: 400 }
      );
    } else {
      bcrypt.compare(password, data[0].password, (err, result) => {
        //Comparing the hashed password
        if (err) {
          return new NextResponse(
            JSON.stringify({
              error: 'Server error'
            }),
            { status: 500 }
          );
        } else if (result === true) {
          //Checking if credentials match

          return new NextResponse(
            JSON.stringify({
              message: 'User Signed in!'
            }),
            { status: 200 }
          );
        } else {
          //Declaring the errors
          if (!result)
            return new NextResponse(
              JSON.stringify({
                error: 'Incorrect Password'
              }),
              { status: 400 }
            );
        }
      });
    }
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({
        error: 'Database error occurred while signing in!' //Database connection error
      }),
      { status: 500 }
    );
  }
}
