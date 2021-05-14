import { useAuthDispatch, useAuthState } from "../src/context/auth";
import Link from 'next/link'
export default function Home() {
  const { isAuthenticated, user } = useAuthState();
  const { login, register, logout } = useAuthDispatch();
  return (
    isAuthenticated ? <><p>{`Hello ${user.name}`}</p><button onClick={() => logout()}>Logout</button></> :
      <><Link href="/auth/register">Register</Link> 
        <Link href="/auth/login">Login</Link>
      </>
  )
}
