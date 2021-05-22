import { useForm } from "react-hook-form";
export default function PostForm({ onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm();

  return (
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <textarea
            className="w-full bg-gray-100 p-3 rounded onfocus:outline-none"
            rows={5}
            {...register("message", { required: "Leaving an empty reply?" })}
            placeholder={"Reply to thread"}
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
      </div>
    </div>
  );
}
