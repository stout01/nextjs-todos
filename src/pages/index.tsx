import Head from 'next/head';
import Link from 'next/link';
import { Container, Link as MaterialLink } from '@material-ui/core';
import React from 'react';
import Grid from '@material-ui/core/Grid/Grid';

export default function Home() {
  return (
    <div>
      <Head>
        <title>My Todos!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container maxWidth="lg">
        <Grid container direction="row" justify="center" alignItems="center" alignContent="center">
          <Grid item xs={1}>
            <Link href="/todo" passHref>
              <MaterialLink>Your Todo List</MaterialLink>
            </Link>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
