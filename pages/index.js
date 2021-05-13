import { useAuthDispatch, useAuthState } from "../src/context/auth";

export default function Home() {
  const { isAuthenticated, user } = useAuthState();
  const { login, register, logout } = useAuthDispatch();
  return (
    isAuthenticated ? <><p>{`Hello ${user.name}`}</p><button onClick={() => logout()}>Logout</button></> :
      <><button onClick={() => login({ email: "test@test.com", password: "abc123" })}>Login</button>
        <button onClick={() => register({ name: "testuser", email: "test@test.com", password: "abc123" })}>Register</button></>
  )
}
