import { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import dbConnect from './db';
import User from '@/models/User';

if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error('GOOGLE_CLIENT_ID não está definido');
}
if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error('GOOGLE_CLIENT_SECRET não está definido');
}
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('NEXTAUTH_SECRET não está definido');
}

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET as string,
  debug: process.env.NODE_ENV === 'development',
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'google') {
        return true;
      }

      if (!user?.email) {
        console.error('Email do usuário não disponível no callback signIn');
        return true;
      }

      try {
        await dbConnect();
        
        const existingUser = await User.findOne({ email: user.email });
        
        if (!existingUser) {
          const newUser = await User.create({
            name: user.name || '',
            email: user.email,
            image: user.image || '',
            emailVerified: null,
          });
          console.log('Novo usuário criado no MongoDB:', newUser.email);
        } else {
          await User.findOneAndUpdate(
            { email: user.email },
            {
              name: user.name || existingUser.name,
              image: user.image || existingUser.image,
            },
            { new: true }
          );
          console.log('Usuário atualizado no MongoDB:', user.email);
        }
        
        return true;
      } catch (error: any) {
        console.error('Erro ao salvar usuário no banco de dados:', error);
        
        if (error.code === 11000) {
          console.log('Usuário já existe (duplicado), continuando login...');
          return true;
        }
        
        console.warn('Continuando login mesmo com erro no banco de dados');
        return true;
      }
    },
    async session({ session, token }) {
      if (session?.user?.email) {
        try {
          await dbConnect();
          const dbUser = await User.findOne({ email: session.user.email });
          
          if (dbUser && session.user) {
            session.user.id = dbUser._id.toString();
          }
        } catch (error) {
          console.error('Erro ao buscar usuário na sessão:', error);
        }
      }
      return session;
    },
  },
};
