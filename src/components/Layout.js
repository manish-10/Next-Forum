import { useAuthDispatch, useAuthState } from "../context/auth";
import Link from "next/link";

export default function Layout({ children }) {
  const { isAuthenticated, user } = useAuthState();
  const { logout } = useAuthDispatch();
  return (
    <>
      <header className="bg-white py-6 shadow-sm bg-gradient-to-r from-green-400 to-blue-500 font-semibold min-h-100vh">
        <div className="max-w-4xl mx-auto px-6 flex justify-between h-full">
          <div className=" text-white px-3 py-2 rounded-md transition duration-500 ease-in-out bg-indigo-500 hover:bg-green-400 transform hover:-translate-y-1 hover:scale-110 ">
            <Link href="/">
              <a>Home</a>
            </Link>
          </div>

          <div className="text-white px-3 py-2 rounded-md transition duration-500 ease-in-out bg-indigo-500 hover:bg-green-400 transform hover:-translate-y-1 hover:scale-110">
            <Link href="/today">
              <a>Today's Post</a>
            </Link>
          </div>
          {isAuthenticated ? (
            <>
              <Link href="/ask">
                <a className="text-white px-3 py-2 rounded-md transition duration-500 ease-in-out bg-indigo-500 hover:bg-green-500 transform hover:-translate-y-1 hover:scale-110">
                  Ask a question
                </a>
              </Link>
              <p className="text-white px-3 py-2 rounded-md transition duration-500 ease-in-out bg-indigo-500 hover:bg-green-500 transform hover:-translate-y-1 hover:scale-110">{`Hello ${user.name}`}</p>
              <button
                className="font-semibold text-white px-3 py-2 rounded-md transition duration-500 ease-in-out bg-indigo-500 hover:bg-green-400 transform hover:-translate-y-1 hover:scale-110"
                onClick={() => logout()}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/register">
                <a className="text-white px-3 py-2 rounded-md transition duration-500 ease-in-out bg-indigo-500 hover:bg-green-400 transform hover:-translate-y-1 hover:scale-110">
                  Register
                </a>
              </Link>
              <Link href="/auth/login">
                <a className="text-white px-3 py-2 rounded-md transition duration-500 ease-in-out bg-indigo-500 hover:bg-green-400 transform hover:-translate-y-1 hover:scale-110">
                  Login
                </a>
              </Link>
            </>
          )}
        </div>
      </header>
      <div className="max-w-4xl mx-auto p-6">{children}</div>
    </>
  );
}
