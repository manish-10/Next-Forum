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
      posts(order_by: { created_at: asc }) {
        id
        message
        created_at
        author {
          id
          name
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
      author {
        name
      }
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

  const handleSubmit = async ({ message }, { target }) => {
    try {
      console.log(id);
      const hasuraClient = hasuraUserClient();
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
  if (isFallback) return <Layout>Loading thread</Layout>;
  return (
    <div>
      <h1>{data.threads_by_pk.title}</h1>
      <div className="p-6 space-y-10">
        <PostList posts={data.threads_by_pk.posts} />
        {!data.threads_by_pk.locked && isAuthenticated && (
          <PostForm onSubmit={handleSubmit} />
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
