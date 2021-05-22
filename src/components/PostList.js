import Post from "./Post";
export default function PostList({ posts }) {
  if (!posts) return null;
  return (
    <div className="divide-y">
      {posts.map((post, key) => (
        <Post post={post} key={key} />
      ))}
    </div>
  );
}
