import NextAuth, {type NextAuthOptions} from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";
import { prisma } from "../../../../../lib/prisma";
import { compare } from "bcrypt";
import { NextResponse } from "next/server";


export const authOptions: NextAuthOptions = {
  pages:{
    signIn: '/login'
  },
  session: {
    strategy: "jwt"

  },
  providers: [
    CredentialsProvider({
      
      name: 'Sign in',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'hello@example.com'
        },
        password: {label: 'Password', type: 'password'}, token: {}
      },

      
      async authorize(credentials){ 

        console.log("entered the authorize function")
        if (!credentials?.email || !credentials?.password){
          if(!credentials?.token){ //if the singin is missing the token as well as a username OR a pass
            console.log("line 35", !credentials?.token)
            return null

          }
        }

        console.log("token",credentials?.token)

        //find the user based on the email
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })
        
        //we looked up the user, lets see if it exists
        if (!user){
          return null
        }

        // return null if the user isn't active
        if(!user.active){
          console.log("the user hasn't verified their email yet")
          // return new NextResponse(JSON.stringify({
          //   error: "You still have to verify your email address"
          // }))
          return null
        }

        const isPasswordValid = await compare(credentials.password, user.password)

        //if the user is signing in with a verify-token
        //lookup the token
        console.log("entering the token validation conditionals")
        console.log("credentials.token =", credentials.token)

        if (credentials.token){
          const token = await prisma.activateToken.findFirst({
            where: {
              token: credentials.token //find the activation token matching the user
            }
          })
      
          if(token){ //if the token is activated, its an old token and CANT be used to log in
            if(token.activatedAt){
              throw new Error("tried to auth with an already activated token")
              return null

            }

            if (token.userId !== user.id){  //if the unactivated user token doesn't match the token given on signin
              return null
            }
            console.log("the token.id matches the user.id")
          }
        } //if the user submitted a token, the token matches the users ID, and the token is inactive, we continue 
        
      
        if (!isPasswordValid){
          return null
        }


        //we have to return it as a string
        return {
          id: user.id + "",
          email: user.email,
          name: user.name || null,
          randomKey: "uhhhhhhh"
        }
      }
    })
  ],
  callbacks: {
    session: ({session, token}) =>{
      
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          randomKey: token.randomKey
        }
      }
    },
    jwt: ({token, user}) => {
      
      //check if user is being passed in (aka the client logged in)
      if(user){
        const u = user as unknown as any
        return { //we return the token, userid, and the random key to be inside the jwt
          ...token,
          id: u.id,
          randomKey: u.randomKey 
        }
      }
      return token
    }
  }
}

const handler = NextAuth(authOptions)
export {handler as GET, handler as POST}