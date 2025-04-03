// pages/_app.js
import '../styles/global.css'; // Global styles
import '../styles/index.css'; // Page-specific styles

import { AuthProvider } from '../components/AuthContext'; // Corrected path

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
