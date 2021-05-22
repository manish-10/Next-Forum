import Layout from "../../src/components/Layout";
import { hasuraUserClient, gql } from "../../src/lib/hasura-user-client";
import ThreadList from "../../src/components/ThreadList";
import useSWR from "swr";
import { useRouter } from "next/router";

const GetCategoryId = gql`
  query GetCategoryId {
    categories {
      id
    }
  }
`;

const GetCategoriesById = gql`
  query GetCategoriesById($id: uuid!) {
    categories_by_pk(id: $id) {
      id
      name
      threads(
        order_by: {
          pinned: desc
          posts_aggregate: { max: { created_at: desc } }
        }
      ) {
        id
        locked
        answered
        title
        author {
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
  }
`;

export default function CategoryPage({ initialData }) {
  const router = useRouter();
  const hasuraClient = hasuraUserClient();
  const { id } = router.query;
  const { data } = useSWR(
    [GetCategoriesById, id],
    (query, id) => hasuraClient.request(query, { id }),
    {
      initialData,
      refreshInterval: 1000,
      revalidateOnMount: true,
    }
  );

  return (
    <div>
      <h1>{data.categories_by_pk.name}</h1>
      <div className="p-6 space-y-10">
        <ThreadList threads={data.categories_by_pk.threads} />
      </div>
    </div>
  );
}

export const getStaticPaths = async () => {
  const hasuraClient = hasuraUserClient();
  const { categories } = await hasuraClient.request(GetCategoryId);

  return {
    paths: categories.map(({ id }) => ({
      params: { id },
    })),
    fallback: true,
  };
};
export const getStaticProps = async ({ params }) => {
  const hasuraClient = hasuraUserClient();
  const { id } = params;
  const initialData = await hasuraClient.request(GetCategoriesById, { id });
  return { props: { initialData }, revalidate: 1 };
};
CategoryPage.Layout = Layout;
