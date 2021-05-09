import { useAuthState } from "../src/context/auth";

export default function Home() {
  const {isAuthenticated} = useAuthState();
  return (
   isAuthenticated? "Hello User":"Hello Guest"
  )
}
