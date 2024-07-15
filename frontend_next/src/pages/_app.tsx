import "@/styles/styles.scss";
import "@/styles/style.css";
import "@/scss/style.scss";
import "@/styles/style-new.css";
import "@/styles/Header.css";
import "@/styles/Footer.css";
import "./Header.css";

import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
