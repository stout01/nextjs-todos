import NextAuth, { InitOptions } from 'next-auth';
import { Adapter } from 'next-auth/adapters';
import Providers from 'next-auth/providers';
import faunaAdapter from '../../../fauna-adapter';

const options: InitOptions = {
  // Configure one or more authentication providers
  providers: [
    Providers.Auth0({
      clientId: process.env.AUTH0_ID,
      clientSecret: process.env.AUTH0_SECRET,
      domain: process.env.AUTH0_DOMAIN,
    }),
    // ...add more providers here
  ],

  // A database is optional, but required to persist accounts in a database
  // database: process.env.DATABASE_URL,
  adapter: (faunaAdapter.Adapter(null, {}) as unknown) as Adapter,
  debug: true,
};

export default (req, res) => NextAuth(req, res, options);
