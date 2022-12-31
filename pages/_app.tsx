import "../styles/globals.css";
import '../styles/player.scss'
import type { AppProps } from "next/app";
import { GlobalProvider } from "../context/GlobalContext";
import SessionTimeout from '../utils/session/sessionTimeOut'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GlobalProvider>
      <SessionTimeout />
      <Component {...pageProps} />
    </GlobalProvider>
  );
}
