import "tailwindcss/tailwind.css";
import { AuthProvider } from "../src/context/auth";
import "react-mde/lib/styles/css/react-mde-all.css";
function MyApp({ Component, pageProps }) {
  const Layout = Component.Layout || (({ children }) => <> {children} </>);
  return (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
}

export default MyApp;
