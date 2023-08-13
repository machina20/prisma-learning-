import NextAuth, {type NextAuthOptions} from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";
import { prisma } from "../../../../../lib/prisma";
import { compare } from "bcrypt";

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
        password: {label: 'Password', type: 'password'}
      },

      async authorize(credentials){
        if (!credentials?.email || !credentials?.password){
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })
        //we looked up the user, lets see if it exists
        if (!user){
          return null
        }
        
        const isPasswordValid = await compare(credentials.password, user.password)

        if (!isPasswordValid){
          return null
        }
        //we have to return it as a string
        return {
          id: user.id + "",
          email: user.email,
          name: user.name,
          randomKey: "uhhhhhhh"
        }
      }
    })
  ],
  callbacks: {
    session: ({session, token}) =>{
      console.log("session callback", {session, token})
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
      console.log("jwt callback:", {token, user})
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