import { hash } from "bcrypt";
import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import formData from "form-data";
import Mailgun from "mailgun.js";

//helper function to see if that email already exists in the db
async function emailAvail(email: string){
  const user = await prisma.user.findUnique({
    where: {
      email: email
    }
  }) 
  
  if(user !== null){ 
    return false //false if taken
  } else{
    return true //true if avail
  }
}


export async function POST(req: Request){

  try{
    const {email, password} = await req.json();

    const hashed = await hash(password, 12)
    const emailAvailable = await emailAvail(email)

    if (emailAvailable){ //if email is avail, create the user

      const user = await prisma.user.create({
        data: {
          email, password: hashed,
          
        }
      })

      //create the activation token
      const token = await prisma.activateToken.create({
        data: {
          token: `${randomUUID()}${randomUUID()}`.replace(/-/g, ""),
          userId: user.id,
        },
      });

      // send the email with the token to the user's email
      const API_KEY = process.env.MAILGUN_API_KEY;
      const DOMAIN = process.env.MAILGUN_DOMAIN;

      const mailgun = new Mailgun(formData);
      const client = mailgun.client({
        username: "api",
        key: API_KEY as string,
      });

      const messageData = {
        from: `ryanschwartz.io <me@${DOMAIN}>`,
        to: [user.email],
        subject: `Hello, ${user.name}.`,
        text: `Click this link to verify your email:  http://localhost:3000/api/activate/${token.token}`,
      };

      await client.messages
        .create(DOMAIN as string, messageData)
        .then((msg) => console.log(msg)) // logs response data
        .catch((err) => console.log(err));

      //if the user was successfully 
      return new NextResponse(JSON.stringify({message: `Email verification sent to ${user.email}.`}),{status: 200})
    } 
    
    else
    
    { //if email is not avail, return custom error
      return new NextResponse(JSON.stringify({
        error: "There's already an account associated with that email."
      }), {
        status: 500
      })
    }
    
    
    
  } catch(err: any){ //if theres an error, just send it to the client 
    console.log(err)
    return new NextResponse(JSON.stringify({
      error: err.message
    }), {
      status: 500
    })
  }
  
  

}