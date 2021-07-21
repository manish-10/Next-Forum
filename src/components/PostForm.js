import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import ReactMde from "react-mde";
import ReactMarkdown from "react-markdown";
export default function PostForm({ defaultValues, onSubmit }) {
  const {
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
  } = useForm({ defaultValues });
  const [selectedTab, setSelectedTab] = useState("write");
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="message"
        control={control}
        defaultValue=""
        rules={{ required: "Leaving an empty reply?" }}
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
      <div>{errors.message && <span>{errors.message.message}</span>}</div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-purple-500 p-2 font-semibold text-white hover:bg-purple-600 onfocus:outline-none"
      >
        Reply
      </button>
    </form>
  );
}
