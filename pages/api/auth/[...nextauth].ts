import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { checkUserEmailPassword } from "../../../db/dbUser";
import { prisma } from '../../../db/prisma';



export default NextAuth({
    // Configure one or more authentication providers
    providers: [
        // ...add more providers here
        Credentials({
            name: 'Custom Login',
            credentials: {
                email: { label: 'Correo:', type: 'email', placeholder: 'correo@google.com' },
                password: { label: 'Contraseña:', type: 'password', placeholder: 'Contraseña' },
            },
            async authorize(credentials) {
                return await checkUserEmailPassword(credentials!.email, credentials!.password) as any;
            }
        }),
    ],

    // Custom Pages
    pages: {
        signIn: '/auth/login',
        newUser: '/auth/register'
    },

    // Callbacks
    jwt: {
        // secret: process.env.JWT_SECRET_SEED, // deprecated
    },

    session: {
        maxAge: 2592000, /// 30d
        strategy: 'jwt',
    },

    callbacks: {

        async jwt({ token, account, user }) {
            // console.log({ token, account, user });

            if (account) {
                token.accessToken = account.access_token;

                switch (account.type) {

                    // case 'oauth': 
                    //   token.user = await dbUsers.oAUthToDbUser( user?.email || '', user?.name || '' );
                    // break;

                    case 'credentials':
                        token.user = user;
                        break;
                }
            }
            return token;
        },

        async session({ session, token, user }) {

            // console.log({ session, token, user });
            (session as any).accessToken = token.accessToken;
            session.user = token.user as any;
            // const userdb = await Client.findOne({ where: { correo_electronico: (session as any).user.email } })
            const userdb = await prisma.user.findFirst({ where: { email: (session as any).user.email } })
            if ((userdb as any).status === false) {
                (session as any).error = "inactive-user"
            }
            return session;
        }
    }

});