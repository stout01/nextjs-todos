import { getSession, useSession } from 'next-auth/client';
import React from 'react';

function List({ items }) {
  const [session, loading] = useSession();

  // When rendering client side don't display anything until loading is complete
  if (loading) return null;

  // If no session exists, display access denied message
  if (!session) {
    return <div>ACCESS DENIED!</div>;
  }

  return (
    <ul>
      {items.map((item) => (
        <li key={item.name}>{item.name}</li>
      ))}
    </ul>
  );
}

// This gets called on every request
export async function getServerSideProps(context) {
  const session = await getSession(context);
  let content = null;

  if (session) {
    const hostname = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const options = { headers: { cookie: context.req.headers.cookie } };
    const res = await fetch(`${hostname}/api/lists/${context.params.id}`, options);
    content = await res.json();
  }

  // Pass data to the page via props
  return { props: { items: content } };
}

export default List;
