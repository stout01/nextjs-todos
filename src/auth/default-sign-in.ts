import { SessionProvider, signIn } from 'next-auth/client';

// Currently only auth0 is supported
// Skip the sign in page and go straight to auth0
export default function defaultSignIn(providers: { [key: string]: SessionProvider }) {
  signIn(providers.auth0.id);
}
