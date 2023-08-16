import { hash } from "bcrypt";
import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

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
    console.log(await emailAvail(email))
    if (await emailAvail(email)){ //if email is avail, create the user
      const user = await prisma.user.create({
        data: {
          email, password: hashed
        }
      })
      return NextResponse.json({
        user: {
          email: user.email
        }
      })
    } else { //if email is not avail, return custom error
      return new NextResponse(JSON.stringify({
        error: "There's already an account associated with that email."
      }), {
        status: 500
      })
    }
    
    
    
  } catch(err: any){
    return new NextResponse(JSON.stringify({
      error: err.message
    }), {
      status: 500
    })
  }
  
  

}