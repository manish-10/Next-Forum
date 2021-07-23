import React from "react";
import Layout from "../../src/components/Layout";
import { hasuraUserClient, gql } from "../../src/lib/hasura-user-client";
import useSWR from "swr";
import { useRouter } from "next/router";
import PostList from "../../src/components/PostList";
import PostForm from "../../src/components/PostForm";
import { useAuthState } from "../../src/context/auth";
const GetThreadsId = gql`
  query GetThreadsId {
    threads {
      id
    }
  }
`;
const GetThreadsById = gql`
  query GetThreadsById($id: uuid!) {
    threads_by_pk(id: $id) {
      id
      title
      locked
      category {
        id
        name
      }
      posts(order_by: { created_at: asc }) {
        id
        message
        created_at
        updated_at
        author {
          id
          name
        }
        like {
          id
          user_id
        }
        like_aggregate {
          aggregate {
            count
          }
        }
      }
    }
  }
`;

const AddPostReply = gql`
  mutation AddPostReply($threadId: uuid!, $message: String!) {
    insert_posts_one(object: { thread_id: $threadId, message: $message }) {
      id
      message
      created_at
      updated_at
      author {
        id
        name
      }
      like {
        id
        user_id
      }
      like_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;

const InsertLikes = gql`
  mutation InsertLikes($postId: uuid!) {
    insert_likes_one(object: { post_id: $postId }) {
      id
    }
  }
`;
const DeleteLikes = gql`
  mutation DeleteLikes($id: uuid!) {
    delete_likes_by_pk(id: $id) {
      id
    }
  }
`;
const DeletePost = gql`
  mutation DeletePost($id: uuid!) {
    delete_posts_by_pk(id: $id) {
      id
    }
  }
`;
const UpdatePost = gql`
  mutation UpdatePost($id: uuid!, $message: String!) {
    update_posts_by_pk(pk_columns: { id: $id }, _set: { message: $message }) {
      id
      message
      updated_at
    }
  }
`;
const UpdateLockedThreadStatus = gql`
  mutation UpdatePost($id: uuid!, $locked: Boolean) {
    update_threads_by_pk(pk_columns: { id: $id }, _set: { locked: $locked }) {
      id
      locked
    }
  }
`;
const ThreadPage = ({ initialData }) => {
  const router = useRouter();
  const hasuraClient = hasuraUserClient();
  const { id, isFallback } = router.query;
  const { isAuthenticated } = useAuthState();
  const { data, mutate } = useSWR(
    [GetThreadsById, id],
    (query, id) => hasuraClient.request(query, { id }),
    {
      initialData,
      refreshInterval: 1000,
      revalidateOnMount: true,
    }
  );

  if (!isFallback && !data) return <p>No such thread found</p>;

  const handlePostSubmit = async ({ message }, { target }) => {
    try {
      const { insert_posts_one } = await hasuraClient.request(AddPostReply, {
        threadId: id,
        message,
      });
      target.reset();
      mutate({
        ...data,
        threads_by_pk: {
          ...data.threads_by_pk,
          posts: [...data.threads_by_pk.posts, insert_posts_one],
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = async ({ id, message }, { target }) => {
    try {
      const { update_posts_by_pk } = await hasuraClient.request(UpdatePost, {
        id,
        message,
      });

      mutate({
        ...data,
        threads_by_pk: {
          ...data.threads_by_pk,
          posts: data.threads_by_pk.posts.reduce((posts, post) => {
            if (post.id === id)
              return [...posts, { ...post, ...update_posts_by_pk }];

            return [...posts, post];
          }, []),
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleLikes = async (postId) => {
    await hasuraClient.request(InsertLikes, {
      postId,
    });
  };

  const handleUnLikes = async (id) => {
    try {
      await hasuraClient.request(DeleteLikes, { id });
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await hasuraClient.request(DeletePost, { id });
      mutate({
        ...data,
        threads_by_pk: {
          ...data.threads_by_pk,
          posts: data.threads_by_pk.posts.filter((p) => p.id != id),
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleLocked = async () => {
    try {
      const { update_threads_by_pk } = await hasuraClient.request(
        UpdateLockedThreadStatus,
        {
          id,
          locked: !data.threads_by_pk.locked,
        }
      );

      mutate({
        ...data,
        ...update_threads_by_pk,
      });
    } catch (err) {
      console.log(err);
    }
  };
  if (isFallback) return <Layout>Loading thread</Layout>;
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-semibold">
        {data.threads_by_pk.title}
      </h1>
      <div className="flex p-1 items-center">
        {data.threads_by_pk.locked && (
          <span className="bg-red-300 text-red-800 px-2 py-1 rounded-full uppercase">
            Locked
          </span>
        )}
        <button className="flex apearance-none p-1" onClick={handleLocked}>
          {data.threads_by_pk.locked ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-5 h-5 current-fill"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path d="M7 10h13a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V11a1 1 0 0 1 1-1h1V9a7 7 0 0 1 13.262-3.131l-1.789.894A5 5 0 0 0 7 9v1zm-2 2v8h14v-8H5zm5 3h4v2h-4v-2z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-5 h-5 current-fill"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path d="M19 10h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V11a1 1 0 0 1 1-1h1V9a7 7 0 1 1 14 0v1zM5 12v8h14v-8H5zm6 2h2v4h-2v-4zm6-4V9A5 5 0 0 0 7 9v1h10z" />
            </svg>
          )}
        </button>
      </div>
      <div className="p-6 space-y-10">
        <PostList
          posts={data.threads_by_pk.posts}
          actions={{ handleLikes, handleUnLikes, handleDelete, handleUpdate }}
        />
        {!data.threads_by_pk.locked && isAuthenticated && (
          <div className="flex space-x-3">
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
              <PostForm onSubmit={handlePostSubmit} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export const getStaticPaths = async () => {
  const hasuraClient = hasuraUserClient();
  const { threads } = await hasuraClient.request(GetThreadsId);

  return {
    paths: threads.map(({ id }) => ({
      params: { id },
    })),
    fallback: true,
  };
};
export const getStaticProps = async ({ params }) => {
  const hasuraClient = hasuraUserClient();
  const { id } = params;
  const initialData = await hasuraClient.request(GetThreadsById, { id });
  return { props: { initialData }, revalidate: 1 };
};
export default ThreadPage;
ThreadPage.Layout = Layout;
