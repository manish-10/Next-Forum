import { formatRelative } from "date-fns";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import Reactions from "./Reactions";
import { useAuthState } from "../context/auth";
export default function Post({ post, actions }) {
  const today = new Date();
  const { handleLikes, handleUnLikes, handleDelete } = actions;
  const { isAuthenticated, user } = useAuthState();
  const isAuthor = isAuthenticated && user.id === post.author.id;
  const timeago = formatRelative(Date.parse(post.created_at), today, {
    weekStartOn: 1,
  });
  const deletePost = () => {
    handleDelete(post.id);
  };
  if (!post) return null;

  return (
    <div className=" flex space-x-3 py-6 place-items-center">
      <div>
        <span className="inline-block h-8 w-8 rounded-full overflow-hidden bg-gray-200">
          <svg
            className="h-full w-full text-gray-600"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </span>
      </div>
      <div className="flex-1">
        <div className="flex justify-between">
          <Link href={`/user/${post.author.id}`}>
            <a className="pb-2">
              <h3 className="text-xl font-semibold">{post.author.name}</h3>
            </a>
          </Link>
          <div>
            {isAuthor && (
              <button onClick={deletePost} className="appearance-none p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="current-fill h-4 w-4"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path d="M7 4V2h10v2h5v2h-2v15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6H2V4h5zM6 6v14h12V6H6zm3 3h2v8H9V9zm4 0h2v8h-2V9z" />
                </svg>
              </button>
            )}
          </div>
        </div>
        <div className="text-md text-gray-600">
          <ReactMarkdown children={post.message} />
        </div>
        <div className="inline-flex space-x-3">
          <span className="align-middle text-sm">{timeago}</span>
        </div>
        <div>
          <Reactions
            handleUnLikes={handleUnLikes}
            handleLikes={handleLikes}
            likes={post.like}
            likes_agg={post.like_aggregate.aggregate.count}
            postId={post.id}
          />
        </div>
      </div>
    </div>
  );
}
