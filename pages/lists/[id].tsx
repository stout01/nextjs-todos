// TODO: Need to fetch `posts` (by calling some API endpoint)
//       before this page can be pre-rendered.
function Application({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li>{post.title}</li>
      ))}
    </ul>
  );
}

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  // const res = await fetch(`https://.../data`);
  // const data = await res.json();

  // Pass data to the page via props
  return { props: { posts: [{ title: 'yes!' }] } };
}

export default Application;
