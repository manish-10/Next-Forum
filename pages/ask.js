import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/router";
import Layout from "../src/components/Layout";
import { hasuraAdminClient, gql } from "../src/lib/hasura-admin-client";
import { hasuraUserClient } from "../src/lib/hasura-user-client";
import ReactMde from "react-mde";
import ReactMarkdown from "react-markdown";
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
  const [selectedTab, setSelectedTab] = useState("write");
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
  } = useForm();

  const onSubmit = async ({ categoryId, title, message }) => {
    const hasuraClient = hasuraUserClient();
    try {
      const { insert_threads_one } = await hasuraClient.request(InsertThread, {
        categoryId,
        title,
        message,
      });

      router.push(`/thread/${insert_threads_one.id}`);
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
          <Controller
            name="message"
            control={control}
            defaultValue={""}
            rules={{ required: "Leaving an empty post?" }}
            render={({ field }) => (
              <ReactMde
                {...field}
                selectedTab={selectedTab}
                onTabChange={setSelectedTab}
                generateMarkdownPreview={(markdown) =>
                  Promise.resolve(<ReactMarkdown children={markdown} />)
                }
              />
            )}
          />
          {errors.message && <span>{errors.message.message}</span>}
        </div>
        <button
          className="rounded bg-purple-500 p-2 font-semibold text-white hover:bg-purple-600 onfocus:outline-none"
          type="submit"
          disabled={isSubmitting}
        >
          Make a post
        </button>
      </form>
    </>
  );
}

export const getStaticProps = async () => {
  const { categories } = await hasuraAdminClient.request(GetCategories);

  return { props: { categories } };
};
AskPage.Layout = Layout;
