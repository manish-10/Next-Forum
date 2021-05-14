import 'tailwindcss/tailwind.css'
import { AuthProvider } from '../src/context/auth'

function MyApp({ Component, pageProps }) {
  const Layout = Component.Layout || (({children})=> <> {children} </>)
  return (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  )
}

export default MyApp
