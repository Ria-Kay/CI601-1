// pages/_app.js
import '../styles/index.css'; // Adjust the path based on where your CSS file is located

export default function App({ Component, pageProps }) {
    return <Component {...pageProps} />;
}
