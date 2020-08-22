import "../styles/globals.css";
import "../styles/tailwind.output.css";
import "../components/HomePage.css";

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
