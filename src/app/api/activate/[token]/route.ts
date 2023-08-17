import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { redirect } from "next/navigation";


export async function GET(request: NextRequest, {params}: {params: {token: string}}){

  const {token} = params

  const user = await prisma.user.findFirst({
    where: {
      activateTokens: {
        some: {
          AND:[
            {activatedAt: null,},
            {createdAt: {gt: new Date(Date.now() - 24 * 60 * 60 *1000),},},
            {token,},
          ]
          
        }
      }
    }
  })
  if(!user){
    throw new Error('Invalid Token')
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      active: true,
    }
  })

  await prisma.activateToken.update({
    where: {
      token
    },
    data:{
      activatedAt: new Date()
    }
  })
  
  redirect('/login')


}