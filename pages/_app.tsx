import "../styles/globals.css";
import "../styles/player.scss";
import "../styles/loader.scss";
import type { AppProps } from "next/app";
import { GlobalProvider } from "../context/GlobalContext";
import SessionTimeout from "../utils/session/sessionTimeOut";
import AudioBar from "../components/Layout/AudioBar";
import { NextRouter, useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router: NextRouter = useRouter();

  return (
    <GlobalProvider>
      <SessionTimeout />
      <div>
       {/*  {router.pathname !== "login" && (
          <div className="">
            <AudioBar />{" "}
          </div>
        )} */}
        <AudioBar />
        <Component {...pageProps} />
      </div>
    </GlobalProvider>
  );
}
