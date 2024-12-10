// pages/_app.js
import '../styles/global.css'; // Import global CSS file

import '../styles/index.css'; // index specific shizz

export default function App({ Component, pageProps }) {
    return <Component {...pageProps} />;
}
