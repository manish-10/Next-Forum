import Layout from "../src/components/Layout";
import { hasuraUserClient, gql } from "../src/lib/hasura-user-client";
import useSWR from "swr";
import { endOfToday, startOfToday } from "date-fns";
import ThreadList from "../src/components/ThreadList";

const GetThreads = gql`
  query GetThreads($to: timestamptz!, $from: timestamptz!) {
    threads(
      where: { created_at: { _gte: $from, _lte: $to } }
      order_by: { pinned: desc, posts_aggregate: { max: { created_at: desc } } }
    ) {
      id
      locked
      pinned
      answered
      title
      author {
        name
      }
      category {
        id
        name
      }
      posts(order_by: { created_at: desc }, limit: 1) {
        id
        created_at
        message
        author {
          name
        }
      }
      posts_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;
const from = new Date(startOfToday()).toISOString();
const to = new Date(endOfToday()).toISOString();
const TodaysPostPage = ({ initialData }) => {
  const hasuraClient = hasuraUserClient();
  const { data, isValidating } = useSWR(
    GetThreads,
    (query) => hasuraClient.request(query, { to, from }),
    {
      initialData,
      refreshInterval: 1000,
      revalidateOnMount: true,
    }
  );
  return (
    <div>
      <p className="text-red-500">Welcome to Forum!</p>
      <ThreadList threads={data.threads} />
    </div>
  );
};

export const getStaticProps = async () => {
  const hasuraClient = hasuraUserClient();
  const initialData = await hasuraClient.request(GetThreads, { to, from });
  return { props: { initialData }, revalidate: 1 };
};

TodaysPostPage.Layout = Layout;

export default TodaysPostPage;
