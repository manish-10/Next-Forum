import Post from "./Post";
export default function PostList({ posts, actions }) {
  if (!posts) return null;
  return (
    <div className="divide-y">
      {posts.map((post, key) => (
        <Post {...post} actions={{ ...actions }} key={key} />
      ))}
    </div>
  );
}
