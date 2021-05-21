import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Layout from "../src/components/Layout";
import { hasuraAdminClient, gql } from "../src/lib/hasura-admin-client";
import { hasuraUserClient } from "../src/lib/hasura-user-client";
const GetCategories = gql`
  {
    categories {
      id
      name
    }
  }
`;
const InsertThread = gql`
  mutation InsertThread(
    $categoryId: uuid!
    $title: String!
    $message: String!
  ) {
    insert_threads_one(
      object: {
        category_id: $categoryId
        title: $title
        posts: { data: { message: $message } }
      }
    ) {
      id
      author {
        name
      }
      title
      category {
        name
      }
      posts {
        message
      }
    }
  }
`;
export default function AskPage({ categories }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm();

  const onSubmit = async ({ categoryId, title, message }) => {
     const hasuraClient = hasuraUserClient();
    try {
      const { insert_threads_one } = await hasuraClient.request(InsertThread, { categoryId, title, message })
      console.log(insert_threads_one)

       router.push(`/threads/${insert_threads_one.id}`)
     
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <h1 className="text-3xl">Ask A Question.</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <select
            {...register("categoryId", { required: "You must choose a " })}
            placeholder={"Post Title"}
          >
            {categories.map(({ name, id }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
          {errors.categoryId && <span>{errors.categoryId.message}</span>}
        </div>
        <div>
          <input
            type="text"
            {...register("title", {
              required: "You must provide a valid title",
            })}
            placeholder={"Post Title"}
          />
          {errors.title && <span>{errors.title.message}</span>}
        </div>
        <div>
          <textarea
            {...register("message", { required: "Leaving an empty post?" })}
            placeholder={"Enter a message"}
          />
          {errors.message && <span>{errors.message.message}</span>}
        </div>
        <input type="submit" disabled={isSubmitting} value={"Make a post"} />
      </form>
    </>
  );
}

export const getStaticProps = async () => {
  const { categories } = await hasuraAdminClient.request(GetCategories);

  return { props: { categories } };
};
AskPage.Layout = Layout;
