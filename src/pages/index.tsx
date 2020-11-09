import { Box, Button } from '@material-ui/core';
import Grid from '@material-ui/core/Grid/Grid';
import { getProviders, getSession, useSession } from 'next-auth/client';
import Head from 'next/head';
import React from 'react';
import defaultSignIn from '../auth/default-sign-in';
import TodoList from '../components/TodoList';

export default function Home({ items, providers }) {
  const [session, loading] = useSession();
  if (loading) return null;

  let content;
  if (!loading && !session) {
    content = (
      <Box mt={4}>
        <Button size="large" variant="contained" color="primary" onClick={() => defaultSignIn(providers)}>
          Login
        </Button>
      </Box>
    );
  } else {
    content = (
      <Grid item lg={6} xs={12}>
        <TodoList session={session} items={items}></TodoList>
      </Grid>
    );
  }
  return (
    <div>
      <Head>
        <title>My Todos!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Grid container spacing={0} justify="center">
        {content}
      </Grid>
    </div>
  );
}

// This gets called on every request
export async function getServerSideProps(context) {
  const session = await getSession(context);
  const providers = await getProviders();
  let content = null;

  if (session) {
    const hostname = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const options = { headers: { cookie: context.req.headers.cookie } };
    const res = await fetch(`${hostname}/api/todo`, options);
    content = await res.json();
  }

  // Pass data to the page via props
  return { props: { items: content, session, providers } };
}
