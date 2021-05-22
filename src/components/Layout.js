import { useAuthDispatch, useAuthState } from "../context/auth";
import Link from 'next/link'

export default function Layout({ children }) {
  const { isAuthenticated, user } = useAuthState();
  const { logout } = useAuthDispatch();
  return (
    <>
      <header className="bg-white py-6 shadow-sm">
        <div className="max-w-4xl mx-auto px-6">
          <div><Link href="/"><a>Home</a></Link></div>
          {isAuthenticated ? <><p>{`Hello ${user.name}`}</p><button onClick={() => logout()}>Logout</button><Link href='/ask'><a>Ask a question</a></Link></> :
            <><Link href="/auth/register">Register</Link>
              <Link href="/auth/login">Login</Link>
            </>}

        </div>
      </header>
      <div className="max-w-4xl mx-auto p-6">{children}</div>
    </>
  )
}